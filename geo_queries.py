#!/usr/bin/env python3
"""Get Geo yesterday breakdown, search queries, and locations."""
import sys, json, time, datetime
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
REPORT_HEADERS = {**HEADERS,
    "processingMode": "auto", "returnMoneyInMicros": "false",
    "skipReportHeader": "true", "skipReportSummary": "true"}

def report(name, rtype, fields, date_from, date_to, cid):
    sel = {"DateFrom": date_from, "DateTo": date_to,
           "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": [str(cid)]}]}
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
            time.sleep(15)
    return "TIMEOUT"

# 1. Yesterday (Mon Feb 16) group breakdown for Geo
print("=== GEO YESTERDAY (Feb 16) BY GROUP ===")
print(report("gy", "ADGROUP_PERFORMANCE_REPORT",
    ["AdGroupName", "Clicks", "Cost", "Conversions", "AvgImpressionPosition"],
    "2026-02-16", "2026-02-16", 705839266))

# 2. Geo search queries Feb 13-17
print("\n=== GEO SEARCH QUERIES (Feb 13-17) ===")
print(report("gsq", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17", 705839266))

# 3. Hot search queries Feb 13-17
print("\n=== HOT SEARCH QUERIES (Feb 13-17) ===")
print(report("hsq", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17", 705839254))

# 4. Geo: user locations
print("\n=== GEO: USER LOCATIONS (Feb 13-17) ===")
print(report("gloc", "CUSTOM_REPORT",
    ["LocationOfPresenceName", "Clicks", "Cost", "Conversions"],
    "2026-02-13", "2026-02-17", 705839266))
