#!/usr/bin/env python3
"""Disable spend/budget alerts during tuning phase. Keep only CTR and no-impressions."""

with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "r", encoding="utf-8") as f:
    code = f.read()

changes = 0

# Comment out spend-related alerts in check_all_alerts
replacements = [
    (
        "        all_alerts.extend(self.check_budget_exhaustion(campaign_ids))",
        "        # TUNING PHASE: spend alerts disabled\n        # all_alerts.extend(self.check_budget_exhaustion(campaign_ids))"
    ),
    (
        "        all_alerts.extend(self.check_anomaly_spend(campaign_ids))",
        "        # all_alerts.extend(self.check_anomaly_spend(campaign_ids))"
    ),
    (
        "        all_alerts.extend(self.check_cpc_growth(campaign_ids))",
        "        # all_alerts.extend(self.check_cpc_growth(campaign_ids))"
    ),
    (
        "        all_alerts.extend(self.check_conversions_threshold(campaign_ids))",
        "        # all_alerts.extend(self.check_conversions_threshold(campaign_ids))"
    ),
]

for old, new in replacements:
    if old in code:
        code = code.replace(old, new)
        changes += 1
        print(f"  Disabled: {old.strip()}")
    else:
        print(f"  NOT FOUND: {old.strip()}")

if changes > 0:
    with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "w", encoding="utf-8") as f:
        f.write(code)
    print(f"\n{changes}/4 spend alerts disabled.")
    print("Remaining active: check_alerts (CTR/CPC basic), check_no_impressions")
else:
    print("No changes made!")

# Also disable CPC alert in check_alerts (basic) since CPC is volatile during tuning
with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "r", encoding="utf-8") as f:
    code = f.read()

# Find the CPC check in check_alerts and comment it out
old_cpc = """            # Высокий CPC
            if cpc > self.ALERT_CPC_HIGH:"""
new_cpc = """            # Высокий CPC — disabled during tuning phase
            if False and cpc > self.ALERT_CPC_HIGH:"""

if old_cpc in code:
    code = code.replace(old_cpc, new_cpc)
    print("  Disabled: CPC alert in check_alerts")
    with open("/home/anton-furs/yandex-direct-bot/monitoring.py", "w", encoding="utf-8") as f:
        f.write(code)
else:
    print("  CPC alert pattern not found, checking...")
    # Try to find it
    import re
    m = re.search(r'if cpc > self\.ALERT_CPC_HIGH:', code)
    if m:
        print(f"    Found at position {m.start()}: ...{code[m.start()-50:m.end()+20]}...")

# Also disable CPC warning in telegram_bot.py cmd_stats
with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "r", encoding="utf-8") as f:
    bot = f.read()

bot_changes = 0
# Disable CPC warning in stats command
old_cpc_bot = "if cpc > 300:"
new_cpc_bot = "if False:  # CPC alert disabled during tuning\n                # if cpc > 300:"
if old_cpc_bot in bot:
    bot = bot.replace(old_cpc_bot, new_cpc_bot, 1)
    bot_changes += 1

with open("/home/anton-furs/yandex-direct-bot/telegram_bot.py", "w", encoding="utf-8") as f:
    f.write(bot)
print(f"  telegram_bot.py: {bot_changes} CPC check(s) disabled")

print("\nDone! Restart bot.")
