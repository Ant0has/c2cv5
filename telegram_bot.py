# -*- coding: utf-8 -*-
"""
Telegram-бот для управления B2B кампаниями Яндекс.Директ
v2: Биддер заменён на анализатор поисковых запросов
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
from query_analyzer import QueryAnalyzer, B2B_CAMPAIGN_IDS
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
analyzer = QueryAnalyzer()

# Автоанализ запросов (каждые 24ч)
AUTO_ANALYZE_ENABLED = True


def is_authorized(user_id: int) -> bool:
    return user_id in ALLOWED_USERS


def auth_required(func):
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = update.effective_user.id
        if not is_authorized(user_id):
            await update.message.reply_text(f"⛔ Доступ запрещён\nВаш ID: {user_id}")
            logger.warning(f"Unauthorized access: {user_id}")
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
        [InlineKeyboardButton("🔍 Анализ запросов", callback_data="analyze")],
        [InlineKeyboardButton("📈 Отчёт за неделю", callback_data="report_week")],
        [InlineKeyboardButton("⚠️ Проверить алерты", callback_data="check_alerts")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "🚀 *Яндекс.Директ B2B Manager*\n\n"
        "Команды:\n\n"
        "/status — статус кампаний\n"
        "/stats — статистика за сегодня\n"
        "/week — статистика за неделю\n"
        "/analyze — анализ поисковых запросов\n"
        "/add\\_negatives — добавить минус-слова\n"
        "/alerts — проверить алерты\n"
        "/pause [id] — приостановить кампанию\n"
        "/resume [id] — возобновить кампанию\n"
        "/help — справка",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


@auth_required
async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Справка"""
    await update.message.reply_text(
        "📖 *Справка*\n\n"
        "*Мониторинг:*\n"
        "/status — статус кампаний\n"
        "/stats — статистика за сегодня\n"
        "/week — за 7 дней\n"
        "/month — за 30 дней\n"
        "/alerts — все алерты\n\n"
        "*Анализ запросов (вместо биддера):*\n"
        "/analyze — анализ за 7 дней (B2B/мусор/подозрительные)\n"
        "/analyze 14 — анализ за 14 дней\n"
        "/add\\_negatives — авто-добавление минус-слов\n"
        "/auto\\_analyze on/off — автоанализ каждые 24ч\n\n"
        "*Управление:*\n"
        "/pause [id] — приостановить кампанию\n"
        "/resume [id] — возобновить кампанию\n\n"
        "*Алерты:*\n"
        "🔴 CTR < 1%, бюджет, нет показов\n"
        "🟡 CTR < 3%, CPC > 35₽, рост CPC\n"
        "🔵 Порог конверсий",
        parse_mode='Markdown'
    )


