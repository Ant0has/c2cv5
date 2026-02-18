#!/usr/bin/env python3
"""Get ad-level and search query conversions + hourly clicks."""
import sys, json, time, datetime
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
REPORT_HEADERS = {**HEADERS,
    "processingMode": "auto", "returnMoneyInMicros": "false",
    "skipReportHeader": "true", "skipReportSummary": "true"}
CIDS = [705839254, 705839266]

def report(name, rtype, fields, d1, d2, cids=CIDS):
    sel = {"DateFrom": d1, "DateTo": d2,
           "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in cids]}]}
    for i in range(12):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel, "FieldNames": fields,
            "ReportName": f"{name}_{int(time.time())}_{i}",
            "ReportType": rtype, "DateRangeType": "CUSTOM_DATE",
            "Format": "TSV", "IncludeVAT": "YES", "IncludeDiscount": "NO",
        }}, headers=REPORT_HEADERS)
        if r.status_code == 200:
            return r.text
        elif r.status_code in (201, 202):
            time.sleep(int(r.headers.get("retryIn", 5)))
        else:
            time.sleep(10)
    return "TIMEOUT"

# 1. Ad-level conversions Feb 13-17
print("=== AD-LEVEL CONVERSIONS (Feb 13-17) ===")
txt = report("adcv", "AD_PERFORMANCE_REPORT",
    ["Date", "CampaignName", "AdGroupName", "AdId", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17")
if txt and txt != "TIMEOUT":
    header = True
    for line in txt.strip().split("\n"):
        if header:
            header = False
            continue
        parts = line.split("\t")
        if len(parts) >= 7:
            try:
                convs = int(parts[6])
            except ValueError:
                convs = 0
            if convs > 0:
                print(f"  {line}")
else:
    print(f"  {txt}")

# 2. Search queries with conversions Feb 13-17
print("\n=== SEARCH QUERIES WITH CONVERSIONS (Feb 13-17) ===")
txt = report("sqcv", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "CampaignName", "AdGroupName", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17")
if txt and txt != "TIMEOUT":
    header = True
    for line in txt.strip().split("\n"):
        if header:
            header = False
            continue
        parts = line.split("\t")
        if len(parts) >= 7:
            try:
                convs = int(parts[6])
            except ValueError:
                convs = 0
            if convs > 0:
                print(f"  {line}")
else:
    print(f"  {txt}")

# 3. All clicks by hour+location on Feb 16-17
print("\n=== CLICKS BY HOUR+LOCATION (Feb 16) ===")
txt = report("loc16", "CUSTOM_REPORT",
    ["CampaignName", "HourOfDay", "LocationOfPresenceName", "Clicks", "Conversions", "Cost"],
    "2026-02-16", "2026-02-16")
if txt and txt != "TIMEOUT":
    header = True
    for line in txt.strip().split("\n"):
        if header:
            header = False
            continue
        parts = line.split("\t")
        if len(parts) >= 4:
            try:
                clicks = int(parts[3])
            except ValueError:
                clicks = 0
            if clicks > 0:
                print(f"  {line}")
else:
    print(f"  {txt}")

print("\n=== CLICKS BY HOUR+LOCATION (Feb 17) ===")
txt = report("loc17", "CUSTOM_REPORT",
    ["CampaignName", "HourOfDay", "LocationOfPresenceName", "Clicks", "Conversions", "Cost"],
    "2026-02-17", "2026-02-17")
if txt and txt != "TIMEOUT":
    header = True
    for line in txt.strip().split("\n"):
        if header:
            header = False
            continue
        parts = line.split("\t")
        if len(parts) >= 4:
            try:
                clicks = int(parts[3])
            except ValueError:
                clicks = 0
            if clicks > 0:
                print(f"  {line}")
else:
    print(f"  {txt}")

# 4. Also check ALL ads in Hot campaign that mention "сотрудников"
print("\n=== ADS WITH 'СОТРУДНИКОВ' IN TEXT ===")
r = requests.post(API_URL + "ads", json={"method": "get", "params": {
    "SelectionCriteria": {"CampaignIds": CIDS},
    "FieldNames": ["Id", "AdGroupId", "CampaignId"],
    "TextAdFieldNames": ["Title", "Title2", "Text"]
}}, headers=HEADERS)
for a in r.json().get("result", {}).get("Ads", []):
    ta = a.get("TextAd", {})
    full_text = f"{ta.get('Title', '')} {ta.get('Title2', '')} {ta.get('Text', '')}".lower()
    if "сотрудник" in full_text:
        cid = a["CampaignId"]
        camp = "HOT" if cid == 705839254 else "GEO"
        print(f"  [{camp}] Ad {a['Id']} (group {a['AdGroupId']})")
        print(f"    {ta.get('Title', '')} | {ta.get('Title2', '')}")
        print(f"    {ta.get('Text', '')}")
