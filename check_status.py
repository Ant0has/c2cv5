#!/usr/bin/env python3
"""Check why campaigns have no impressions."""
import sys, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"

# 1. Campaign status and strategy
print("=" * 60)
print("CAMPAIGNS")
print("=" * 60)
r = requests.post(API_URL + "campaigns", json={"method": "get", "params": {
    "SelectionCriteria": {"Ids": [705839254, 705839266]},
    "FieldNames": ["Id", "Name", "State", "Status", "StatusClarification", "StatusPayment", "Funds"],
    "TextCampaignFieldNames": ["BiddingStrategy"]
}}, headers=HEADERS)
for c in r.json().get("result", {}).get("Campaigns", []):
    print(f"\nCampaign {c['Id']}: {c['Name']}")
    print(f"  State: {c['State']} | Status: {c['Status']}")
    print(f"  StatusClarification: {c.get('StatusClarification', 'none')}")
    print(f"  StatusPayment: {c.get('StatusPayment', 'none')}")
    funds = c.get("Funds", {})
    if funds.get("SharedAccountFunds"):
        sf = funds["SharedAccountFunds"]
        print(f"  SharedAccount Spend: {int(sf.get('Spend', 0))/1000000:.0f} RUB")
    if funds.get("CampaignFunds"):
        cf = funds["CampaignFunds"]
        print(f"  CampaignFunds Sum: {int(cf.get('Sum', 0))/1000000:.0f} RUB, Balance: {int(cf.get('Balance', 0))/1000000:.0f} RUB")
    tc = c.get("TextCampaign", {})
    bs = tc.get("BiddingStrategy", {})
    search = bs.get("Search", {})
    print(f"  Strategy: {search.get('BiddingStrategyType')}")
    wmc = search.get("WbMaximumClicks", {})
    if wmc:
        print(f"  WeeklySpendLimit: {int(wmc.get('WeeklySpendLimit', 0))/1000000:.0f} RUB")
        print(f"  BidCeiling: {int(wmc.get('BidCeiling', 0))/1000000:.0f} RUB")

# 2. Ad statuses
print("\n" + "=" * 60)
print("AD STATUSES")
print("=" * 60)
for cid in [705839254, 705839266]:
    r = requests.post(API_URL + "ads", json={"method": "get", "params": {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "State", "Status", "StatusClarification"]
    }}, headers=HEADERS)
    ads = r.json().get("result", {}).get("Ads", [])
    states = {}
    clarifications = {}
    for a in ads:
        key = a["State"] + "/" + a["Status"]
        states[key] = states.get(key, 0) + 1
        sc = a.get("StatusClarification", "")
        if sc:
            clarifications[sc] = clarifications.get(sc, 0) + 1
    print(f"\nCampaign {cid}: {len(ads)} ads")
    for k, v in sorted(states.items()):
        print(f"  {k}: {v}")
    if clarifications:
        print(f"  Clarifications:")
        for k, v in clarifications.items():
            print(f"    {k}: {v}")

# 3. Keyword serving status
print("\n" + "=" * 60)
print("KEYWORD SERVING STATUS")
print("=" * 60)
for cid in [705839254, 705839266]:
    r = requests.post(API_URL + "keywords", json={"method": "get", "params": {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "Keyword", "Status", "State", "ServingStatus"]
    }}, headers=HEADERS)
    kws = r.json().get("result", {}).get("Keywords", [])
    serving = {}
    not_serving = []
    for kw in kws:
        ss = kw.get("ServingStatus", "?")
        serving[ss] = serving.get(ss, 0) + 1
        if ss != "ELIGIBLE" and kw["Keyword"] != "---autotargeting":
            not_serving.append(kw)
    print(f"\nCampaign {cid}: {len(kws)} keywords")
    for k, v in sorted(serving.items()):
        print(f"  {k}: {v}")
    if not_serving:
        print(f"  Not serving ({len(not_serving)}):")
        for kw in not_serving[:15]:
            print(f"    [{kw['ServingStatus']}] {kw['Keyword']} (state={kw['State']} status={kw['Status']})")

# 4. Check today's stats from reports
print("\n" + "=" * 60)
print("TODAY'S STATS (last 2 days)")
print("=" * 60)
import datetime
today = datetime.date.today().isoformat()
yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()

r = requests.post(API_URL + "reports", json={
    "params": {
        "SelectionCriteria": {
            "DateFrom": yesterday,
            "DateTo": today,
            "Filter": [{"Field": "CampaignId", "Operator": "IN", "Values": ["705839254", "705839266"]}]
        },
        "FieldNames": ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "AvgCpc", "AvgImpressionPosition"],
        "ReportName": "StatusCheck",
        "ReportType": "CAMPAIGN_PERFORMANCE_REPORT",
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES",
        "IncludeDiscount": "NO"
    }
}, headers={**HEADERS, "processingMode": "auto", "returnMoneyInMicros": "false", "skipReportHeader": "true", "skipReportSummary": "true"})

print(f"  Report status: {r.status_code}")
if r.status_code == 200:
    print(r.text[:2000])
elif r.status_code == 201 or r.status_code == 202:
    print(f"  Report queued (retryIn: {r.headers.get('retryIn', '?')} sec)")
else:
    print(f"  Error: {r.text[:500]}")
