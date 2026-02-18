#!/usr/bin/env python3
"""Remove 'развоз сотрудников' keywords, ads, and group."""
import sys, json, time
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"

def api_call(service, method, params):
    r = requests.post(API_URL + service, json={"method": method, "params": params}, headers=HEADERS)
    data = r.json()
    if "error" in data:
        print(f"  ERROR {service}.{method}: {data['error']}")
    return data

# ============================================================
# 1. Delete entire "Развозка / Служебный транспорт" group
# ============================================================
RAZVOZKA_GROUP_ID = 5708296567
print("=" * 60)
print("1. Removing 'Развозка / Служебный транспорт' group")
print("=" * 60)

# Get ads in this group
r = api_call("ads", "get", {
    "SelectionCriteria": {"AdGroupIds": [RAZVOZKA_GROUP_ID]},
    "FieldNames": ["Id", "State"]
})
ads = r.get("result", {}).get("Ads", [])
ad_ids = [a["Id"] for a in ads]
print(f"  Found {len(ad_ids)} ads: {ad_ids}")

# Suspend ads first (required before archiving)
if ad_ids:
    active_ids = [a["Id"] for a in ads if a["State"] != "OFF"]
    if active_ids:
        api_call("ads", "suspend", {"SelectionCriteria": {"Ids": active_ids}})
        print(f"  Suspended {len(active_ids)} ads")

    # Archive ads
    api_call("ads", "archive", {"SelectionCriteria": {"Ids": ad_ids}})
    print(f"  Archived {len(ad_ids)} ads")

    # Delete ads
    api_call("ads", "delete", {"SelectionCriteria": {"Ids": ad_ids}})
    print(f"  Deleted {len(ad_ids)} ads")

# Get keywords in this group
r = api_call("keywords", "get", {
    "SelectionCriteria": {"AdGroupIds": [RAZVOZKA_GROUP_ID]},
    "FieldNames": ["Id", "Keyword"]
})
kws = r.get("result", {}).get("Keywords", [])
kw_ids = [k["Id"] for k in kws if k["Keyword"] != "---autotargeting"]
print(f"  Found {len(kw_ids)} keywords (excl. autotargeting)")

# Delete keywords
if kw_ids:
    api_call("keywords", "delete", {"SelectionCriteria": {"Ids": kw_ids}})
    print(f"  Deleted {len(kw_ids)} keywords")

# Delete group
api_call("adgroups", "delete", {"SelectionCriteria": {"Ids": [RAZVOZKA_GROUP_ID]}})
print(f"  Deleted group {RAZVOZKA_GROUP_ID}")

# ============================================================
# 2. Delete individual "доставка/развоз" keywords from other groups
# ============================================================
print("\n" + "=" * 60)
print("2. Removing individual 'доставка/развоз сотрудников' keywords")
print("=" * 60)

KEYWORDS_TO_DELETE = [
    # Вахта
    56562970205,  # доставка вахтовиков на объект
    # Стройка
    56562969466,  # доставка бригады на вахту
    56562969457,  # доставка бригады на объект межгород
    56562969462,  # доставка рабочих на строительный объект
    # Медицина
    56562970352,  # доставка медперсонала межгород
    56562970353,  # перевозка сотрудников больницы
    # Договор
    56460954809,  # договор на перевозку сотрудников
    56460954812,  # тендер на перевозку сотрудников
]

# Verify these keywords exist
r = api_call("keywords", "get", {
    "SelectionCriteria": {"Ids": KEYWORDS_TO_DELETE},
    "FieldNames": ["Id", "Keyword", "AdGroupId"]
})
found = r.get("result", {}).get("Keywords", [])
print(f"  Found {len(found)} keywords to delete:")
for kw in found:
    print(f"    {kw['Id']}: {kw['Keyword']}")

if found:
    found_ids = [k["Id"] for k in found]
    api_call("keywords", "delete", {"SelectionCriteria": {"Ids": found_ids}})
    print(f"  Deleted {len(found_ids)} keywords")

# ============================================================
# 3. Add negatives to both campaigns
# ============================================================
print("\n" + "=" * 60)
print("3. Adding negatives: развоз, развозка, доставка сотрудников")
print("=" * 60)

CIDS = [705839254, 705839266]
NEW_NEGATIVES = [
    "развоз", "развозка", "развозить",
    "доставка сотрудников", "доставка персонала", "доставка рабочих",
    "доставка бригады", "доставка медперсонала", "доставка вахтовиков",
    "служебный транспорт",
]

for cid in CIDS:
    # Get current negatives
    r = api_call("campaigns", "get", {
        "SelectionCriteria": {"Ids": [cid]},
        "FieldNames": ["Id", "Name", "NegativeKeywords"]
    })
    camp = r["result"]["Campaigns"][0]
    current = camp.get("NegativeKeywords", {}).get("Items", [])
    current_lower = set(n.lower() for n in current)

    to_add = [n for n in NEW_NEGATIVES if n.lower() not in current_lower]

    if to_add:
        updated = current + to_add
        api_call("campaigns", "update", {"Campaigns": [{
            "Id": cid,
            "NegativeKeywords": {"Items": updated}
        }]})
        print(f"  {camp['Name']}: added {len(to_add)} negatives ({len(current)} -> {len(updated)})")
        for n in to_add:
            print(f"    + {n}")
    else:
        print(f"  {camp['Name']}: all negatives already present")

# ============================================================
# 4. Summary
# ============================================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

# Verify remaining keywords count
for cid in CIDS:
    r = api_call("keywords", "get", {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id"]
    })
    kws = r.get("result", {}).get("Keywords", [])

    r2 = api_call("adgroups", "get", {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "Name"]
    })
    groups = r2.get("result", {}).get("AdGroups", [])

    camp_name = "Hot" if cid == 705839254 else "Geo"
    print(f"  {camp_name} ({cid}): {len(groups)} groups, {len(kws)} keywords remaining")
