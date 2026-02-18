#!/usr/bin/env python3
"""Quick stats check: daily breakdown, totals, account balance."""
import sys, json, time, datetime
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
REPORT_HEADERS = {
    **HEADERS,
    "processingMode": "auto",
    "returnMoneyInMicros": "false",
    "skipReportHeader": "true",
    "skipReportSummary": "true",
}
CIDS = [705839254, 705839266]
TODAY = datetime.date.today().isoformat()

def get_report(name, rtype, fields, date_from, date_to, extra_filter=None):
    sel = {"DateFrom": date_from, "DateTo": date_to}
    if extra_filter:
        sel["Filter"] = extra_filter
    for attempt in range(8):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel,
            "FieldNames": fields,
            "ReportName": f"{name}_{attempt}_{int(time.time())}",
            "ReportType": rtype,
            "DateRangeType": "CUSTOM_DATE",
            "Format": "TSV",
            "IncludeVAT": "YES",
            "IncludeDiscount": "NO",
        }}, headers=REPORT_HEADERS)
        if r.status_code == 200:
            return r.text
        elif r.status_code in (201, 202):
            time.sleep(int(r.headers.get("retryIn", 5)))
        else:
            return f"Error {r.status_code}: {r.text[:300]}"
    return "Report timeout"

# 1. Daily stats last 14 days
print("=" * 90)
print("DAILY STATS (last 14 days)")
print("=" * 90)
d14 = (datetime.date.today() - datetime.timedelta(days=14)).isoformat()
txt = get_report("Daily14", "CAMPAIGN_PERFORMANCE_REPORT",
    ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "Conversions", "AvgImpressionPosition"],
    d14, TODAY,
    [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in CIDS]}])
print(txt)

# 2. All-time totals per campaign
print("=" * 90)
print("ALL-TIME TOTALS (per campaign)")
print("=" * 90)
txt2 = get_report("AllTime", "CAMPAIGN_PERFORMANCE_REPORT",
    ["CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "Conversions", "CostPerConversion", "AvgImpressionPosition"],
    "2026-01-01", TODAY,
    [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in CIDS]}])
print(txt2)

# 3. Group performance last 7 days
print("=" * 90)
print("GROUP PERFORMANCE (last 7 days)")
print("=" * 90)
d7 = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
txt3 = get_report("Groups7d", "ADGROUP_PERFORMANCE_REPORT",
    ["AdGroupName", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions"],
    d7, TODAY,
    [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in CIDS]}])
print(txt3)

# 4. Account balance & campaign budgets
print("=" * 90)
print("ACCOUNT & BUDGETS")
print("=" * 90)
r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": CIDS},
    "FieldNames": ["Id", "Name", "Funds", "State", "Status"],
    "TextCampaignFieldNames": ["BiddingStrategy"]
}}, headers=HEADERS)
for c in r.json().get("result", {}).get("Campaigns", []):
    tc = c.get("TextCampaign", {})
    bs = tc.get("BiddingStrategy", {}).get("Search", {})
    wmc = bs.get("WbMaximumClicks", {})
    funds = c.get("Funds", {}).get("SharedAccountFunds", {})
    print(f"\n{c['Name']} (ID {c['Id']}) — {c['State']}/{c['Status']}")
    if wmc:
        print(f"  WeeklySpendLimit: {int(wmc.get('WeeklySpendLimit', 0))/1000000:.0f} RUB/week")
        print(f"  BidCeiling: {int(wmc.get('BidCeiling', 0))/1000000:.0f} RUB")
    if funds:
        print(f"  Account Spend: {int(funds.get('Spend', 0))/1000000:.0f} RUB")
        print(f"  Account Refund: {int(funds.get('Refund', 0))/1000000:.0f} RUB")

# 5. Today's stats (if any)
print("\n" + "=" * 90)
print(f"TODAY ({TODAY})")
print("=" * 90)
txt5 = get_report("Today", "CAMPAIGN_PERFORMANCE_REPORT",
    ["CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "Conversions", "AvgImpressionPosition"],
    TODAY, TODAY,
    [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in CIDS]}])
print(txt5)
