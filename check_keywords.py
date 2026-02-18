#!/usr/bin/env python3
"""List all keywords across both campaigns to find 'развоз' related ones."""
import sys, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
CIDS = [705839254, 705839266]

# Get all groups first
r = requests.post(API_URL + "adgroups", json={"method": "get", "params": {
    "SelectionCriteria": {"CampaignIds": CIDS},
    "FieldNames": ["Id", "Name", "CampaignId"]
}}, headers=HEADERS)
groups = r.json()["result"]["AdGroups"]
group_map = {g["Id"]: g for g in groups}

# Get all keywords
r = requests.post(API_URL + "keywords", json={"method": "get", "params": {
    "SelectionCriteria": {"CampaignIds": CIDS},
    "FieldNames": ["Id", "Keyword", "AdGroupId", "State", "Status"]
}}, headers=HEADERS)
keywords = r.json()["result"]["Keywords"]

print(f"Total keywords: {len(keywords)}")
print(f"Total groups: {len(groups)}")
print()

# Show all keywords grouped by adgroup
for g in sorted(groups, key=lambda x: (x["CampaignId"], x["Name"])):
    gid = g["Id"]
    cid = g["CampaignId"]
    camp_name = "Hot" if cid == 705839254 else "Geo"
    group_kws = [kw for kw in keywords if kw["AdGroupId"] == gid]

    print(f"\n{'='*70}")
    print(f"[{camp_name}] {g['Name']} (group {gid})")
    print(f"{'='*70}")
    for kw in sorted(group_kws, key=lambda x: x["Keyword"]):
        marker = ""
        kw_lower = kw["Keyword"].lower()
        # Flag keywords related to развоз/shuttle
        if any(w in kw_lower for w in ["развоз", "развоз", "доставк", "shuttle"]):
            marker = " <<<< РАЗВОЗ"
        if "трансфер сотрудник" in kw_lower or "перевозка сотрудник" in kw_lower:
            marker = " <<<< СОТРУДНИКИ-ТРАНСФЕР"
        state = kw["State"]
        status = kw["Status"]
        flag = "" if state == "ON" and status == "ACCEPTED" else f" [{state}/{status}]"
        print(f"  {kw['Id']:>12}  {kw['Keyword']}{flag}{marker}")