@auth_required
async def cmd_status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Статус кампаний"""
    await update.message.reply_text("⏳ Загружаю статус...")

    try:
        campaigns = api.get_campaigns()
        if not campaigns:
            await update.message.reply_text("📭 Нет кампаний")
            return

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

        by_campaign = {}
        total = {'impressions': 0, 'clicks': 0, 'cost': 0, 'conversions': 0}

        for row in stats:
            cid = row.get('CampaignId')
            name = row.get('CampaignName', 'Unknown')[:25]

            if cid not in by_campaign:
                by_campaign[cid] = {'name': name, 'impressions': 0,
                                    'clicks': 0, 'cost': 0, 'conversions': 0}

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
    await update.message.reply_text("⏳ Проверяю метрики...")

    try:
        alerts = monitor.check_all_alerts()

        if not alerts:
            await update.message.reply_text(
                "✅ *Всё в порядке!*\nПроблем не обнаружено.",
                parse_mode='Markdown'
            )
            return

        text = "⚠️ *Обнаружены проблемы*\n\n"

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


# ==================== АНАЛИЗ ЗАПРОСОВ ====================

@auth_required
async def cmd_analyze(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Анализ поисковых запросов — классификация B2B / мусор"""
    days = 7
    if context.args:
        try:
            days = int(context.args[0])
        except ValueError:
            pass

    await update.message.reply_text(f"⏳ Анализирую запросы за {days} дней...")

    try:
        report = analyzer.analyze(days=days, auto_add=False)

        if report.total_queries == 0:
            await update.message.reply_text(
                "📭 Нет данных по запросам.\n"
                "Кампании активны? Есть показы на поиске?"
            )
            return

        text = analyzer.format_report(report)

        # Telegram лимит 4096 символов
        if len(text) > 4000:
            text = analyzer.format_report(report, short=True)

        if report.new_negatives_added:
            text += "\n\n_/add\\_negatives — добавить автоматически_"

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_analyze error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_add_negatives(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Запустить анализ и автоматически добавить минус-слова"""
    days = 7
    if context.args:
        try:
            days = int(context.args[0])
        except ValueError:
            pass

    await update.message.reply_text(f"⏳ Анализирую запросы и добавляю минус-слова...")

    try:
        report = analyzer.analyze(days=days, auto_add=True)

        if report.new_negatives_added:
            text = (
                f"✅ *Минус-слова добавлены!*\n\n"
                f"Новых: *{len(report.new_negatives_added)}*\n"
                f"`{', '.join(report.new_negatives_added[:20])}`\n\n"
                f"Мусорных запросов было: {len(report.junk_queries)}\n"
                f"Слито бюджета: {sum(q.cost for q in report.junk_queries):.0f}₽"
            )
        else:
            text = (
                "✅ *Новых минус-слов не найдено*\n\n"
                f"Проанализировано: {report.total_queries} запросов\n"
                f"Все мусорные паттерны уже в минус-словах."
            )

        await update.message.reply_text(text, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"cmd_add_negatives error: {e}")
        await update.message.reply_text(f"❌ Ошибка: {e}")


@auth_required
async def cmd_auto_analyze(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Управление автоанализом запросов"""
    global AUTO_ANALYZE_ENABLED

    if not context.args:
        status = "включён ✅" if AUTO_ANALYZE_ENABLED else "выключен ❌"
        await update.message.reply_text(
            f"🤖 *Автоанализ запросов*\n\n"
            f"Статус: {status}\n\n"
            f"/auto\\_analyze on — включить\n"
            f"/auto\\_analyze off — выключить\n\n"
            f"_Каждые 24ч анализирует запросы,_\n"
            f"_добавляет минус-слова и шлёт отчёт._",
            parse_mode='Markdown'
        )
        return

    action = context.args[0].lower()
    if action == 'on':
        AUTO_ANALYZE_ENABLED = True
        await update.message.reply_text(
            "🤖 Автоанализ *включён*\nОтчёт и минус-слова каждые 24 часа.",
            parse_mode='Markdown'
        )
    elif action == 'off':
        AUTO_ANALYZE_ENABLED = False
        await update.message.reply_text(
            "🤖 Автоанализ *выключен*\nИспользуйте /analyze вручную.",
            parse_mode='Markdown'
        )


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


# ==================== CALLBACK HANDLERS ====================

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
    elif data == "analyze":
        await query.edit_message_text("⏳ Анализирую запросы...")
        update.message = query.message
        await cmd_analyze(update, context)
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
    """Автоматические алерты (каждые 4 часа)"""
    try:
        alerts = monitor.check_all_alerts()
        if not alerts:
            return

        important = [a for a in alerts if a['level'] in ['CRITICAL', 'WARNING']]
        if not important:
            return

        text = "⚠️ *Алерты Яндекс.Директ*\n\n"

        critical = [a for a in important if a['level'] == 'CRITICAL']
        warning = [a for a in important if a['level'] == 'WARNING']

        if critical:
            text += "🔴 *КРИТИЧЕСКИЕ:*\n"
            for alert in critical[:5]:
                text += f"  {alert['campaign'][:25]}\n   {alert['message']}\n"
            text += "\n"

        if warning:
            text += "🟡 *ПРЕДУПРЕЖДЕНИЯ:*\n"
            for alert in warning[:5]:
                text += f"  {alert['campaign'][:25]}\n   {alert['message']}\n"

        for user_id in ALLOWED_USERS:
            try:
                await context.bot.send_message(
                    chat_id=user_id, text=text, parse_mode='Markdown'
                )
            except Exception as e:
                logger.error(f"Alert send failed {user_id}: {e}")

    except Exception as e:
        logger.error(f"Scheduled alerts error: {e}")


async def auto_analyze_queries(context: ContextTypes.DEFAULT_TYPE):
    """
    Автоанализ поисковых запросов (каждые 24 часа).
    Находит мусорные запросы, добавляет минус-слова, шлёт отчёт.
    """
    global AUTO_ANALYZE_ENABLED

    if not AUTO_ANALYZE_ENABLED:
        logger.info("Auto-analyze disabled, skipping")
        return

    try:
        report = analyzer.analyze(days=3, auto_add=True)

        if report.total_queries == 0:
            logger.info("Auto-analyze: no queries found")
            return

        junk_cost = sum(q.cost for q in report.junk_queries)

        # Шлём отчёт только если есть что сообщить
        if report.new_negatives_added or junk_cost > 50:
            text = "🤖 *Автоанализ запросов*\n\n"
            text += f"Запросов: {report.total_queries}\n"
            text += f"✅ B2B: {len(report.b2b_queries)}\n"
            text += f"🚫 Мусор: {len(report.junk_queries)} ({junk_cost:.0f}₽)\n"

            if report.new_negatives_added:
                text += (
                    f"\n🆕 *Добавлено минус-слов: "
                    f"{len(report.new_negatives_added)}*\n"
                    f"`{', '.join(report.new_negatives_added[:15])}`"
                )

            for user_id in ALLOWED_USERS:
                try:
                    await context.bot.send_message(
                        chat_id=user_id, text=text, parse_mode='Markdown'
                    )
                except Exception as e:
                    logger.error(f"Auto-analyze send failed {user_id}: {e}")

        logger.info(
            f"Auto-analyze: {report.total_queries} queries, "
            f"{len(report.new_negatives_added)} new negatives"
        )

    except Exception as e:
        logger.error(f"Auto-analyze error: {e}")


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

        alerts = monitor.check_all_alerts()
        critical_count = len([a for a in alerts if a['level'] == 'CRITICAL'])
        warning_count = len([a for a in alerts if a['level'] == 'WARNING'])

        if critical_count > 0 or warning_count > 0:
            text += f"\n⚠️ Алертов: 🔴{critical_count} 🟡{warning_count}"
            text += "\n_/alerts — подробности_"

        for user_id in ALLOWED_USERS:
            try:
                await context.bot.send_message(
                    chat_id=user_id, text=text, parse_mode='Markdown'
                )
            except Exception as e:
                logger.error(f"Daily report send failed {user_id}: {e}")

    except Exception as e:
        logger.error(f"Daily report error: {e}")


# ==================== MAIN ====================

def main():
    """Запуск бота"""
    print("🚀 Запуск Telegram-бота Яндекс.Директ B2B v2...")

    application = Application.builder().token(BOT_TOKEN).build()

    # Команды мониторинга
    application.add_handler(CommandHandler("start", cmd_start))
    application.add_handler(CommandHandler("help", cmd_help))
    application.add_handler(CommandHandler("status", cmd_status))
    application.add_handler(CommandHandler("stats", cmd_stats))
    application.add_handler(CommandHandler("week", cmd_week))
    application.add_handler(CommandHandler("alerts", cmd_alerts))

    # Команды анализа запросов (замена биддера)
    application.add_handler(CommandHandler("analyze", cmd_analyze))
    application.add_handler(CommandHandler("add_negatives", cmd_add_negatives))
    application.add_handler(CommandHandler("auto_analyze", cmd_auto_analyze))

    # Управление кампаниями
    application.add_handler(CommandHandler("pause", cmd_pause))
    application.add_handler(CommandHandler("resume", cmd_resume))

    # Кнопки
    application.add_handler(CallbackQueryHandler(button_callback))

    # Планировщик
    job_queue = application.job_queue

    # Алерты каждые 4 часа
    job_queue.run_repeating(scheduled_alerts, interval=14400, first=60)

    # Автоанализ запросов каждые 24 часа (вместо автоставок каждые 6ч)
    job_queue.run_repeating(auto_analyze_queries, interval=86400, first=600)

    # Ежедневный отчёт в 20:00
    job_queue.run_daily(
        daily_report,
        time=datetime.strptime("20:00", "%H:%M").time()
    )

    print("✓ Бот запущен!")
    print(f"✓ Пользователи: {ALLOWED_USERS}")
    print("✓ Анализатор запросов: вместо биддера")
    print("✓ Автоанализ: каждые 24ч")
    print("✓ Алерты: каждые 4ч")
    print("✓ Дневной отчёт: 20:00")

    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
