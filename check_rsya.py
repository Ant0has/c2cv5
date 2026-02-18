#!/usr/bin/env python3
import json
import requests
import time
import sys
from datetime import datetime, timedelta

sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN

CAMPAIGN_ID = 706808352
API_URL = "https://api.direct.yandex.com/json/v5/"
TOKEN = OAUTH_TOKEN

HEADERS = {
    "Authorization": "Bearer " + TOKEN,
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "ru",
}

def api_request(service, method, params):
    url = API_URL + service
    body = {"method": method, "params": params}
    resp = requests.post(url, json=body, headers=HEADERS, timeout=60)
    data = resp.json()
    if "error" in data:
        print("  [API ERROR]", data["error"])
        return None
    return data.get("result", data)

def sep(title):
    print()
    print("=" * 70)
    print("  " + title)
    print("=" * 70)

sep("1. CAMPAIGN INFO (ID: 706808352)")

result = api_request("campaigns", "get", {
    "SelectionCriteria": {"Ids": [CAMPAIGN_ID]},
    "FieldNames": [
        "Id", "Name", "Status", "State", "StatusPayment",
        "StatusClarification", "Type", "DailyBudget",
        "StartDate", "EndDate", "Statistics"
    ],
    "TextCampaignFieldNames": [
        "BiddingStrategy", "Settings"
    ]
})

if result and "Campaigns" in result:
    for c in result["Campaigns"]:
        print("  Name:           ", c.get("Name"))
        print("  ID:             ", c.get("Id"))
        print("  Type:           ", c.get("Type"))
        print("  Status:         ", c.get("Status"))
        print("  State:          ", c.get("State"))
        print("  StatusPayment:  ", c.get("StatusPayment"))
        print("  StatusClarif.:  ", c.get("StatusClarification"))
        print("  StartDate:      ", c.get("StartDate"))
        print("  EndDate:        ", c.get("EndDate"))
        db = c.get("DailyBudget")
        if db:
            amt = int(db.get("Amount", 0)) / 1000000
            print("  DailyBudget:    ", amt, "RUB", db.get("Mode"))
        stats = c.get("Statistics")
        if stats:
            print("  Impressions:    ", stats.get("Impressions"))
            print("  Clicks:         ", stats.get("Clicks"))
        tc = c.get("TextCampaign")
        if tc:
            strat = tc.get("BiddingStrategy", {})
            print("  Strategy(Search):", json.dumps(strat.get("Search", {}), ensure_ascii=False))
            print("  Strategy(Network):", json.dumps(strat.get("Network", {}), ensure_ascii=False))
            for s in tc.get("Settings", []):
                print("  Setting:", s.get("Option"), "=", s.get("Value"))
else:
    print("  No campaign data returned.")

sep("2. AD GROUPS")

offset = 0
all_groups = []
while True:
    params = {
        "SelectionCriteria": {"CampaignIds": [CAMPAIGN_ID]},
        "FieldNames": ["Id","Name","CampaignId","Status","Type","RegionIds","ServingStatus","NegativeKeywords"],
        "Page": {"Limit": 1000, "Offset": offset}
    }
    result = api_request("adgroups", "get", params)
    if result and "AdGroups" in result:
        groups = result["AdGroups"]
        all_groups.extend(groups)
        if len(groups) < 1000: break
        offset += 1000
    else: break

print("  Total ad groups:", len(all_groups))
for g in all_groups:
    print()
    print("  --- Group:", g.get("Id"), "---")
    print("    Name:", g.get("Name"))
    print("    Status:", g.get("Status"))
    print("    Type:", g.get("Type"))
    print("    ServingStatus:", g.get("ServingStatus"))
    print("    Regions:", g.get("RegionIds", []))
    neg_kw = g.get("NegativeKeywords", [])
    if neg_kw: print("    NegativeKW:", neg_kw[:10])

group_ids = [g["Id"] for g in all_groups]

sep("3. ADS")

offset = 0
all_ads = []
while True:
    params = {
        "SelectionCriteria": {"CampaignIds": [CAMPAIGN_ID]},
        "FieldNames": ["Id","AdGroupId","CampaignId","Status","State","StatusClarification","Type","Subtype"],
        "TextAdFieldNames": ["Title","Title2","Text","Href","DisplayDomain","Mobile","DisplayUrlPath"],
        "TextImageAdFieldNames": ["Href","AdImageHash"],
        "Page": {"Limit": 1000, "Offset": offset}
    }
    result = api_request("ads", "get", params)
    if result and "Ads" in result:
        ads = result["Ads"]
        all_ads.extend(ads)
        if len(ads) < 1000: break
        offset += 1000
    else: break

