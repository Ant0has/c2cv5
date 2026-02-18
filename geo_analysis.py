#!/usr/bin/env python3
"""Deep dive into Geo campaign conversions and performance."""
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
D14 = (datetime.date.today() - datetime.timedelta(days=14)).isoformat()
ts = int(time.time())

def get_report(name, rtype, fields, date_from, date_to, extra_filter=None):
    sel = {"DateFrom": date_from, "DateTo": date_to}
    if extra_filter:
        sel["Filter"] = extra_filter
    for attempt in range(10):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel,
            "FieldNames": fields,
            "ReportName": f"{name}_{ts}_{attempt}",
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

cid_filter = lambda cid: [{"Field": "CampaignId", "Operator": "IN", "Values": [str(cid)]}]

# 1. Geo: conversions by group (last 7 days)
print("=" * 90)
print("GEO: GROUP PERFORMANCE (last 7 days)")
print("=" * 90)
txt = get_report("GeoGrp", "ADGROUP_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions", "AvgImpressionPosition"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt)

# 2. Geo: conversions by search query (last 7 days)
print("=" * 90)
print("GEO: SEARCH QUERIES (last 7 days)")
print("=" * 90)
txt2 = get_report("GeoSQ", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Impressions", "Clicks", "Cost", "Ctr", "Conversions", "AvgImpressionPosition"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt2)

# 3. Geo: conversions by ad (A/B test results)
print("=" * 90)
print("GEO: AD PERFORMANCE (last 7 days)")
print("=" * 90)
txt3 = get_report("GeoAd", "AD_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "AdId", "Impressions", "Clicks", "Cost", "Ctr", "Conversions"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt3)

# 4. Geo: conversion details - what goals triggered
print("=" * 90)
print("GEO: CONVERSIONS BY GOAL (last 7 days)")
print("=" * 90)
txt4 = get_report("GeoGoals", "CUSTOM_REPORT",
    ["Date", "CampaignName", "AdGroupName", "GoalId", "Conversions", "CostPerConversion", "ConversionRate"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt4)

# 5. Hot: same goal breakdown for comparison
print("=" * 90)
print("HOT: CONVERSIONS BY GOAL (last 7 days)")
print("=" * 90)
txt5 = get_report("HotGoals", "CUSTOM_REPORT",
    ["Date", "CampaignName", "AdGroupName", "GoalId", "Conversions", "CostPerConversion", "ConversionRate"],
    D7, TODAY, cid_filter(HOT_CID))
print(txt5)

# 6. Geo: device breakdown
print("=" * 90)
print("GEO: DEVICE BREAKDOWN (last 7 days)")
print("=" * 90)
txt6 = get_report("GeoDevice", "CAMPAIGN_PERFORMANCE_REPORT",
    ["Date", "Device", "Impressions", "Clicks", "Cost", "Ctr", "Conversions"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt6)

# 7. Check what Metrika goals are configured
print("=" * 90)
print("CAMPAIGN GOAL SETTINGS")
print("=" * 90)
for cid in [GEO_CID, HOT_CID]:
    r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
        "SelectionCriteria": {"Ids": [cid]},
        "FieldNames": ["Id", "Name"],
        "TextCampaignFieldNames": ["CounterIds", "Goals", "AttributionModel"]
    }}, headers=HEADERS)
    for c in r.json().get("result", {}).get("Campaigns", []):
        tc = c.get("TextCampaign", {})
        print(f"\n{c['Name']} (ID {c['Id']}):")
        print(f"  CounterIds: {tc.get('CounterIds', {})}")
        print(f"  Goals: {json.dumps(tc.get('Goals', {}), ensure_ascii=False)}")
        print(f"  Attribution: {tc.get('AttributionModel', '?')}")

# 8. Geo: region/location breakdown
print("\n" + "=" * 90)
print("GEO: CLICKS BY LOCATION (last 7 days)")
print("=" * 90)
txt8 = get_report("GeoLoc", "CUSTOM_REPORT",
    ["Date", "LocationOfPresenceName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, cid_filter(GEO_CID))
print(txt8)
