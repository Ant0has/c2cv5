# -*- coding: utf-8 -*-
"""
Telegram-бот для управления кампаниями Яндекс.Директ
Обновлённая версия с расширенными уведомлениями
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    ContextTypes, MessageHandler, filters
)

from yandex_direct_api import YandexDirectAPI, YandexDirectError
from bid_manager import BidManager
from monitoring import CampaignMonitor

# Настройки
from bot_config import BOT_TOKEN, ALLOWED_USERS, YANDEX_TOKEN

# Логирование
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    filename='bot.log'
)
logger = logging.getLogger(__name__)

# API клиенты
api = YandexDirectAPI(token=YANDEX_TOKEN)
monitor = CampaignMonitor()
bid_manager = BidManager()


def is_authorized(user_id: int) -> bool:
    """Проверка авторизации пользователя"""
    return user_id in ALLOWED_USERS


def auth_required(func):
    """Декоратор проверки авторизации"""
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = update.effective_user.id
        if not is_authorized(user_id):
            await update.message.reply_text(
                f"⛔ Доступ запрещён\nВаш ID: {user_id}"
            )
            logger.warning(f"Unauthorized access attempt: {user_id}")
            return
        return await func(update, context)
    return wrapper


# ==================== КОМАНДЫ ====================

@auth_required
async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Приветствие и меню"""
    keyboard = [
        [InlineKeyboardButton("📊 Статистика", callback_data="stats")],
        [InlineKeyboardButton("📋 Статус кампаний", callback_data="status")],
        [InlineKeyboardButton("💰 Оптимизация ставок", callback_data="optimize")],
        [InlineKeyboardButton("🔍 Поисковые запросы", callback_data="queries")],
        [InlineKeyboardButton("📈 Отчёт за неделю", callback_data="report_week")],
        [InlineKeyboardButton("⚠️ Проверить алерты", callback_data="check_alerts")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "🚀 *Яндекс.Директ Manager*\n\n"
        "Выберите действие или используйте команды:\n\n"
        "/status — статус кампаний\n"
        "/stats — статистика за сегодня\n"
        "/week — статистика за неделю\n"
        "/optimize — рекомендации по ставкам\n"
        "/queries — поисковые запросы\n"
        "/alerts — проверить все алерты\n"
        "/help — справка",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


@auth_required
async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Справка"""
    await update.message.reply_text(
        "📖 *Справка по командам*\n\n"
        "*Мониторинг:*\n"
        "/status — статус всех кампаний\n"
        "/stats — статистика за сегодня\n"
        "/week — статистика за 7 дней\n"
        "/month — статистика за 30 дней\n"
        "/alerts — проверить все алерты\n\n"
        "*Управление:*\n"
        "/optimize — анализ и рекомендации по ставкам\n"
        "/queries — низкоэффективные запросы\n"
        "/pause [id] — приостановить кампанию\n"
        "/resume [id] — возобновить кампанию\n\n"
        "*Ставки:*\n"
        "/autobid on/off — автоставки\n"
        "/bids — текущие ставки\n\n"
        "*Алерты мониторинга:*\n"
        "🔴 Критический CTR (<1%)\n"
        "🔴 Бюджет исчерпывается\n"
        "🔴 Нет показов\n"
        "🟡 Низкий CTR (<3%)\n"
        "🟡 Высокий CPC (>35₽)\n"
        "🟡 Рост CPC (>40%)\n"
        "🟡 Аномальный расход\n"
        "🔵 Порог конверсий (50+)",
        parse_mode='Markdown'
    )


@auth_required
async def cmd_status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Статус кампаний"""
    await update.message.reply_text("⏳ Загружаю статус кампаний...")

    try:
        campaigns = api.get_campaigns()

        if not campaigns:
            await update.message.reply_text("📭 Нет кампаний")
            return

        # Группируем по статусу
        by_state = {'ON': [], 'SUSPENDED': [], 'OFF': [], 'ARCHIVED': []}
        for c in campaigns:
            state = c.get('State', 'UNKNOWN')
            if state in by_state:
                by_state[state].append(c)

        text = "📋 *Статус кампаний*\n\n"

        icons = {'ON': '🟢', 'SUSPENDED': '⏸️', 'OFF': '🔴', 'ARCHIVED': '📦'}

        for state in ['ON', 'SUSPENDED', 'OFF']:
            items = by_state.get(state, [])
            if items:
                text += f"{icons[state]} *{state}* ({len(items)}):\n"
                for c in items[:5]:
                    text += f"  `{c['Id']}` {c['Name'][:30]}\n"
                if len(items) > 5:
                    text += f"  _...и ещё {len(items)-5}_\n"
                text += "\n"

        archived_count = len(by_state.get('ARCHIVED', []))
        if archived_count:
            text += f"📦 В архиве: {archived_count}\n"

        await update.message.reply_text(text, parse_mode='Markdown')

    except YandexDirectError as e:
        await update.message.reply_text(f"❌ Ошибка API: {e}")


@auth_required
async def cmd_stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Статистика за сегодня"""
    await update.message.reply_text("⏳ Загружаю статистику...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        campaign_ids = [c['Id'] for c in campaigns]
        stats = monitor.get_daily_stats(campaign_ids)

        if not stats:
            await update.message.reply_text("📭 Нет данных за сегодня")
            return

        # Агрегируем
        total = {'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}
        for row in stats:
            total['impressions'] += row.get('Impressions', 0)
            total['clicks'] += row.get('Clicks', 0)
            total['cost'] += row.get('Cost', 0)
            total['conversions'] += row.get('Conversions', 0)

        ctr = (total['clicks'] / total['impressions'] * 100) if total['impressions'] > 0 else 0
        cpc = (total['cost'] / total['clicks']) if total['clicks'] > 0 else 0

        text = (
            f"📊 *Статистика за сегодня*\n\n"
            f"👁 Показы: *{total['impressions']:,}*\n"
            f"👆 Клики: *{total['clicks']:,}*\n"
            f"💰 Расход: *{total['cost']:,.0f}₽*\n"
            f"📈 CTR: *{ctr:.2f}%*\n"
            f"💵 CPC: *{cpc:.1f}₽*\n"
        )

        if total['conversions'] > 0:
            cpa = total['cost'] / total['conversions']
            text += f"🎯 Конверсий: *{total['conversions']}* (CPA: {cpa:.0f}₽)\n"

        # Добавляем алерты
        if ctr < 3 and total['impressions'] > 100:
            text += "\n⚠️ _CTR ниже нормы!_"
        if cpc > 35 and total['clicks'] > 10:
            text += "\n⚠️ _CPC слишком высокий!_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_stats error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_week(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Статистика за неделю"""
    await update.message.reply_text("⏳ Загружаю статистику за неделю...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        campaign_ids = [c['Id'] for c in campaigns]
        stats = monitor.get_period_stats(campaign_ids, days=7)

        if not stats:
            await update.message.reply_text("📭 Нет данных")
            return

        # Агрегируем по кампаниям
        by_campaign = {}
        total = {'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}

        for row in stats:
            cid = row.get('CampaignId')
            name = row.get('CampaignName', 'Unknown')[:25]

            if cid not in by_campaign:
                by_campaign[cid] = {'name': name, 'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}

            by_campaign[cid]['impressions'] += row.get('Impressions', 0)
            by_campaign[cid]['clicks'] += row.get('Clicks', 0)
            by_campaign[cid]['cost'] += row.get('Cost', 0)
            by_campaign[cid]['conversions'] += row.get('Conversions', 0)

            total['impressions'] += row.get('Impressions', 0)
            total['clicks'] += row.get('Clicks', 0)
            total['cost'] += row.get('Cost', 0)
            total['conversions'] += row.get('Conversions', 0)

        ctr = (total['clicks'] / total['impressions'] * 100) if total['impressions'] > 0 else 0
        cpc = (total['cost'] / total['clicks']) if total['clicks'] > 0 else 0

        text = f"📈 *Статистика за 7 дней*\n\n"

        # По кампаниям
        for cid, data in list(by_campaign.items())[:5]:
            c_ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0
            text += f"*{data['name']}*\n"
            text += f"  👁 {data['impressions']:,}  👆 {data['clicks']}  💰 {data['cost']:.0f}₽  📈 {c_ctr:.1f}%"
            if data['conversions'] > 0:
                text += f"  🎯 {data['conversions']}"
            text += "\n\n"

        text += (
            f"━━━━━━━━━━━━━━━\n"
            f"*ИТОГО:*\n"
            f"👁 Показы: *{total['impressions']:,}*\n"
            f"👆 Клики: *{total['clicks']:,}*\n"
            f"💰 Расход: *{total['cost']:,.0f}₽*\n"
            f"📈 CTR: *{ctr:.2f}%*\n"
            f"💵 CPC: *{cpc:.1f}₽*\n"
        )

        if total['conversions'] > 0:
            cpa = total['cost'] / total['conversions']
            text += f"🎯 Конверсий: *{total['conversions']}* (CPA: {cpa:.0f}₽)\n"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_week error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_alerts(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Проверить все алерты"""
    await update.message.reply_text("⏳ Проверяю все метрики...")

    try:
        alerts = monitor.check_all_alerts()

        if not alerts:
            await update.message.reply_text(
                "✅ *Всё в порядке!*\n\n"
                "Критических проблем не обнаружено.",
                parse_mode='Markdown'
            )
            return

        text = "⚠️ *Обнаружены проблемы*\n\n"

        # Группируем по уровню
        critical = [a for a in alerts if a['level'] == 'CRITICAL']
        warning = [a for a in alerts if a['level'] == 'WARNING']
        info = [a for a in alerts if a['level'] == 'INFO']

        if critical:
            text += "🔴 *КРИТИЧЕСКИЕ:*\n"
            for alert in critical[:5]:
                text += f"  • {alert['campaign'][:25]}\n    {alert['message']}\n"
            text += "\n"

        if warning:
            text += "🟡 *ПРЕДУПРЕЖДЕНИЯ:*\n"
            for alert in warning[:5]:
                text += f"  • {alert['campaign'][:25]}\n    {alert['message']}\n"
            text += "\n"

        if info:
            text += "🔵 *ИНФОРМАЦИЯ:*\n"
            for alert in info[:3]:
                text += f"  • {alert['campaign'][:25]}\n    {alert['message']}\n"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_alerts error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_optimize(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Рекомендации по оптимизации ставок"""
    await update.message.reply_text("⏳ Анализирую эффективность ключевых слов...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        campaign_ids = [c['Id'] for c in campaigns]
        changes = bid_manager.optimize_bids(campaign_ids, dry_run=True)

        text = "💰 *Рекомендации по ставкам*\n\n"

        if changes['increase']:
            text += f"📈 *Повысить* ({len(changes['increase'])}):\n"
            for item in changes['increase'][:3]:
                text += f"  `{item['keyword'][:25]}` {item['current_bid']:.0f}→{item['new_bid']:.0f}₽\n"
            text += "\n"

        if changes['decrease']:
            text += f"📉 *Понизить* ({len(changes['decrease'])}):\n"
            for item in changes['decrease'][:3]:
                text += f"  `{item['keyword'][:25]}` {item['current_bid']:.0f}→{item['new_bid']:.0f}₽\n"
            text += "\n"

        if changes['pause']:
            text += f"⏸️ *Приостановить* ({len(changes['pause'])}):\n"
            for item in changes['pause'][:3]:
                text += f"  `{item['keyword'][:25]}` CTR:{item['ctr']:.1f}%\n"
            text += "\n"

        text += f"✅ Без изменений: {len(changes['no_change'])}\n\n"
        text += "_Используйте /apply\\_bids для применения_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_optimize error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_queries(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Поисковые запросы с низким CTR"""
    await update.message.reply_text("⏳ Анализирую поисковые запросы...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        campaign_ids = [c['Id'] for c in campaigns]
        queries = monitor.get_search_queries_report(campaign_ids, days=7)

        if not queries:
            await update.message.reply_text("📭 Нет данных по запросам")
            return

        text = "🔍 *Запросы с низким CTR*\n_(кандидаты в минус-слова)_\n\n"

        for q in queries[:10]:
            query = q.get('Query', '')[:30]
            impressions = q.get('Impressions', 0)
            ctr = q.get('Ctr', 0)
            text += f"`{query}`\n  👁 {impressions} | CTR: {ctr:.1f}%\n\n"

        text += "_Добавьте нерелевантные в минус-слова_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_queries error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_pause(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Приостановить кампанию"""
    if not context.args:
        await update.message.reply_text("Использование: /pause [ID кампании]")
        return

    try:
        campaign_id = int(context.args[0])
        api.suspend_campaigns([campaign_id])
        await update.message.reply_text(f"⏸️ Кампания {campaign_id} приостановлена")
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_resume(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Возобновить кампанию"""
    if not context.args:
        await update.message.reply_text("Использование: /resume [ID кампании]")
        return

    try:
        campaign_id = int(context.args[0])
        api.resume_campaigns([campaign_id])
        await update.message.reply_text(f"▶️ Кампания {campaign_id} возобновлена")
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")


# ==================== УПРАВЛЕНИЕ СТАВКАМИ ====================

# Глобальная переменная для автоставок
AUTO_BID_ENABLED = True


@auth_required
async def cmd_apply_bids(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Применить рекомендации по ставкам"""
    await update.message.reply_text("⏳ Применяю оптимизацию ставок...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        campaign_ids = [c['Id'] for c in campaigns]
        changes = bid_manager.optimize_bids(campaign_ids, dry_run=False)

        total_changes = len(changes['increase']) + len(changes['decrease'])

        text = f"✅ *Ставки обновлены!*\n\n"
        text += f"📈 Повышено: {len(changes['increase'])}\n"
        text += f"📉 Понижено: {len(changes['decrease'])}\n"
        text += f"⏸️ К приостановке: {len(changes['pause'])}\n"
        text += f"\n_Всего изменений: {total_changes}_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_apply_bids error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_autobid(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Управление автоматическими ставками"""
    global AUTO_BID_ENABLED

    if not context.args:
        status = "включены ✅" if AUTO_BID_ENABLED else "выключены ❌"
        await update.message.reply_text(
            f"🤖 *Автоматические ставки*\n\n"
            f"Статус: {status}\n\n"
            f"/autobid on — включить\n"
            f"/autobid off — выключить\n\n"
            f"_Автооптимизация каждые 6 часов:_\n"
            f"• CTR > 8% и CPC < 25₽ → +15%\n"
            f"• CTR < 3% → -20%\n"
            f"• CTR < 1% → приостановка\n"
            f"• Нет показов → +25%",
            parse_mode='Markdown'
        )
        return

    action = context.args[0].lower()

    if action == 'on':
        AUTO_BID_ENABLED = True
        await update.message.reply_text(
            "🤖 Автоставки *включены*\n\n"
            "Оптимизация будет выполняться каждые 6 часов автоматически.",
            parse_mode='Markdown'
        )
    elif action == 'off':
        AUTO_BID_ENABLED = False
        await update.message.reply_text(
            "🤖 Автоставки *выключены*\n\n"
            "Используйте /apply\\_bids для ручной оптимизации.",
            parse_mode='Markdown'
        )


@auth_required
async def cmd_setbid(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Установить ставку для ключевого слова вручную"""
    if len(context.args) < 2:
        await update.message.reply_text(
            "Использование: /setbid [ID ключа] [ставка в рублях]\n\n"
            "Пример: /setbid 12345678 25"
        )
        return

    try:
        keyword_id = int(context.args[0])
        bid_rub = float(context.args[1])
        bid_micro = int(bid_rub * 1000000)  # Конвертация в микрорубли

        if bid_rub < 0.3 or bid_rub > 2500:
            await update.message.reply_text("❌ Ставка должна быть от 0.3₽ до 2500₽")
            return

        api.set_keyword_bids({keyword_id: bid_micro})
        await update.message.reply_text(f"✅ Ставка для ключа {keyword_id} установлена: {bid_rub}₽")

    except ValueError:
        await update.message.reply_text("❌ Неверный формат. Пример: /setbid 12345678 25")
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_bids(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать текущие ставки по кампании"""
    await update.message.reply_text("⏳ Загружаю ставки...")

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            await update.message.reply_text("📭 Нет активных кампаний")
            return

        # Берём первую активную кампанию или указанную
        if context.args:
            campaign_id = int(context.args[0])
        else:
            campaign_id = campaigns[0]['Id']

        keywords = api.get_keywords(campaign_ids=[campaign_id])

        if not keywords:
            await update.message.reply_text("📭 Нет ключевых слов")
            return

        text = f"💰 *Ставки кампании {campaign_id}*\n\n"

        for kw in keywords[:15]:
            bid = kw.get('Bid', 0) / 1000000  # Из микрорублей
            keyword = kw.get('Keyword', '')[:25]
            kw_id = kw.get('Id')
            text += f"`{kw_id}` {keyword}: *{bid:.1f}₽*\n"

        if len(keywords) > 15:
            text += f"\n_...и ещё {len(keywords) - 15} ключей_"

        text += "\n\n_/setbid [id] [ставка] — изменить_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_bids error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


# ==================== CALLBACK HANDLERS ====================

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка нажатий кнопок"""
    query = update.callback_query
    await query.answer()

    user_id = update.effective_user.id
    if not is_authorized(user_id):
        await query.edit_message_text("⛔ Доступ запрещён")
        return

    data = query.data

    if data == "status":
        await query.edit_message_text("⏳ Загружаю...")
        update.message = query.message
        await cmd_status(update, context)

    elif data == "stats":
        await query.edit_message_text("⏳ Загружаю статистику...")
        update.message = query.message
        await cmd_stats(update, context)

    elif data == "optimize":
        await query.edit_message_text("⏳ Анализирую...")
        update.message = query.message
        await cmd_optimize(update, context)

    elif data == "queries":
        await query.edit_message_text("⏳ Загружаю запросы...")
        update.message = query.message
        await cmd_queries(update, context)

    elif data == "report_week":
        await query.edit_message_text("⏳ Формирую отчёт...")
        update.message = query.message
        await cmd_week(update, context)

    elif data == "check_alerts":
        await query.edit_message_text("⏳ Проверяю алерты...")
        update.message = query.message
        await cmd_alerts(update, context)


# ==================== SCHEDULED TASKS ====================

async def scheduled_alerts(context: ContextTypes.DEFAULT_TYPE):
    """
    Автоматические уведомления (каждые 4 часа)
    ОБНОВЛЕНО: Использует все метрики мониторинга
    """
    try:
        # Получаем ВСЕ алерты через новый метод
        alerts = monitor.check_all_alerts()

        if not alerts:
            logger.info("Scheduled alerts: no issues found")
            return

        # Фильтруем только критические и предупреждения для автоуведомлений
        important_alerts = [a for a in alerts if a['level'] in ['CRITICAL', 'WARNING']]

        if not important_alerts:
            logger.info("Scheduled alerts: only INFO level alerts, skipping notification")
            return

        text = "⚠️ *Алерты Яндекс.Директ*\n\n"

        # Группируем по типу
        critical = [a for a in important_alerts if a['level'] == 'CRITICAL']
        warning = [a for a in important_alerts if a['level'] == 'WARNING']

        if critical:
            text += "🔴 *КРИТИЧЕСКИЕ:*\n"
            for alert in critical[:5]:
                alert_type = alert.get('type', '')
                type_emoji = _get_alert_emoji(alert_type)
                text += f"{type_emoji} {alert['campaign'][:25]}\n   {alert['message']}\n"
            text += "\n"

        if warning:
            text += "🟡 *ПРЕДУПРЕЖДЕНИЯ:*\n"
            for alert in warning[:5]:
                alert_type = alert.get('type', '')
                type_emoji = _get_alert_emoji(alert_type)
                text += f"{type_emoji} {alert['campaign'][:25]}\n   {alert['message']}\n"

        for user_id in ALLOWED_USERS:
            try:
                await context.bot.send_message(
                    chat_id=user_id,
                    text=text,
                    parse_mode='Markdown'
                )
            except Exception as e:
                logger.error(f"Failed to send alert to {user_id}: {e}")

        logger.info(f"Scheduled alerts sent: {len(important_alerts)} alerts")

    except Exception as e:
        logger.error(f"Scheduled alerts error: {e}")


def _get_alert_emoji(alert_type: str) -> str:
    """Получить эмодзи для типа алерта"""
    emojis = {
        'CTR_CRITICAL': '📉',
        'CTR_LOW': '📉',
        'CPC_HIGH': '💸',
        'CPC_GROWTH': '📈',
        'BUDGET_EXHAUSTION': '💰',
        'NO_IMPRESSIONS': '👁',
        'ANOMALY_SPEND_HIGH': '🔥',
        'ANOMALY_SPEND_LOW': '❄️',
        'CONVERSIONS_THRESHOLD': '🎯',
        'CONVERSIONS_APPROACHING': '🎯',
    }
    return emojis.get(alert_type, '⚠️')


async def daily_report(context: ContextTypes.DEFAULT_TYPE):
    """Ежедневный отчёт (в 20:00)"""
    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            return

        campaign_ids = [c['Id'] for c in campaigns]
        stats = monitor.get_daily_stats(campaign_ids)

        if not stats:
            return

        total = {'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}
        for row in stats:
            total['impressions'] += row.get('Impressions', 0)
            total['clicks'] += row.get('Clicks', 0)
            total['cost'] += row.get('Cost', 0)
            total['conversions'] += row.get('Conversions', 0)

        ctr = (total['clicks'] / total['impressions'] * 100) if total['impressions'] > 0 else 0

        text = (
            f"📊 *Итоги дня*\n\n"
            f"👁 Показы: {total['impressions']:,}\n"
            f"👆 Клики: {total['clicks']:,}\n"
            f"💰 Расход: {total['cost']:,.0f}₽\n"
            f"📈 CTR: {ctr:.2f}%\n"
        )

        if total['conversions'] > 0:
            cpa = total['cost'] / total['conversions']
            text += f"🎯 Конверсий: {total['conversions']} (CPA: {cpa:.0f}₽)\n"

        # Добавляем краткую сводку по алертам
        alerts = monitor.check_all_alerts()
        critical_count = len([a for a in alerts if a['level'] == 'CRITICAL'])
        warning_count = len([a for a in alerts if a['level'] == 'WARNING'])

        if critical_count > 0 or warning_count > 0:
            text += f"\n⚠️ Алертов: 🔴{critical_count} 🟡{warning_count}"
            text += "\n_/alerts — подробности_"

        for user_id in ALLOWED_USERS:
            try:
                await context.bot.send_message(
                    chat_id=user_id,
                    text=text,
                    parse_mode='Markdown'
                )
            except Exception as e:
                logger.error(f"Failed to send daily report to {user_id}: {e}")

    except Exception as e:
        logger.error(f"Daily report error: {e}")


async def auto_optimize_bids(context: ContextTypes.DEFAULT_TYPE):
    """Автоматическая оптимизация ставок (каждые 6 часов)"""
    global AUTO_BID_ENABLED

    if not AUTO_BID_ENABLED:
        logger.info("Auto-bid disabled, skipping optimization")
        return

    try:
        campaigns = api.get_campaigns(states=['ON', 'SUSPENDED'])
        if not campaigns:
            return

        campaign_ids = [c['Id'] for c in campaigns]
        changes = bid_manager.optimize_bids(campaign_ids, dry_run=False)

        total_changes = len(changes['increase']) + len(changes['decrease'])

        if total_changes > 0:
            text = (
                f"🤖 *Автооптимизация ставок*\n\n"
                f"📈 Повышено: {len(changes['increase'])}\n"
                f"📉 Понижено: {len(changes['decrease'])}\n"
                f"⏸️ К приостановке: {len(changes['pause'])}\n"
            )

            for user_id in ALLOWED_USERS:
                try:
                    await context.bot.send_message(
                        chat_id=user_id,
                        text=text,
                        parse_mode='Markdown'
                    )
                except Exception as e:
                    logger.error(f"Failed to send auto-bid report to {user_id}: {e}")

        logger.info(f"Auto-optimization completed: {total_changes} changes")

    except Exception as e:
        logger.error(f"Auto-optimize error: {e}")


# ==================== MAIN ====================

def main():
    """Запуск бота"""
    print("🚀 Запуск Telegram-бота Яндекс.Директ...")

    # Создаём приложение
    application = Application.builder().token(BOT_TOKEN).build()

    # Регистрируем команды
    application.add_handler(CommandHandler("start", cmd_start))
    application.add_handler(CommandHandler("help", cmd_help))
    application.add_handler(CommandHandler("status", cmd_status))
    application.add_handler(CommandHandler("stats", cmd_stats))
    application.add_handler(CommandHandler("week", cmd_week))
    application.add_handler(CommandHandler("optimize", cmd_optimize))
    application.add_handler(CommandHandler("queries", cmd_queries))
    application.add_handler(CommandHandler("pause", cmd_pause))
    application.add_handler(CommandHandler("resume", cmd_resume))
    application.add_handler(CommandHandler("alerts", cmd_alerts))

    # Команды управления ставками
    application.add_handler(CommandHandler("apply_bids", cmd_apply_bids))
    application.add_handler(CommandHandler("autobid", cmd_autobid))
    application.add_handler(CommandHandler("setbid", cmd_setbid))
    application.add_handler(CommandHandler("bids", cmd_bids))

    # Обработка кнопок
    application.add_handler(CallbackQueryHandler(button_callback))

    # Планировщик задач
    job_queue = application.job_queue

    # Алерты каждые 4 часа
    job_queue.run_repeating(scheduled_alerts, interval=14400, first=60)

    # Автооптимизация ставок каждые 6 часов
    job_queue.run_repeating(auto_optimize_bids, interval=21600, first=300)

    # Ежедневный отчёт в 20:00
    job_queue.run_daily(
        daily_report,
        time=datetime.strptime("20:00", "%H:%M").time()
    )

    print("✓ Бот запущен!")
    print(f"✓ Доступ для пользователей: {ALLOWED_USERS}")
    print("✓ Расширенные алерты: бюджет, показы, аномалии, конверсии, CPC")

    # Запускаем polling
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
