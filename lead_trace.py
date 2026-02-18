#!/usr/bin/env python3
"""Trace leads: hourly clicks, ad-level conversions, to correlate with calls."""
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
    for i in range(15):
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

# 1. Check what ad 17601598455 is (from the form UTM)
print("=" * 70)
print("1. AD ID 17601598455 FROM FORM UTM")
print("=" * 70)
r = requests.post(API_URL + "ads", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": [17601598455]},
    "FieldNames": ["Id", "AdGroupId", "CampaignId", "State", "Status"],
    "TextAdFieldNames": ["Title", "Title2", "Text"]
}}, headers=HEADERS)
data = r.json()
if "result" in data:
    for a in data["result"].get("Ads", []):
        cid = a["CampaignId"]
        camp = "HOT" if cid == 705839254 else "GEO" if cid == 705839266 else str(cid)
        ta = a.get("TextAd", {})
        print(f"  Campaign: {camp} ({cid})")
        print(f"  AdGroup: {a['AdGroupId']}")
        print(f"  Title: {ta.get('Title', '')} | {ta.get('Title2', '')}")
        print(f"  Text: {ta.get('Text', '')}")

        # Get group name
        r2 = requests.post(API_URL + "adgroups", json={"method": "get", "params": {
            "SelectionCriteria": {"Ids": [a["AdGroupId"]]},
            "FieldNames": ["Id", "Name"]
        }}, headers=HEADERS)
        for g in r2.json().get("result", {}).get("AdGroups", []):
            print(f"  Group: {g['Name']}")
else:
    print(f"  Error: {json.dumps(data, ensure_ascii=False)}")

# 2. Hourly clicks Feb 13-17 for both campaigns
print("\n" + "=" * 70)
print("2. HOURLY CLICKS (Feb 13, 16, 17)")
print("=" * 70)
for day in ["2026-02-13", "2026-02-16", "2026-02-17"]:
    print(f"\n--- {day} ---")
    txt = report(f"hr_{day}", "CUSTOM_REPORT",
        ["CampaignName", "Date", "HourOfDay", "Impressions", "Clicks", "Cost", "Conversions"],
        day, day)
    if txt and txt != "TIMEOUT":
        for line in txt.strip().split("\n"):
            parts = line.split("\t")
            # Only show hours with clicks or conversions
            if len(parts) >= 7:
                clicks = int(parts[4]) if parts[4] != "--" else 0
                convs = int(parts[6]) if parts[6] != "--" else 0
                if clicks > 0 or convs > 0:
                    print(f"  {line}")
    else:
        print(f"  {txt}")

# 3. Ad-level conversions Feb 13-17
print("\n" + "=" * 70)
print("3. AD-LEVEL CONVERSIONS (Feb 13-17)")
print("=" * 70)
txt = report("adconv", "AD_PERFORMANCE_REPORT",
    ["Date", "CampaignName", "AdGroupName", "AdId", "Impressions", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17")
if txt and txt != "TIMEOUT":
    for line in txt.strip().split("\n"):
        parts = line.split("\t")
        if len(parts) >= 8:
            convs = int(parts[7]) if parts[7] != "--" else 0
            if convs > 0 or "Date" in line:
                print(f"  {line}")
else:
    print(f"  {txt}")

# 4. Search queries with conversions
print("\n" + "=" * 70)
print("4. SEARCH QUERIES WITH CONVERSIONS (Feb 13-17)")
print("=" * 70)
txt = report("sqconv", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "CampaignName", "AdGroupName", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17")
if txt and txt != "TIMEOUT":
    for line in txt.strip().split("\n"):
        parts = line.split("\t")
        if len(parts) >= 7:
            convs = int(parts[6]) if parts[6] != "--" else 0
            if convs > 0:
                print(f"  {line}")
else:
    print(f"  {txt}")

# 5. All clicks with locations Feb 16-17 (to trace calls)
print("\n" + "=" * 70)
print("5. ALL CLICKS WITH TIMES (Feb 16-17) - for call matching")
print("=" * 70)
for day in ["2026-02-16", "2026-02-17"]:
    print(f"\n--- {day} ---")
    txt = report(f"clicks_{day}", "CUSTOM_REPORT",
        ["CampaignName", "HourOfDay", "AdGroupName", "Device", "LocationOfPresenceName", "Clicks", "Conversions"],
        day, day)
    if txt and txt != "TIMEOUT":
        for line in txt.strip().split("\n"):
            parts = line.split("\t")
            if len(parts) >= 6:
                clicks = int(parts[5]) if parts[5] != "--" else 0
                if clicks > 0:
                    print(f"  {line}")
    else:
        print(f"  {txt}")
