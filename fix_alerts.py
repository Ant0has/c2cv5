#!/usr/bin/env python3
"""Patch monitoring.py and telegram_bot.py alert thresholds for B2B context."""
import re

# === Fix monitoring.py ===
with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "r", encoding="utf-8") as f:
    monitoring = f.read()

replacements = {
    # Threshold constants
    "ALERT_CTR_LOW = 3.0": "ALERT_CTR_LOW = 2.0            # B2B: CTR ниже 2% — проблема",
    "ALERT_CTR_CRITICAL = 1.0": "ALERT_CTR_CRITICAL = 0.5       # B2B: CTR ниже 0.5% — критично",
    "ALERT_CPC_HIGH = 35.0": "ALERT_CPC_HIGH = 300.0         # B2B: CPC выше 300₽ — дорого (аукцион ~200-250₽)",
    "ALERT_CPC_GROWTH_PERCENT = 40": "ALERT_CPC_GROWTH_PERCENT = 50  # B2B: на старте CPC волатилен",
    "CONVERSIONS_THRESHOLD = 50": "CONVERSIONS_THRESHOLD = 15     # B2B: конверсии редкие и дорогие",
    # Minimum impressions for base alerts
    "if impressions < 50:": "if impressions < 10:  # B2B: мало показов на старте",
    # No impressions: lower avg_daily threshold
    "if current_hour >= hours_threshold and avg_daily > 50:": "if current_hour >= hours_threshold and avg_daily > 10:  # B2B: мало показов",
    # Anomaly spend: lower minimum
    "if avg_daily < 100:  # Слишком маленький расход для анализа": "if avg_daily < 50:  # B2B: средний расход может быть невысоким",
}

for old, new in replacements.items():
    if old in monitoring:
        monitoring = monitoring.replace(old, new)
        print(f"  monitoring.py: '{old[:40]}...' -> OK")
    else:
        print(f"  monitoring.py: '{old[:40]}...' -> NOT FOUND")

with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "w", encoding="utf-8") as f:
    f.write(monitoring)
print("monitoring.py updated!\n")


# === Fix telegram_bot.py ===
with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "r", encoding="utf-8") as f:
    bot = f.read()

bot_replacements = {
    # cmd_stats hard-coded CPC warning
    'if cpc > 35 and total[\'clicks\'] > 10:': 'if cpc > 300 and total[\'clicks\'] > 5:  # B2B: CPC ~200-250₽ норма',
    "if ctr < 3 and total['impressions'] > 100:": "if ctr < 2 and total['impressions'] > 20:  # B2B: CTR 2-5% норма",
    # Help text
    '"🔴 CTR < 1%, бюджет, нет показов\\n"': '"🔴 CTR < 0.5%, бюджет, нет показов\\n"',
    '"🟡 CTR < 3%, CPC > 35₽, рост CPC\\n"': '"🟡 CTR < 2%, CPC > 300₽, рост CPC\\n"',
}

for old, new in bot_replacements.items():
    if old in bot:
        bot = bot.replace(old, new)
        print(f"  telegram_bot.py: '{old[:40]}...' -> OK")
    else:
        print(f"  telegram_bot.py: '{old[:40]}...' -> NOT FOUND")

with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "w", encoding="utf-8") as f:
    f.write(bot)
print("telegram_bot.py updated!\n")

print("Done! Restart bot with: pm2 restart yandex-bot")
