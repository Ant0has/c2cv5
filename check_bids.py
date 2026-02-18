#!/usr/bin/env python3
"""Check keyword bid forecasts to understand competitive landscape."""
import sys, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"

# Get keyword bids info - use keywordbids service
# Check a sample of keywords from each campaign

# First get some keywords
sample_keywords = {}
for cid in [705839254, 705839266]:
    r = requests.post(API_URL + "keywords", json={"method": "get", "params": {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "Keyword", "AdGroupId"]
    }}, headers=HEADERS)
    kws = r.json().get("result", {}).get("Keywords", [])
    # Take first 10 non-autotargeting keywords
    for kw in kws:
        if kw["Keyword"] != "---autotargeting" and len(sample_keywords) < 20:
            sample_keywords[kw["Id"]] = kw["Keyword"]

print(f"Checking bids for {len(sample_keywords)} sample keywords...\n")

# Get keyword bids
kw_ids = list(sample_keywords.keys())
r = requests.post(API_URL + "keywordbids", json={"method": "get", "params": {
    "SelectionCriteria": {"KeywordIds": kw_ids},
    "FieldNames": ["KeywordId", "ServingStatus", "StrategyPriority"],
    "SearchFieldNames": ["Bid", "AuctionBids"]
}}, headers=HEADERS)

data = r.json()
if "error" in data:
    print(f"Error: {json.dumps(data['error'], ensure_ascii=False)}")
else:
    bids = data.get("result", {}).get("KeywordBids", [])
    # Print first raw bid to understand structure
    if bids:
        print("Raw first bid:")
        print(json.dumps(bids[0], indent=2, ensure_ascii=False)[:500])
        print()

    for b in bids:
        kw_id = b["KeywordId"]
        kw_text = sample_keywords.get(kw_id, "?")[:55]
        search = b.get("Search", {})
        bid = search.get("Bid")
        bid_str = f"{int(bid)/1000000:.0f}r" if bid else "--"
        print(f"  {kw_text}: bid={bid_str}")

# Also check via forecast - keywords.getForecasts might not exist
# Try reports instead - get AvgCpc from recent data
print("\n" + "=" * 60)
print("HISTORICAL CPC (all time)")
print("=" * 60)

r = requests.post(API_URL + "reports", json={
    "params": {
        "SelectionCriteria": {
            "DateFrom": "2026-01-01",
            "DateTo": "2026-02-13",
            "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": ["705839254", "705839266"]}]
        },
        "FieldNames": ["CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "AvgImpressionPosition"],
        "ReportName": "BidAnalysis",
        "ReportType": "CAMPAIGN_PERFORMANCE_REPORT",
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES",
        "IncludeDiscount": "NO"
    }
}, headers={**HEADERS, "processingMode": "auto", "returnMoneyInMicros": "false", "skipReportHeader": "true", "skipReportSummary": "true"})

if r.status_code == 200:
    print(r.text[:2000])
else:
    print(f"Status: {r.status_code}")
    print(r.text[:500])

# Check search query report for any recent traffic
print("\n" + "=" * 60)
print("SEARCH QUERIES (last 7 days)")
print("=" * 60)

import datetime
week_ago = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
today = datetime.date.today().isoformat()

r = requests.post(API_URL + "reports", json={
    "params": {
        "SelectionCriteria": {
            "DateFrom": week_ago,
            "DateTo": today,
            "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": ["705839254", "705839266"]}]
        },
        "FieldNames": ["Query", "Impressions", "Clicks", "AvgCpc", "AvgImpressionPosition", "CampaignName"],
        "ReportName": "SearchQueries",
        "ReportType": "SEARCH_QUERY_PERFORMANCE_REPORT",
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES",
        "IncludeDiscount": "NO"
    }
}, headers={**HEADERS, "processingMode": "auto", "returnMoneyInMicros": "false", "skipReportHeader": "true", "skipReportSummary": "true"})

if r.status_code == 200:
    lines = r.text.strip().split("\n")
    print(f"Total query rows: {len(lines) - 1}")
    for line in lines[:30]:
        print(line)
else:
    print(f"Status: {r.status_code}")
