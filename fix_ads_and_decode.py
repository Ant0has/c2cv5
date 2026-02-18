#!/usr/bin/env python3
"""1. Decode etext from Yandex click URL. 2. Fix ads with 'сотрудников'."""
import sys, json, base64
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"

def api_call(service, method, params):
    r = requests.post(API_URL + service, json={"method": method, "params": params}, headers=HEADERS)
    data = r.json()
    if "error" in data:
        print(f"  ERROR: {json.dumps(data['error'], ensure_ascii=False)}")
    return data

# ============================================================
# PART 1: Decode etext
# ============================================================
print("=" * 70)
print("ETEXT DECODE")
print("=" * 70)

etext = "2202.6Yn4xRjJ_kSU5Kr04xmwM3T31KpCp1L45EYQKBzn1p6wsY-OwrsccVFRmFMpiJXvtTLjO2rupFaGZahAu-rkI21sZ29ydGt5dHRsdXVhZGg.1a6cbcad0ef9a99a0cd4404171a0cf0893bc2552"
parts = etext.split(".")
print(f"Version: {parts[0]}")
print(f"Hash: {parts[2]}")

# Decode base64 (URL-safe)
b64_data = parts[1]
# Add padding
padding = 4 - len(b64_data) % 4
if padding != 4:
    b64_data += "=" * padding

try:
    raw = base64.urlsafe_b64decode(b64_data)
    print(f"Raw bytes ({len(raw)}): {raw.hex()}")

    # Try to find readable text (search query is often at the end)
    # Try UTF-8
    try:
        text = raw.decode("utf-8", errors="replace")
        print(f"UTF-8: {text}")
    except:
        pass

    # Try to find ASCII/UTF-8 substrings
    readable = []
    current = b""
    for byte in raw:
        if 32 <= byte < 127 or byte >= 0xc0:  # printable ASCII or UTF-8 continuation
            current += bytes([byte])
        else:
            if len(current) >= 3:
                try:
                    readable.append(current.decode("utf-8", errors="ignore"))
                except:
                    pass
            current = b""
    if len(current) >= 3:
        try:
            readable.append(current.decode("utf-8", errors="ignore"))
        except:
            pass

    if readable:
        print(f"Readable fragments: {readable}")

    # The search query is typically base64-encoded within the last portion
    # Try splitting the decoded data and looking for query
    # In etext format 2202, the query is often the last N bytes
    for n in [20, 30, 40, 50, 60, 70, 80]:
        try:
            tail = raw[-n:]
            decoded_tail = tail.decode("utf-8", errors="ignore")
            if decoded_tail and any(c.isalpha() for c in decoded_tail):
                print(f"  Tail ({n} bytes): {repr(decoded_tail)}")
        except:
            pass

except Exception as e:
    print(f"Decode error: {e}")

# yclid analysis
print(f"\nyclid from URL: 11298225218930606607")
print("yclid can be found in Yandex.Metrika:")
print("  Metrika -> Reports -> Sources -> Yandex.Direct, Summary")
print("  Or: Metrika -> Webvisor (find visit by yclid parameter)")
print("  This shows: pages viewed, time on site, goals reached, user actions")

# ============================================================
# PART 2: Fix ads with "сотрудников"
# ============================================================
print("\n" + "=" * 70)
print("FIXING ADS WITH 'СОТРУДНИКОВ'")
print("=" * 70)

# Ad 17601598455 (Корпоративный трансфер group)
# Current: "Трансфер для сотрудников. Фиксированная цена. Без предоплаты."
# New:     "Трансфер для бизнеса. Фиксированная цена. Без предоплаты."
print("\n1. Ad 17601598455 (Корпоративный трансфер):")
print("   Old text: Трансфер для сотрудников. Фиксированная цена. Без предоплаты.")
print("   New text: Корпоративный трансфер. Фиксированная цена. Без предоплаты.")

r = api_call("ads", "update", {"Ads": [{
    "Id": 17601598455,
    "TextAd": {
        "Text": "Корпоративный трансфер. Фиксированная цена. Без предоплаты."
    }
}]})
if "result" in r:
    print(f"   Result: {json.dumps(r['result'], ensure_ascii=False)}")

# Ad 17601598545 (Договор/Закупка group)
# Current: "Перевозка сотрудников по договору. ЭДО. 79 регионов России."
# New:     "Перевозки по договору для юрлиц. ЭДО. 79 регионов России."
print("\n2. Ad 17601598545 (Договор/Закупка):")
print("   Old text: Перевозка сотрудников по договору. ЭДО. 79 регионов России.")
print("   New text: Перевозки по договору для юрлиц. ЭДО. 79 регионов России.")

r = api_call("ads", "update", {"Ads": [{
    "Id": 17601598545,
    "TextAd": {
        "Text": "Перевозки по договору для юрлиц. ЭДО. 79 регионов России."
    }
}]})
if "result" in r:
    print(f"   Result: {json.dumps(r['result'], ensure_ascii=False)}")

# Send both for moderation
print("\n3. Sending both ads for moderation...")
r = api_call("ads", "moderate", {"SelectionCriteria": {"Ids": [17601598455, 17601598545]}})
if "result" in r:
    print(f"   Moderate result: {json.dumps(r['result'], ensure_ascii=False)}")

# Verify
print("\n4. Verifying updated ads:")
r = api_call("ads", "get", {
    "SelectionCriteria": {"Ids": [17601598455, 17601598545]},
    "FieldNames": ["Id", "State", "Status", "StatusClarification"],
    "TextAdFieldNames": ["Title", "Title2", "Text"]
})
for a in r.get("result", {}).get("Ads", []):
    ta = a.get("TextAd", {})
    print(f"  Ad {a['Id']} [{a['Status']}]: {ta.get('Title', '')} | {ta.get('Title2', '')}")
    print(f"    {ta.get('Text', '')}")
    if a.get("StatusClarification"):
        print(f"    Status: {a['StatusClarification']}")

# Also check if any keywords mention "сотрудников" that we missed
print("\n" + "=" * 70)
print("KEYWORDS WITH 'СОТРУДНИК' (sanity check)")
print("=" * 70)
for cid in [705839254, 705839266]:
    r = api_call("keywords", "get", {
        "SelectionCriteria": {"CampaignIds": [cid]},
        "FieldNames": ["Id", "Keyword", "AdGroupId"]
    })
    for kw in r.get("result", {}).get("Keywords", []):
        if "сотрудник" in kw["Keyword"].lower():
            camp = "HOT" if cid == 705839254 else "GEO"
            print(f"  [{camp}] {kw['Id']}: {kw['Keyword']}")
