#!/usr/bin/env python3
"""Geo campaign deep dive - with queue patience."""
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
GEO_CID = 705839266
HOT_CID = 705839254
TODAY = datetime.date.today().isoformat()
D7 = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()

def get_report(name, rtype, fields, date_from, date_to, cid):
    sel = {"DateFrom": date_from, "DateTo": date_to,
           "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": [str(cid)]}]}
    for attempt in range(15):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel,
            "FieldNames": fields,
            "ReportName": f"{name}_{int(time.time())}_{attempt}",
            "ReportType": rtype,
            "DateRangeType": "CUSTOM_DATE",
            "Format": "TSV",
            "IncludeVAT": "YES",
            "IncludeDiscount": "NO",
        }}, headers=REPORT_HEADERS)
        if r.status_code == 200:
            return r.text
        elif r.status_code in (201, 202):
            wait = int(r.headers.get("retryIn", 10))
            print(f"  [{name}] queued, retry in {wait}s...")
            time.sleep(wait)
        elif r.status_code == 400 and "9000" in r.text:
            print(f"  [{name}] queue full, waiting 15s...")
            time.sleep(15)
        else:
            return f"Error {r.status_code}: {r.text[:300]}"
    return "Report timeout after 15 attempts"

# 1. Geo: group performance
print("=" * 90)
print("GEO: GROUP BREAKDOWN (last 7 days)")
print("=" * 90)
txt1 = get_report("GG", "ADGROUP_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions", "AvgImpressionPosition"],
    D7, TODAY, GEO_CID)
print(txt1)

# 2. Geo: search queries with conversions
print("=" * 90)
print("GEO: SEARCH QUERIES (last 7 days)")
print("=" * 90)
txt2 = get_report("GSQ", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, GEO_CID)
print(txt2)

# 3. Geo: ad performance (A/B)
print("=" * 90)
print("GEO: AD PERFORMANCE (last 7 days)")
print("=" * 90)
txt3 = get_report("GAD", "AD_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "AdId", "Impressions", "Clicks", "Ctr", "Conversions"],
    D7, TODAY, GEO_CID)
print(txt3)

# 4. Geo: location
print("=" * 90)
print("GEO: CLICKS BY REGION (last 7 days)")
print("=" * 90)
txt4 = get_report("GLoc", "CUSTOM_REPORT",
    ["Date", "LocationOfPresenceName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, GEO_CID)
print(txt4)

# 5. Hot: group performance for comparison
print("=" * 90)
print("HOT: GROUP BREAKDOWN (last 7 days)")
print("=" * 90)
txt5 = get_report("HG", "ADGROUP_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions", "AvgImpressionPosition"],
    D7, TODAY, HOT_CID)
print(txt5)

# 6. Hot: search queries
print("=" * 90)
print("HOT: SEARCH QUERIES (last 7 days)")
print("=" * 90)
txt6 = get_report("HSQ", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, HOT_CID)
print(txt6)
