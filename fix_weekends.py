#!/usr/bin/env python3
"""Add weekend checks to telegram_bot.py - skip alerts and reports on weekends."""

with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "r", encoding="utf-8") as f:
    bot = f.read()

changes = 0

# 1. scheduled_alerts - skip weekends
old1 = '''async def scheduled_alerts(context: ContextTypes.DEFAULT_TYPE):
    """Автоматические алерты (каждые 4 часа)"""
    try:'''
new1 = '''async def scheduled_alerts(context: ContextTypes.DEFAULT_TYPE):
    """Автоматические алерты (каждые 4 часа, пропуск выходных)"""
    if datetime.now().weekday() >= 5:  # Сб=5, Вс=6 — кампании не работают
        return
    try:'''
if old1 in bot:
    bot = bot.replace(old1, new1)
    changes += 1
    print("  scheduled_alerts: weekend check added OK")
else:
    print("  scheduled_alerts: pattern NOT FOUND")

# 2. daily_report - skip weekends
old2 = '''async def daily_report(context: ContextTypes.DEFAULT_TYPE):
    """Ежедневный отчёт (в 20:00)"""
    try:'''
new2 = '''async def daily_report(context: ContextTypes.DEFAULT_TYPE):
    """Ежедневный отчёт (в 20:00, пропуск выходных)"""
    if datetime.now().weekday() >= 5:  # Сб=5, Вс=6 — кампании не работают
        return
    try:'''
if old2 in bot:
    bot = bot.replace(old2, new2)
    changes += 1
    print("  daily_report: weekend check added OK")
else:
    print("  daily_report: pattern NOT FOUND")

# 3. auto_analyze_queries - skip weekends
old3 = '''async def auto_analyze_queries(context: ContextTypes.DEFAULT_TYPE):
    """
    Автоанализ поисковых запросов (каждые 24 часа).
    Находит мусорные запросы, добавляет минус-слова, шлёт отчёт.
    """'''
new3 = '''async def auto_analyze_queries(context: ContextTypes.DEFAULT_TYPE):
    """
    Автоанализ поисковых запросов (каждые 24 часа, пропуск выходных).
    Находит мусорные запросы, добавляет минус-слова, шлёт отчёт.
    """
    if datetime.now().weekday() >= 5:  # Сб=5, Вс=6 — кампании не работают
        return'''
if old3 in bot:
    bot = bot.replace(old3, new3)
    changes += 1
    print("  auto_analyze_queries: weekend check added OK")
else:
    print("  auto_analyze_queries: pattern NOT FOUND")

if changes > 0:
    with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "w", encoding="utf-8") as f:
        f.write(bot)
    print(f"\n{changes}/3 functions patched. Restart bot with: pm2 restart yandex-bot")
else:
    print("\nNo changes made!")
