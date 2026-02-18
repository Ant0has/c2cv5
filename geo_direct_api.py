#!/usr/bin/env python3
"""Get Geo analysis through direct API calls (bypass reports queue)."""
import sys, json, time, datetime
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
GEO_CID = 705839266
HOT_CID = 705839254

def api_call(service, method, params):
    r = requests.post(API_URL + service, json={"method": method, "params": params}, headers=HEADERS)
    return r.json()

# 1. Get all Geo groups with stats
print("=" * 70)
print("GEO CAMPAIGN: GROUPS")
print("=" * 70)
r = api_call("adgroups", "get", {
    "SelectionCriteria": {"CampaignIds": [GEO_CID]},
    "FieldNames": ["Id", "Name", "Status", "ServingStatus"]
})
groups = r.get("result", {}).get("AdGroups", [])
for g in groups:
    print(f"  {g['Id']}: {g['Name']} [{g['ServingStatus']}]")

# 2. Get all Geo keywords with serving status
print("\n" + "=" * 70)
print("GEO CAMPAIGN: KEYWORDS WITH BIDS")
print("=" * 70)
r = api_call("keywords", "get", {
    "SelectionCriteria": {"CampaignIds": [GEO_CID]},
    "FieldNames": ["Id", "Keyword", "AdGroupId", "ServingStatus", "Statistics"]
})
kws = r.get("result", {}).get("Keywords", [])
group_map = {g["Id"]: g["Name"] for g in groups}
for kw in sorted(kws, key=lambda x: x["AdGroupId"]):
    if kw["Keyword"] == "---autotargeting":
        continue
    grp = group_map.get(kw["AdGroupId"], "?")
    stats = kw.get("Statistics", {})
    print(f"  [{grp}] {kw['Keyword']} — {kw['ServingStatus']}")
    if stats:
        print(f"    Stats: {json.dumps(stats, ensure_ascii=False)}")

# 3. Get Geo keyword bids and auction data
print("\n" + "=" * 70)
print("GEO: KEYWORD BIDS & AUCTION")
print("=" * 70)
kw_ids = [k["Id"] for k in kws if k["Keyword"] != "---autotargeting"]
# Split into chunks of 10
for i in range(0, len(kw_ids), 10):
    chunk = kw_ids[i:i+10]
    r = api_call("keywordbids", "get", {
        "SelectionCriteria": {"KeywordIds": chunk},
        "FieldNames": ["KeywordId", "ServingStatus"],
        "SearchFieldNames": ["Bid", "AuctionBids"]
    })
    bids = r.get("result", {}).get("KeywordBids", [])
    kw_map = {k["Id"]: k for k in kws}
    for b in bids:
        kw = kw_map.get(b["KeywordId"], {})
        keyword = kw.get("Keyword", "?")
        grp = group_map.get(kw.get("AdGroupId", 0), "?")
        search = b.get("Search", {})
        bid = int(search.get("Bid", 0)) // 1000000
        items = search.get("AuctionBids", {}).get("AuctionBidItems", [])
        if items:
            p1_bid = int(items[0].get("Bid", 0)) // 1000000
            p1_pay = int(items[0].get("Price", 0)) // 1000000
            print(f"  [{grp}] {keyword}: bid={bid}, 1st={p1_bid}/{p1_pay}R")
        else:
            print(f"  [{grp}] {keyword}: bid={bid}, no auction data")

# 4. Get all Geo ads
print("\n" + "=" * 70)
print("GEO: ALL ADS")
print("=" * 70)
r = api_call("ads", "get", {
    "SelectionCriteria": {"CampaignIds": [GEO_CID]},
    "FieldNames": ["Id", "AdGroupId", "State", "Status", "StatusClarification"],
    "TextAdFieldNames": ["Title", "Title2", "Text", "Href"]
})
ads = r.get("result", {}).get("Ads", [])
for a in sorted(ads, key=lambda x: x["AdGroupId"]):
    grp = group_map.get(a["AdGroupId"], "?")
    ta = a.get("TextAd", {})
    print(f"\n  [{grp}] Ad {a['Id']} [{a['State']}/{a['Status']}]")
    print(f"    {ta.get('Title', '')} | {ta.get('Title2', '')}")
    print(f"    {ta.get('Text', '')}")
    if a.get("StatusClarification"):
        print(f"    StatusClarification: {a['StatusClarification']}")

# 5. Try to get a VERY quick report - just today, Geo only, campaign level
print("\n" + "=" * 70)
print("QUICK TODAY REPORT (Geo)")
print("=" * 70)
TODAY = datetime.date.today().isoformat()
REPORT_HEADERS = {
    **HEADERS,
    "processingMode": "auto",
    "returnMoneyInMicros": "false",
    "skipReportHeader": "true",
    "skipReportSummary": "true",
}
for attempt in range(10):
    r = requests.post(API_URL + "reports", json={"params": {
        "SelectionCriteria": {
            "DateFrom": TODAY, "DateTo": TODAY,
            "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": [str(GEO_CID)]}]
        },
        "FieldNames": ["AdGroupName", "Clicks", "Cost", "Conversions", "AvgImpressionPosition"],
        "ReportName": f"quick_today_{int(time.time())}_{attempt}",
        "ReportType": "ADGROUP_PERFORMANCE_REPORT",
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES",
        "IncludeDiscount": "NO",
    }}, headers=REPORT_HEADERS)
    if r.status_code == 200:
        print(r.text)
        break
    elif r.status_code in (201, 202):
        time.sleep(int(r.headers.get("retryIn", 5)))
    else:
        print(f"Err {r.status_code}, retry {attempt}...")
        time.sleep(15)
else:
    print("Report still queued")

# 6. What is GoalId 12?
print("\n" + "=" * 70)
print("GOAL ANALYSIS")
print("=" * 70)
print(f"GoalId: 12 (configured on counter 36995060)")
print(f"Goal value: 300 RUB")
print(f"Attribution: AUTO")
print()
print("Common Metrika goal IDs:")
print("  GoalId 0 = all goals combined")
print("  GoalId N = specific custom goals created in Metrika counter")
print()
print("Since we cannot access Metrika API (no scope), checking goal from campaign settings:")
print("  Both campaigns target GoalId 12 with CPA value 300 RUB")
print("  This is likely a custom form/call goal in Metrika counter 36995060")
print()
print("Device breakdown from earlier shows:")
print("  Geo Feb 16: 2 conv on MOBILE (3 clicks, 262R)")
print("  Geo Feb 17: 2 conv on DESKTOP (4 clicks, 687R)")
print("  -> Mixed device, not bot/spam pattern")
