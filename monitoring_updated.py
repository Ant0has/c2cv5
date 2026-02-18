# -*- coding: utf-8 -*-
"""
Система мониторинга рекламных кампаний Яндекс.Директ
Расширенная версия с актуальными метриками
"""

import sys
import json
import csv
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from pathlib import Path

from yandex_direct_api import YandexDirectAPI


class CampaignMonitor:
    """Мониторинг эффективности кампаний"""

    # Пороговые значения для алертов
    ALERT_CTR_LOW = 3.0        # CTR ниже 3% — проблема
    ALERT_CTR_CRITICAL = 1.0   # CTR ниже 1% — критично
    ALERT_CPC_HIGH = 35.0      # CPC выше 35₽ — дорого
    ALERT_BUDGET_90 = 0.9      # 90% бюджета израсходовано
    ALERT_NO_IMPRESSIONS_HOURS = 4  # Нет показов N часов
    ALERT_SPEND_ANOMALY_MULTIPLIER = 2.0  # Расход в N раз выше среднего
    ALERT_CPC_GROWTH_PERCENT = 40  # Рост CPC на N%
    CONVERSIONS_THRESHOLD = 50  # Порог для перехода на оптимизацию

    def __init__(self, reports_dir: str = "reports"):
        self.api = YandexDirectAPI()
        self.reports_dir = Path(reports_dir)
        self.reports_dir.mkdir(exist_ok=True)
        self._stats_cache = {}  # Кэш для хранения истории

    def get_daily_stats(self, campaign_ids: List[int] = None,
                        date: str = None) -> List[Dict]:
        """Получить статистику за день"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')

        report = self.api.get_report(
            report_type="CAMPAIGN_PERFORMANCE_REPORT",
            date_from=date,
            date_to=date,
            field_names=[
                "CampaignId", "CampaignName",
                "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc",
                "Conversions", "CostPerConversion"
            ],
            campaign_ids=campaign_ids
        )

        return self._parse_report(report)

    def get_period_stats(self, campaign_ids: List[int] = None,
                         days: int = 7) -> List[Dict]:
        """Получить статистику за период"""
        date_from = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        date_to = datetime.now().strftime('%Y-%m-%d')

        report = self.api.get_report(
            report_type="CAMPAIGN_PERFORMANCE_REPORT",
            date_from=date_from,
            date_to=date_to,
            field_names=[
                "CampaignId", "CampaignName", "Date",
                "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc",
                "Conversions", "CostPerConversion"
            ],
            campaign_ids=campaign_ids
        )

        return self._parse_report(report)

    def get_hourly_stats(self, campaign_ids: List[int] = None) -> List[Dict]:
        """Получить статистику по часам за сегодня"""
        today = datetime.now().strftime('%Y-%m-%d')

        report = self.api.get_report(
            report_type="CAMPAIGN_PERFORMANCE_REPORT",
            date_from=today,
            date_to=today,
            field_names=[
                "CampaignId", "CampaignName", "Date",
                "Impressions", "Clicks", "Cost"
            ],
            campaign_ids=campaign_ids
        )

        return self._parse_report(report)

    def _parse_report(self, report: str) -> List[Dict]:
        """Парсинг TSV-отчёта"""
        lines = report.strip().split('\n')
        if len(lines) < 2:
            return []

        headers = lines[0].split('\t')
        result = []

        for line in lines[1:]:
            values = line.split('\t')
            if len(values) == len(headers):
                row = {}
                for i, header in enumerate(headers):
                    value = values[i]
                    # Конвертируем числовые поля
                    if header in ['Impressions', 'Clicks', 'Conversions']:
                        row[header] = int(value) if value and value != '--' else 0
                    elif header in ['Cost', 'Ctr', 'AvgCpc', 'CostPerConversion']:
                        row[header] = float(value) if value and value != '--' else 0.0
                    else:
                        row[header] = value
                result.append(row)

        return result

    # ==================== НОВЫЕ МЕТРИКИ ====================

    def check_budget_exhaustion(self, campaign_ids: List[int] = None) -> List[Dict]:
        """
        Проверить исчерпание бюджета раньше срока

        Логика: если за первые N дней недели израсходовано более (N/7 + 20%) бюджета,
        то бюджет закончится раньше конца недели
        """
        alerts = []

        # Получаем кампании с бюджетами
        campaigns = self.api.get_campaigns(ids=campaign_ids) if campaign_ids else \
                    self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        # Получаем расход за текущую неделю (с понедельника)
        today = datetime.now()
        monday = today - timedelta(days=today.weekday())
        days_passed = (today - monday).days + 1  # Сколько дней прошло с понедельника

        week_stats = self.get_period_stats(
            campaign_ids=[c['Id'] for c in campaigns],
            days=days_passed
        )

        # Агрегируем расход по кампаниям
        spend_by_campaign = {}
        for row in week_stats:
            cid = row.get('CampaignId')
            if cid not in spend_by_campaign:
                spend_by_campaign[cid] = 0
            spend_by_campaign[cid] += row.get('Cost', 0)

        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign.get('Name', 'Unknown')

            # Получаем недельный бюджет из стратегии
            # Для TextCampaign бюджет может быть в разных местах
            weekly_budget = None

            # Пробуем получить из DailyBudget (если есть)
            daily_budget = campaign.get('DailyBudget', {})
            if daily_budget and daily_budget.get('Amount'):
                weekly_budget = daily_budget['Amount'] * 7 / 1000000  # Из микрорублей

            # Если нет дневного, ищем недельный
            text_campaign = campaign.get('TextCampaign', {})
            strategy = text_campaign.get('BiddingStrategy', {})
            search = strategy.get('Search', {})

            # WB_MAXIMUM_CLICKS имеет WeeklySpendLimit
            if 'WeeklySpendLimit' in search:
                weekly_budget = search['WeeklySpendLimit'] / 1000000

            if not weekly_budget:
                continue

            current_spend = spend_by_campaign.get(str(cid), spend_by_campaign.get(cid, 0))

            # Ожидаемый расход к этому дню (линейно)
            expected_spend_ratio = days_passed / 7
            actual_spend_ratio = current_spend / weekly_budget if weekly_budget > 0 else 0

            # Если расход опережает план на 20%+ — алерт
            if actual_spend_ratio > expected_spend_ratio + 0.2:
                days_left = 7 - days_passed
                projected_total = (current_spend / days_passed) * 7 if days_passed > 0 else 0
                overspend = projected_total - weekly_budget

                alerts.append({
                    'level': 'CRITICAL' if actual_spend_ratio > 0.9 else 'WARNING',
                    'type': 'BUDGET_EXHAUSTION',
                    'campaign': name,
                    'campaign_id': cid,
                    'message': f'Бюджет исчерпывается! {current_spend:.0f}₽/{weekly_budget:.0f}₽ ({actual_spend_ratio*100:.0f}%), осталось {days_left} дней',
                    'current_spend': current_spend,
                    'weekly_budget': weekly_budget,
                    'spend_ratio': actual_spend_ratio
                })

        return alerts

    def check_no_impressions(self, campaign_ids: List[int] = None,
                              hours_threshold: int = None) -> List[Dict]:
        """
        Проверить отсутствие показов за последние N часов

        Используем сравнение с предыдущими днями: если сегодня показов
        значительно меньше, чем обычно в это время — проблема
        """
        alerts = []
        hours_threshold = hours_threshold or self.ALERT_NO_IMPRESSIONS_HOURS

        # Получаем кампании
        campaigns = self.api.get_campaigns(ids=campaign_ids, states=['ON']) if campaign_ids else \
                    self.api.get_campaigns(states=['ON'])

        if not campaigns:
            return alerts

        campaign_ids_list = [c['Id'] for c in campaigns]

        # Статистика за сегодня
        today_stats = self.get_daily_stats(campaign_ids_list)

        # Статистика за предыдущие 7 дней (для сравнения среднего)
        week_stats = self.get_period_stats(campaign_ids_list, days=7)

        # Среднее количество показов в день по кампаниям
        avg_impressions = {}
        for row in week_stats:
            cid = row.get('CampaignId')
            if cid not in avg_impressions:
                avg_impressions[cid] = []
            avg_impressions[cid].append(row.get('Impressions', 0))

        for cid, impressions_list in avg_impressions.items():
            avg_impressions[cid] = sum(impressions_list) / len(impressions_list) if impressions_list else 0

        # Проверяем каждую кампанию
        current_hour = datetime.now().hour
        expected_ratio = current_hour / 24  # Какую долю дня мы прошли

        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign.get('Name', 'Unknown')

            # Показы сегодня
            today = next((s for s in today_stats if str(s.get('CampaignId')) == str(cid)), None)
            today_impressions = today.get('Impressions', 0) if today else 0

            # Ожидаемые показы к этому часу (на основе среднего)
            avg_daily = avg_impressions.get(str(cid), avg_impressions.get(cid, 0))
            expected_impressions = avg_daily * expected_ratio

            # Если показов меньше 20% от ожидаемых и прошло достаточно времени
            if current_hour >= hours_threshold and avg_daily > 50:
                if today_impressions < expected_impressions * 0.2:
                    alerts.append({
                        'level': 'CRITICAL',
                        'type': 'NO_IMPRESSIONS',
                        'campaign': name,
                        'campaign_id': cid,
                        'message': f'Нет показов! Сегодня: {today_impressions}, ожидалось: ~{expected_impressions:.0f}',
                        'today_impressions': today_impressions,
                        'expected_impressions': expected_impressions
                    })

        return alerts

    def check_anomaly_spend(self, campaign_ids: List[int] = None) -> List[Dict]:
        """
        Проверить аномальный расход (слишком быстрый или медленный)
        """
        alerts = []

        campaigns = self.api.get_campaigns(ids=campaign_ids, states=['ON', 'SUSPENDED']) if campaign_ids else \
                    self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        if not campaigns:
            return alerts

        campaign_ids_list = [c['Id'] for c in campaigns]

        # Статистика за сегодня и за неделю
        today_stats = self.get_daily_stats(campaign_ids_list)
        week_stats = self.get_period_stats(campaign_ids_list, days=7)

        # Средний дневной расход по кампаниям
        avg_spend = {}
        for row in week_stats:
            cid = row.get('CampaignId')
            if cid not in avg_spend:
                avg_spend[cid] = []
            avg_spend[cid].append(row.get('Cost', 0))

        for cid, spend_list in avg_spend.items():
            avg_spend[cid] = sum(spend_list) / len(spend_list) if spend_list else 0

        current_hour = datetime.now().hour
        if current_hour < 4:  # Слишком рано для выводов
            return alerts

        expected_ratio = current_hour / 24

        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign.get('Name', 'Unknown')

            today = next((s for s in today_stats if str(s.get('CampaignId')) == str(cid)), None)
            today_spend = today.get('Cost', 0) if today else 0

            avg_daily = avg_spend.get(str(cid), avg_spend.get(cid, 0))
            expected_spend = avg_daily * expected_ratio

            if avg_daily < 100:  # Слишком маленький расход для анализа
                continue

            # Слишком быстрый расход
            if today_spend > expected_spend * self.ALERT_SPEND_ANOMALY_MULTIPLIER:
                alerts.append({
                    'level': 'WARNING',
                    'type': 'ANOMALY_SPEND_HIGH',
                    'campaign': name,
                    'campaign_id': cid,
                    'message': f'Аномально высокий расход! {today_spend:.0f}₽ vs ожидаемых {expected_spend:.0f}₽',
                    'today_spend': today_spend,
                    'expected_spend': expected_spend
                })

            # Слишком медленный расход (меньше 30% от ожидаемого после 10:00)
            elif current_hour >= 10 and today_spend < expected_spend * 0.3:
                alerts.append({
                    'level': 'WARNING',
                    'type': 'ANOMALY_SPEND_LOW',
                    'campaign': name,
                    'campaign_id': cid,
                    'message': f'Расход ниже нормы: {today_spend:.0f}₽ vs ожидаемых {expected_spend:.0f}₽',
                    'today_spend': today_spend,
                    'expected_spend': expected_spend
                })

        return alerts

    def check_conversions_threshold(self, campaign_ids: List[int] = None,
                                     threshold: int = None) -> List[Dict]:
        """
        Проверить достижение порога конверсий для перехода на оптимизацию
        """
        alerts = []
        threshold = threshold or self.CONVERSIONS_THRESHOLD

        campaigns = self.api.get_campaigns(ids=campaign_ids, states=['ON', 'SUSPENDED']) if campaign_ids else \
                    self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        if not campaigns:
            return alerts

        # Статистика за 30 дней (для накопления конверсий)
        stats = self.get_period_stats([c['Id'] for c in campaigns], days=30)

        # Суммируем конверсии по кампаниям
        conversions_by_campaign = {}
        for row in stats:
            cid = row.get('CampaignId')
            if cid not in conversions_by_campaign:
                conversions_by_campaign[cid] = 0
            conversions_by_campaign[cid] += row.get('Conversions', 0)

        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign.get('Name', 'Unknown')

            total_conversions = conversions_by_campaign.get(str(cid),
                                                            conversions_by_campaign.get(cid, 0))

            # Проверяем, использует ли кампания автостратегию без оптимизации по конверсиям
            text_campaign = campaign.get('TextCampaign', {})
            strategy = text_campaign.get('BiddingStrategy', {})
            search = strategy.get('Search', {})
            strategy_type = search.get('BiddingStrategyType', '')

            # Если стратегия не оптимизирует по конверсиям и достигнут порог
            non_conversion_strategies = ['WB_MAXIMUM_CLICKS', 'HIGHEST_POSITION',
                                          'LOWEST_COST', 'IMPRESSIONS_BELOW_SEARCH']

            if strategy_type in non_conversion_strategies and total_conversions >= threshold:
                alerts.append({
                    'level': 'INFO',
                    'type': 'CONVERSIONS_THRESHOLD',
                    'campaign': name,
                    'campaign_id': cid,
                    'message': f'Достигнуто {total_conversions} конверсий! Рекомендуем перейти на оптимизацию по конверсиям',
                    'conversions': total_conversions,
                    'threshold': threshold,
                    'current_strategy': strategy_type
                })
            # Предупреждение при приближении к порогу
            elif strategy_type in non_conversion_strategies and total_conversions >= threshold * 0.8:
                alerts.append({
                    'level': 'INFO',
                    'type': 'CONVERSIONS_APPROACHING',
                    'campaign': name,
                    'campaign_id': cid,
                    'message': f'{total_conversions}/{threshold} конверсий — скоро можно переходить на оптимизацию',
                    'conversions': total_conversions,
                    'threshold': threshold
                })

        return alerts

    def check_cpc_growth(self, campaign_ids: List[int] = None,
                          growth_percent: int = None) -> List[Dict]:
        """
        Проверить рост CPC за последние дни
        """
        alerts = []
        growth_percent = growth_percent or self.ALERT_CPC_GROWTH_PERCENT

        campaigns = self.api.get_campaigns(ids=campaign_ids, states=['ON', 'SUSPENDED']) if campaign_ids else \
                    self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        if not campaigns:
            return alerts

        campaign_ids_list = [c['Id'] for c in campaigns]

        # Статистика за последние 3 дня и предыдущие 7 дней
        recent_stats = self.get_period_stats(campaign_ids_list, days=3)
        older_stats = self.get_period_stats(campaign_ids_list, days=10)

        # CPC за последние 3 дня
        recent_cpc = {}
        recent_clicks = {}
        recent_cost = {}
        for row in recent_stats:
            cid = row.get('CampaignId')
            date = row.get('Date', '')

            # Только последние 3 дня
            if cid not in recent_clicks:
                recent_clicks[cid] = 0
                recent_cost[cid] = 0
            recent_clicks[cid] += row.get('Clicks', 0)
            recent_cost[cid] += row.get('Cost', 0)

        for cid in recent_clicks:
            if recent_clicks[cid] > 0:
                recent_cpc[cid] = recent_cost[cid] / recent_clicks[cid]

        # CPC за предыдущий период (дни 4-10)
        older_cpc = {}
        older_clicks = {}
        older_cost = {}

        three_days_ago = (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d')

        for row in older_stats:
            cid = row.get('CampaignId')
            date = row.get('Date', '')

            # Только старые даты
            if date < three_days_ago:
                if cid not in older_clicks:
                    older_clicks[cid] = 0
                    older_cost[cid] = 0
                older_clicks[cid] += row.get('Clicks', 0)
                older_cost[cid] += row.get('Cost', 0)

        for cid in older_clicks:
            if older_clicks[cid] > 0:
                older_cpc[cid] = older_cost[cid] / older_clicks[cid]

        # Сравниваем
        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign.get('Name', 'Unknown')

            current = recent_cpc.get(str(cid), recent_cpc.get(cid, 0))
            previous = older_cpc.get(str(cid), older_cpc.get(cid, 0))

            if previous > 0 and recent_clicks.get(str(cid), recent_clicks.get(cid, 0)) > 10:
                growth = ((current - previous) / previous) * 100

                if growth >= growth_percent:
                    alerts.append({
                        'level': 'WARNING',
                        'type': 'CPC_GROWTH',
                        'campaign': name,
                        'campaign_id': cid,
                        'message': f'CPC вырос на {growth:.0f}%: {previous:.1f}₽ → {current:.1f}₽',
                        'previous_cpc': previous,
                        'current_cpc': current,
                        'growth_percent': growth
                    })

        return alerts

    def check_all_alerts(self, campaign_ids: List[int] = None) -> List[Dict]:
        """
        Проверить все условия для алертов
        """
        all_alerts = []

        # Базовые алерты (CTR, CPC)
        campaigns = self.api.get_campaigns(ids=campaign_ids, states=['ON', 'SUSPENDED']) if campaign_ids else \
                    self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        if campaigns:
            stats = self.get_daily_stats([c['Id'] for c in campaigns])
            all_alerts.extend(self.check_alerts(stats))

        # Новые метрики
        all_alerts.extend(self.check_budget_exhaustion(campaign_ids))
        all_alerts.extend(self.check_no_impressions(campaign_ids))
        all_alerts.extend(self.check_anomaly_spend(campaign_ids))
        all_alerts.extend(self.check_conversions_threshold(campaign_ids))
        all_alerts.extend(self.check_cpc_growth(campaign_ids))

        # Сортируем по важности
        level_order = {'CRITICAL': 0, 'WARNING': 1, 'INFO': 2}
        all_alerts.sort(key=lambda x: level_order.get(x.get('level', 'INFO'), 3))

        return all_alerts

    def check_alerts(self, stats: List[Dict]) -> List[Dict]:
        """Проверить условия для базовых алертов (CTR, CPC)"""
        alerts = []

        for row in stats:
            campaign_name = row.get('CampaignName', 'Unknown')
            campaign_id = row.get('CampaignId')
            ctr = row.get('Ctr', 0)
            cpc = row.get('AvgCpc', 0)
            impressions = row.get('Impressions', 0)

            # Проверяем только если есть достаточно данных
            if impressions < 50:
                continue

            # Критически низкий CTR
            if ctr < self.ALERT_CTR_CRITICAL:
                alerts.append({
                    'level': 'CRITICAL',
                    'type': 'CTR_CRITICAL',
                    'campaign': campaign_name,
                    'campaign_id': campaign_id,
                    'message': f'Критически низкий CTR: {ctr:.2f}%',
                    'metric': 'ctr',
                    'value': ctr
                })
            elif ctr < self.ALERT_CTR_LOW:
                alerts.append({
                    'level': 'WARNING',
                    'type': 'CTR_LOW',
                    'campaign': campaign_name,
                    'campaign_id': campaign_id,
                    'message': f'Низкий CTR: {ctr:.2f}%',
                    'metric': 'ctr',
                    'value': ctr
                })

            # Высокий CPC
            if cpc > self.ALERT_CPC_HIGH:
                alerts.append({
                    'level': 'WARNING',
                    'type': 'CPC_HIGH',
                    'campaign': campaign_name,
                    'campaign_id': campaign_id,
                    'message': f'Высокий CPC: {cpc:.2f}₽',
                    'metric': 'cpc',
                    'value': cpc
                })

        return alerts

    def print_dashboard(self, campaign_ids: List[int] = None) -> None:
        """Вывести дашборд с ключевыми метриками"""
        sys.stdout.reconfigure(encoding='utf-8')

        print("\n" + "═" * 70)
        print("  📊 ДАШБОРД МОНИТОРИНГА КАМПАНИЙ")
        print("═" * 70)
        print(f"  Дата: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("─" * 70)

        # Получаем кампании
        if campaign_ids:
            campaigns = self.api.get_campaigns(ids=campaign_ids)
        else:
            campaigns = self.api.get_campaigns(states=['ON', 'SUSPENDED'])

        if not campaigns:
            print("  Нет активных кампаний")
            return

        # Получаем статистику за сегодня и за неделю
        campaign_ids = [c['Id'] for c in campaigns]
        today_stats = self.get_daily_stats(campaign_ids)
        week_stats = self.get_period_stats(campaign_ids, days=7)

        # Агрегируем недельную статистику по кампаниям
        week_by_campaign = {}
        for row in week_stats:
            cid = row.get('CampaignId')
            if cid not in week_by_campaign:
                week_by_campaign[cid] = {
                    'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0
                }
            week_by_campaign[cid]['impressions'] += row.get('Impressions', 0)
            week_by_campaign[cid]['clicks'] += row.get('Clicks', 0)
            week_by_campaign[cid]['cost'] += row.get('Cost', 0)
            week_by_campaign[cid]['conversions'] += row.get('Conversions', 0)

        # Выводим по каждой кампании
        total_today = {'impressions': 0, 'clicks': 0, 'cost': 0}
        total_week = {'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}

        for campaign in campaigns:
            cid = campaign['Id']
            name = campaign['Name'][:40]
            state = campaign['State']

            state_icon = "🟢" if state == 'ON' else "🔴" if state == 'OFF' else "⏸️"

            # Данные за сегодня
            today = next((s for s in today_stats if s.get('CampaignId') == str(cid)), None)
            t_imp = today.get('Impressions', 0) if today else 0
            t_clicks = today.get('Clicks', 0) if today else 0
            t_cost = today.get('Cost', 0) if today else 0
            t_ctr = (t_clicks / t_imp * 100) if t_imp > 0 else 0

            # Данные за неделю
            week = week_by_campaign.get(str(cid), week_by_campaign.get(cid, {}))
            w_imp = week.get('impressions', 0)
            w_clicks = week.get('clicks', 0)
            w_cost = week.get('cost', 0)
            w_conv = week.get('conversions', 0)
            w_ctr = (w_clicks / w_imp * 100) if w_imp > 0 else 0
            w_cpc = (w_cost / w_clicks) if w_clicks > 0 else 0

            print(f"\n  {state_icon} {name}")
            print(f"     {'Сегодня':>12} │ {'За 7 дней':>12}")
            print(f"     ────────────┼─────────────")
            print(f"     {t_imp:>10} │ {w_imp:>10}  показов")
            print(f"     {t_clicks:>10} │ {w_clicks:>10}  кликов")
            print(f"     {t_cost:>10.0f}₽ │ {w_cost:>10.0f}₽  расход")
            print(f"     {t_ctr:>9.1f}% │ {w_ctr:>9.1f}%  CTR")
            if w_cpc > 0:
                print(f"     {'-':>10} │ {w_cpc:>10.1f}₽  CPC")
            if w_conv > 0:
                print(f"     {'-':>10} │ {w_conv:>10}  конверсий")

            # Накапливаем итоги
            total_today['impressions'] += t_imp
            total_today['clicks'] += t_clicks
            total_today['cost'] += t_cost
            total_week['impressions'] += w_imp
            total_week['clicks'] += w_clicks
            total_week['cost'] += w_cost
            total_week['conversions'] += w_conv

        # Итого
        print("\n" + "─" * 70)
        print("  📈 ИТОГО:")
        print(f"     {'Сегодня':>12} │ {'За 7 дней':>12}")
        print(f"     ────────────┼─────────────")
        print(f"     {total_today['impressions']:>10} │ {total_week['impressions']:>10}  показов")
        print(f"     {total_today['clicks']:>10} │ {total_week['clicks']:>10}  кликов")
        print(f"     {total_today['cost']:>10.0f}₽ │ {total_week['cost']:>10.0f}₽  расход")

        if total_today['impressions'] > 0:
            t_ctr = total_today['clicks'] / total_today['impressions'] * 100
            print(f"     {t_ctr:>9.1f}% │", end="")
        else:
            print(f"     {'-':>10} │", end="")

        if total_week['impressions'] > 0:
            w_ctr = total_week['clicks'] / total_week['impressions'] * 100
            print(f" {w_ctr:>9.1f}%  CTR")
        else:
            print(f" {'-':>10}  CTR")

        if total_week['conversions'] > 0:
            print(f"     {'-':>10} │ {total_week['conversions']:>10}  конверсий")

        # Проверяем ВСЕ алерты
        alerts = self.check_all_alerts(campaign_ids)
        if alerts:
            print("\n" + "─" * 70)
            print("  ⚠️  АЛЕРТЫ:")
            for alert in alerts[:10]:
                icon = "🔴" if alert['level'] == 'CRITICAL' else "🟡" if alert['level'] == 'WARNING' else "🔵"
                print(f"     {icon} {alert['campaign'][:30]}: {alert['message']}")

        print("\n" + "═" * 70)

    def export_report(self, campaign_ids: List[int], days: int = 7,
                      format: str = 'csv') -> str:
        """Экспорт отчёта в файл"""
        stats = self.get_period_stats(campaign_ids, days)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = self.reports_dir / f"report_{timestamp}.{format}"

        if format == 'csv':
            if stats:
                with open(filename, 'w', encoding='utf-8-sig', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=stats[0].keys())
                    writer.writeheader()
                    writer.writerows(stats)
        elif format == 'json':
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(stats, f, ensure_ascii=False, indent=2)

        print(f"✓ Отчёт сохранён: {filename}")
        return str(filename)

    def get_search_queries_report(self, campaign_ids: List[int],
                                   days: int = 7) -> List[Dict]:
        """Получить отчёт по поисковым запросам для добавления минус-слов"""
        date_from = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        date_to = datetime.now().strftime('%Y-%m-%d')

        report = self.api.get_report(
            report_type="SEARCH_QUERY_PERFORMANCE_REPORT",
            date_from=date_from,
            date_to=date_to,
            field_names=[
                "CampaignId", "Query", "Impressions", "Clicks", "Ctr"
            ],
            campaign_ids=campaign_ids
        )

        queries = self._parse_report(report)

        # Фильтруем низкоэффективные запросы
        low_ctr_queries = [
            q for q in queries
            if q.get('Impressions', 0) > 20 and q.get('Ctr', 0) < 1.0
        ]

        return sorted(low_ctr_queries, key=lambda x: x.get('Impressions', 0), reverse=True)


def main():
    """Запуск мониторинга"""
    monitor = CampaignMonitor()
    monitor.print_dashboard()


if __name__ == "__main__":
    main()
