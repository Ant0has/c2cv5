#!/usr/bin/env python3
"""Geo deep dive - run sequentially with nohup safety."""
import sys, json, time, datetime
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
REPORT_HEADERS = {
    **HEADERS,
    "processingMode": "offline",
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
    for attempt in range(20):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel,
            "FieldNames": fields,
            "ReportName": f"{name}_{int(time.time())}",
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
        elif r.status_code == 400 and "9000" in r.text:
            time.sleep(20)
        else:
            return f"Error {r.status_code}: {r.text[:200]}"
    return "TIMEOUT"

out = open("/home/anton-furs/yandex-direct-bot/geo_results.txt", "w")
def p(s):
    print(s)
    out.write(s + "\n")
    out.flush()

p("=" * 90)
p("1. GEO: GROUP BREAKDOWN (last 7 days)")
p("=" * 90)
p(get_report("GG", "ADGROUP_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions", "AvgImpressionPosition"],
    D7, TODAY, GEO_CID))

p("\n" + "=" * 90)
p("2. GEO: SEARCH QUERIES (last 7 days)")
p("=" * 90)
p(get_report("GSQ", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, GEO_CID))

p("\n" + "=" * 90)
p("3. GEO: AD PERFORMANCE (last 7 days)")
p("=" * 90)
p(get_report("GAD", "AD_PERFORMANCE_REPORT",
    ["Date", "AdGroupName", "AdId", "Impressions", "Clicks", "Ctr", "Conversions"],
    D7, TODAY, GEO_CID))

p("\n" + "=" * 90)
p("4. GEO: CLICKS BY REGION (last 7 days)")
p("=" * 90)
p(get_report("GLoc", "CUSTOM_REPORT",
    ["LocationOfPresenceName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, GEO_CID))

p("\n" + "=" * 90)
p("5. HOT: SEARCH QUERIES WITH CONVERSIONS (last 7 days)")
p("=" * 90)
p(get_report("HSQ", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Date", "Query", "AdGroupName", "Impressions", "Clicks", "Cost", "Conversions"],
    D7, TODAY, HOT_CID))

out.close()
print("\nDONE - results also saved to geo_results.txt")
