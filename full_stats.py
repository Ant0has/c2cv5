#!/usr/bin/env python3
"""Full stats check: all-time, daily, groups, queries, bids, balance."""
import sys, json, datetime
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

def report(name, rtype, fields, date_from, date_to, campaigns=None):
    sel = {"DateFrom": date_from, "DateTo": date_to}
    if campaigns:
        sel["Filter"] = [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in campaigns]}]
    r = requests.post(API_URL + "reports", json={"params": {
        "SelectionCriteria": sel,
        "FieldNames": fields,
        "ReportName": name,
        "ReportType": rtype,
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES",
        "IncludeDiscount": "NO",
    }}, headers=REPORT_HEADERS)
    if r.status_code == 200:
        return r.text
    elif r.status_code in (201, 202):
        import time
        time.sleep(5)
        return "Report queued, try again"
    return f"Error {r.status_code}: {r.text[:200]}"

today = datetime.date.today().isoformat()
d14 = (datetime.date.today() - datetime.timedelta(days=14)).isoformat()
CIDS = [705839254, 705839266]

# 1. All-time by campaign
print("=" * 70)
print("ALL-TIME STATS BY CAMPAIGN")
print("=" * 70)
print(report("AT1", "CAMPAIGN_PERFORMANCE_REPORT",
    ["CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr",
     "Conversions", "CostPerConversion", "AvgImpressionPosition"],
    "2026-01-01", today, CIDS))

# 2. Daily stats
print("=" * 70)
print("DAILY STATS (last 14 days)")
print("=" * 70)
print(report("D1", "CAMPAIGN_PERFORMANCE_REPORT",
    ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "AvgImpressionPosition"],
    d14, today, CIDS))

# 3. Ad group stats
print("=" * 70)
print("GROUP PERFORMANCE (last 14 days)")
print("=" * 70)
print(report("G1", "ADGROUP_PERFORMANCE_REPORT",
    ["AdGroupName", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "AvgImpressionPosition"],
    d14, today, CIDS))

# 4. Search queries
print("=" * 70)
print("SEARCH QUERIES (last 14 days)")
print("=" * 70)
print(report("Q1", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Query", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgImpressionPosition"],
    d14, today, CIDS))

# 5. Keyword bids after ceiling change
print("=" * 70)
print("KEYWORD BIDS (sample after 500r ceiling)")
print("=" * 70)
r = requests.post(API_URL + "keywords", json={"method": "get", "params": {
    "SelectionCriteria": {"CampaignIds": [705839254]},
    "FieldNames": ["Id", "Keyword"]
}}, headers=HEADERS)
kws = r.json().get("result", {}).get("Keywords", [])
real_kws = [kw for kw in kws if kw["Keyword"] != "---autotargeting"]
sample_ids = [kw["Id"] for kw in real_kws[:10]]

r = requests.post(API_URL + "keywordbids", json={"method": "get", "params": {
    "SelectionCriteria": {"KeywordIds": sample_ids},
    "FieldNames": ["KeywordId", "ServingStatus"],
    "SearchFieldNames": ["Bid", "AuctionBids"]
}}, headers=HEADERS)
bids_data = r.json().get("result", {}).get("KeywordBids", [])
kw_map = {kw["Id"]: kw["Keyword"] for kw in kws}

print(f"{'Keyword':<48} {'Bid':>5} {'TopBid':>7} {'TopPay':>7} {'Vol':>4}")
print("-" * 75)
for b in bids_data:
    kw = kw_map.get(b["KeywordId"], "?")[:47]
    search = b.get("Search", {})
    bid = int(search.get("Bid", 0)) // 1000000
    items = search.get("AuctionBids", {}).get("AuctionBidItems", [])
    if items:
        top = items[0]
        top_bid = int(top.get("Bid", 0)) // 1000000
        top_price = int(top.get("Price", 0)) // 1000000
        top_tv = top.get("TrafficVolume", 0)
    else:
        top_bid = top_price = top_tv = 0
    print(f"{kw:<48} {bid:>5} {top_bid:>7} {top_price:>7} {top_tv:>4}")

# 6. Account balance
print()
print("=" * 70)
print("ACCOUNT FUNDS")
print("=" * 70)
r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": [705839254]},
    "FieldNames": ["Id", "Funds"]
}}, headers=HEADERS)
for c in r.json().get("result", {}).get("Campaigns", []):
    funds = c.get("Funds", {})
    sa = funds.get("SharedAccountFunds", {})
    if sa:
        print(f"  Shared account spend: {int(sa.get('Spend', 0))/1000000:.0f} RUB")
        print(f"  Shared account refund: {int(sa.get('Refund', 0))/1000000:.0f} RUB")
    cf = funds.get("CampaignFunds", {})
    if cf:
        print(f"  Campaign sum: {int(cf.get('Sum', 0))/1000000:.0f} RUB")
        print(f"  Campaign balance: {int(cf.get('Balance', 0))/1000000:.0f} RUB")
