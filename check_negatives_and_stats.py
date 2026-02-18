#!/usr/bin/env python3
"""Check negatives count and get fresh stats for budget projection."""
import sys, json, datetime, time
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

# 1. Check negatives
print("=" * 70)
print("NEGATIVE KEYWORDS")
print("=" * 70)
for cid in CIDS:
    r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
        "SelectionCriteria": {"Ids": [cid]},
        "FieldNames": ["Id", "Name", "NegativeKeywords"]
    }}, headers=HEADERS)
    camp = r.json()["result"]["Campaigns"][0]
    negs = camp.get("NegativeKeywords", {}).get("Items", [])
    print(f"\nCampaign {cid} ({camp['Name']}): {len(negs)} negatives")

# 2. Fresh daily stats (last 7 days)
print("\n" + "=" * 70)
print("DAILY STATS (last 7 days)")
print("=" * 70)
today = datetime.date.today().isoformat()
d7 = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()

def get_report(name, rtype, fields, date_from, date_to, campaigns=None):
    sel = {"DateFrom": date_from, "DateTo": date_to}
    if campaigns:
        sel["Filter"] = [{"Field": "CampaignId", "Operator": "IN", "Values": [str(c) for c in campaigns]}]
    for attempt in range(5):
        r = requests.post(API_URL + "reports", json={"params": {
            "SelectionCriteria": sel,
            "FieldNames": fields,
            "ReportName": name + str(attempt),
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
            return f"Error {r.status_code}: {r.text[:200]}"
    return "Report timeout"

print(get_report("Daily7", "CAMPAIGN_PERFORMANCE_REPORT",
    ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "Conversions", "AvgImpressionPosition"],
    d7, today, CIDS))

# 3. All-time totals
print("=" * 70)
print("ALL-TIME TOTALS")
print("=" * 70)
print(get_report("AllTime2", "CAMPAIGN_PERFORMANCE_REPORT",
    ["CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "Ctr", "Conversions", "CostPerConversion", "AvgImpressionPosition"],
    "2026-01-01", today, CIDS))

# 4. Group performance (last 7 days) - to see which groups work
print("=" * 70)
print("GROUP PERFORMANCE (last 7 days)")
print("=" * 70)
print(get_report("Groups7", "ADGROUP_PERFORMANCE_REPORT",
    ["AdGroupName", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc", "Conversions", "AvgImpressionPosition"],
    d7, today, CIDS))

# 5. Current bids and auction for budget estimation
print("=" * 70)
print("KEYWORD BIDS & AUCTION (Hot campaign sample)")
print("=" * 70)
r = requests.post(API_URL + "keywords", json={"method": "get", "params": {
    "SelectionCriteria": {"CampaignIds": [705839254]},
    "FieldNames": ["Id", "Keyword"]
}}, headers=HEADERS)
kws = r.json().get("result", {}).get("Keywords", [])
real_kws = [kw for kw in kws if kw["Keyword"] != "---autotargeting"]
sample_ids = [kw["Id"] for kw in real_kws[:15]]

r = requests.post(API_URL + "keywordbids", json={"method": "get", "params": {
    "SelectionCriteria": {"KeywordIds": sample_ids},
    "FieldNames": ["KeywordId", "ServingStatus"],
    "SearchFieldNames": ["Bid", "AuctionBids"]
}}, headers=HEADERS)
bids_data = r.json().get("result", {}).get("KeywordBids", [])
kw_map = {kw["Id"]: kw["Keyword"] for kw in kws}

print(f"{'Keyword':<50} {'Bid':>5} {'1stBid':>7} {'1stPay':>7} {'2ndBid':>7} {'2ndPay':>7}")
print("-" * 95)
for b in bids_data:
    kw = kw_map.get(b["KeywordId"], "?")[:49]
    search = b.get("Search", {})
    bid = int(search.get("Bid", 0)) // 1000000
    items = search.get("AuctionBids", {}).get("AuctionBidItems", [])
    if len(items) >= 2:
        t1 = items[0]
        t2 = items[1]
        print(f"{kw:<50} {bid:>5} {int(t1.get('Bid',0))//1000000:>7} {int(t1.get('Price',0))//1000000:>7} {int(t2.get('Bid',0))//1000000:>7} {int(t2.get('Price',0))//1000000:>7}")
    elif items:
        t1 = items[0]
        print(f"{kw:<50} {bid:>5} {int(t1.get('Bid',0))//1000000:>7} {int(t1.get('Price',0))//1000000:>7}")
    else:
        print(f"{kw:<50} {bid:>5}      --      --")

# 6. Account balance
print("\n" + "=" * 70)
print("ACCOUNT BALANCE")
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

# 7. Campaign budgets
print("\n" + "=" * 70)
print("CAMPAIGN STRATEGIES & BUDGETS")
print("=" * 70)
r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": CIDS},
    "FieldNames": ["Id", "Name"],
    "TextCampaignFieldNames": ["BiddingStrategy"]
}}, headers=HEADERS)
for c in r.json().get("result", {}).get("Campaigns", []):
    tc = c.get("TextCampaign", {})
    bs = tc.get("BiddingStrategy", {})
    search = bs.get("Search", {})
    stype = search.get("BiddingStrategyType", "?")
    wmc = search.get("WbMaximumClicks", {})
    print(f"\n{c['Name']} (ID {c['Id']}):")
    print(f"  Strategy: {stype}")
    if wmc:
        print(f"  WeeklySpendLimit: {int(wmc.get('WeeklySpendLimit', 0))/1000000:.0f} RUB/week")
        print(f"  BidCeiling: {int(wmc.get('BidCeiling', 0))/1000000:.0f} RUB")

# 8. Search queries last 3 days to check quality after negatives
print("\n" + "=" * 70)
print("SEARCH QUERIES (last 3 days)")
print("=" * 70)
d3 = (datetime.date.today() - datetime.timedelta(days=3)).isoformat()
txt = get_report("SQ3d", "SEARCH_QUERY_PERFORMANCE_REPORT",
    ["Query", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgImpressionPosition"],
    d3, today, CIDS)
if txt:
    lines = txt.strip().split("\n")
    print(f"Total query rows: {len(lines) - 1}")
    for line in lines[:50]:
        print(line)
