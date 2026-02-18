#!/usr/bin/env python3
"""Check current time targeting settings on campaigns."""
import sys, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
CIDS = [705839254, 705839266]

r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": CIDS},
    "FieldNames": ["Id", "Name", "TimeTargeting"]
}}, headers=HEADERS)

data = r.json()
for c in data.get("result", {}).get("Campaigns", []):
    print(f"\nCampaign {c['Id']}: {c['Name']}")
    tt = c.get("TimeTargeting", {})
    schedule = tt.get("Schedule", {})
    items = schedule.get("Items", []) if isinstance(schedule, dict) else schedule
    if items:
        # TimeTargeting Schedule format: array of strings like "1,100,100,100,..."
        # First number = day of week (1=Mon, 7=Sun), then 24 values (0-100) for each hour
        print(f"  Schedule items: {len(items)}")
        for item in items:
            if isinstance(item, str):
                parts = item.split(",")
                day_num = parts[0]
                days = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun"}
                day_name = days.get(int(day_num), day_num)
                hours = parts[1:]
                active = [i for i, h in enumerate(hours) if int(h) > 0]
                if active:
                    print(f"  {day_name}: hours {min(active)}-{max(active)} (active {len(active)}h)")
                else:
                    print(f"  {day_name}: OFF")
            else:
                print(f"  Item: {json.dumps(item)[:200]}")
    else:
        print(f"  No schedule set (24/7)")

    considerations = tt.get("ConsiderWorkingWeekends", "")
    holidays_schedule = tt.get("HolidaysSchedule", {})
    print(f"  ConsiderWorkingWeekends: {considerations}")
    print(f"  HolidaysSchedule: {json.dumps(holidays_schedule, ensure_ascii=False)}")
    print(f"  Raw TimeTargeting: {json.dumps(tt, ensure_ascii=False)[:500]}")