print("  Total ads:", len(all_ads))
for ad in all_ads:
    print()
    print("  --- Ad:", ad.get("Id"), "Group:", ad.get("AdGroupId"), "---")
    print("    Type:", ad.get("Type"), "Subtype:", ad.get("Subtype"))
    print("    Status:", ad.get("Status"), "State:", ad.get("State"))
    print("    StatusClarif.:", ad.get("StatusClarification"))
    ta = ad.get("TextAd")
    if ta:
        print("    Title:", ta.get("Title"))
        print("    Title2:", ta.get("Title2"))
        print("    Text:", ta.get("Text"))
        print("    Href:", ta.get("Href"))
        print("    Mobile:", ta.get("Mobile"))
    tia = ad.get("TextImageAd")
    if tia:
        print("    ImageHash:", tia.get("AdImageHash"))
        print("    Href:", tia.get("Href"))

sep("4. AUDIENCE TARGETS")

if group_ids:
    all_targets = []
    for i in range(0, len(group_ids), 1000):
        chunk = group_ids[i:i+1000]
        result = api_request("audiencetargets", "get", {
            "SelectionCriteria": {"AdGroupIds": chunk},
            "FieldNames": ["Id","AdGroupId","CampaignId","RetargetingListId","InterestId","State","ContextBid"]
        })
        if result and "AudienceTargets" in result:
            all_targets.extend(result["AudienceTargets"])

    print("  Total audience targets:", len(all_targets))
    for t in all_targets:
        print()
        print("  --- Target:", t.get("Id"), "Group:", t.get("AdGroupId"), "---")
        print("    RetargetingListId:", t.get("RetargetingListId"))
        print("    InterestId:", t.get("InterestId"))
        print("    State:", t.get("State"))
        cb = t.get("ContextBid")
        if cb: print("    ContextBid:", int(cb)/1000000, "RUB")
else:
    print("  No ad groups found.")

sep("5. CAMPAIGN STATISTICS (last 7 days)")

today = datetime.now().date()
date_from = (today - timedelta(days=7)).isoformat()
date_to = (today - timedelta(days=1)).isoformat()

report_body = {
    "params": {
        "SelectionCriteria": {
            "Filter": [{"Field": "CampaignId", "Operator": "EQUALS", "Values": [str(CAMPAIGN_ID)]}],
            "DateFrom": date_from, "DateTo": date_to
        },
        "FieldNames": ["Date","CampaignName","Impressions","Clicks","Cost","Ctr","AvgCpc","Conversions","CostPerConversion"],
        "ReportName": "RSYa_" + str(int(time.time())),
        "ReportType": "CAMPAIGN_PERFORMANCE_REPORT",
        "DateRangeType": "CUSTOM_DATE",
        "Format": "TSV",
        "IncludeVAT": "YES", "IncludeDiscount": "NO"
    }
}

report_url = "https://api.direct.yandex.com/json/v5/reports"
report_headers = {
    "Authorization": "Bearer " + TOKEN,
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "ru",
    "processingMode": "auto",
    "returnMoneyInMicros": "false",
    "skipReportHeader": "true",
    "skipReportSummary": "true"
}

print("  Date range:", date_from, "..", date_to)
print("  Requesting report...")

for attempt in range(10):
    resp = requests.post(report_url, json=report_body, headers=report_headers, timeout=120)
    if resp.status_code == 200:
        text_lines = resp.text.strip().splitlines()
        if text_lines:
            print()
            print("  " + text_lines[0])
            print("  " + "-" * len(text_lines[0]))
            for line in text_lines[1:]:
                print("  " + line)
        else:
            print("  Report empty.")
        break
    elif resp.status_code in (201, 202):
        print("  Report building, attempt", attempt+1, "waiting...")
        time.sleep(15)
    else:
        print("  Report error HTTP", resp.status_code)
        print("  ", resp.text[:500])
        break
else:
    print("  Report timed out.")

print()
print("=" * 70)
print("  DIAGNOSTICS COMPLETE")
print("=" * 70)
