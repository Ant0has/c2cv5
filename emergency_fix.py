#!/usr/bin/env python3
"""Emergency fix: remove 'сотрудник' keywords + add negatives for junk queries."""
import sys, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
CIDS = [705839254, 705839266]

def api_call(service, method, params):
    r = requests.post(API_URL + service, json={"method": method, "params": params}, headers=HEADERS)
    data = r.json()
    if "error" in data:
        print(f"  ERROR: {json.dumps(data['error'], ensure_ascii=False)}")
    return data

# ============================================================
# 1. Delete keywords with "сотрудник"
# ============================================================
print("=" * 70)
print("1. DELETING KEYWORDS WITH 'СОТРУДНИК'")
print("=" * 70)

KW_IDS_TO_DELETE = [
    56272580055,  # корпоративный трансфер для сотрудников
    56272580065,  # трансфер сотрудников между городами
    56562969209,  # трансфер на выставку для сотрудников
]

r = api_call("keywords", "get", {
    "SelectionCriteria": {"Ids": KW_IDS_TO_DELETE},
    "FieldNames": ["Id", "Keyword"]
})
for kw in r.get("result", {}).get("Keywords", []):
    print(f"  Deleting: {kw['Id']} — {kw['Keyword']}")

api_call("keywords", "delete", {"SelectionCriteria": {"Ids": KW_IDS_TO_DELETE}})
print("  Deleted!")

# ============================================================
# 2. Add negatives: развозка + информационные запросы
# ============================================================
print("\n" + "=" * 70)
print("2. ADDING NEGATIVE KEYWORDS")
print("=" * 70)

NEW_NEGATIVES = [
    # Перевозка/перевозки сотрудников (was missing!)
    "перевозка сотрудников",
    "перевозки сотрудников",
    "перевозку сотрудников",
    "перевозок сотрудников",
    # Информационные запросы (бухгалтерия, учёт, обоснование)
    "обоснование",
    "можно ли брать",
    "можно ли включить",
    "оплачивается ли",
    "в расходы",
    "подтверждение проезда",
    "маршрутный",
    "маршрутное",
    "маршрутным",
    "авансовый отчет такси",  # people looking for accounting info, not service
    "как учесть",
    "как оформить расходы",
    "как списать",
    "налоговый вычет",
    "бухгалтерский учет",
    "проводки",
    "НДФЛ",
]

for cid in CIDS:
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
        print(f"\n  {camp['Name']}: +{len(to_add)} negatives ({len(current)} -> {len(updated)})")
        for n in to_add:
            print(f"    + {n}")
    else:
        print(f"\n  {camp['Name']}: all already present")

# ============================================================
# 3. Summary
# ============================================================
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
for cid in CIDS:
    r = api_call("keywords", "get", {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id"]
    })
    kws = r.get("result", {}).get("Keywords", [])

    r2 = api_call("campaigns", "get", {
        "SelectionCriteria": {"Ids": [cid]},
        "FieldNames": ["Id", "Name", "NegativeKeywords"]
    })
    negs = len(r2["result"]["Campaigns"][0].get("NegativeKeywords", {}).get("Items", []))
    camp = "HOT" if cid == 705839254 else "GEO"
    print(f"  {camp}: {len(kws)} keywords, {negs} negatives")

# Quick sanity: any remaining keywords with "сотрудник"?
print("\nRemaining keywords with 'сотрудник':")
found_any = False
for cid in CIDS:
    r = api_call("keywords", "get", {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "Keyword"]
    })
    for kw in r.get("result", {}).get("Keywords", []):
        if "сотрудник" in kw["Keyword"].lower():
            print(f"  {kw['Id']}: {kw['Keyword']}")
            found_any = True
if not found_any:
    print("  None! Clean.")
