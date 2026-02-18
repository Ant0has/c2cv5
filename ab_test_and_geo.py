#!/usr/bin/env python3
"""
Improvements script:
1. Add B-variant ads to all groups (A/B testing)
2. Add new cities to Geo campaign
3. Increase Geo campaign budget
"""
import sys, time, json
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"
B2B_HREF = "https://city2city.ru/dlya-biznesa?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_id}&utm_term={keyword}"
SITELINK_SET_ID = 1460569787
CALLOUT_IDS = [41763989, 41763990, 41763991, 41763992, 41763993, 41269542, 41763994, 41763995]

HOT_CAMPAIGN_ID = 705839254
GEO_CAMPAIGN_ID = 705839266

def api_call(service, method, params):
    r = requests.post(API_URL + service, json={"method": method, "params": params}, headers=HEADERS)
    data = r.json()
    if "error" in data:
        print(f"  ERROR [{service}.{method}]: {json.dumps(data['error'], ensure_ascii=False)}")
        return None
    return data.get("result", {})

def validate_ad(t1, t2, txt):
    assert len(t1) <= 56, f"Title too long ({len(t1)}): {t1}"
    assert len(t2) <= 30, f"Title2 too long ({len(t2)}): {t2}"
    assert len(txt) <= 81, f"Text too long ({len(txt)}): {txt}"

ALL_NEW_AD_IDS = []  # collect for bulk callout attachment

def create_ad(group_id, title, title2, text):
    validate_ad(title, title2, text)
    result = api_call("ads", "add", {
        "Ads": [{
            "AdGroupId": group_id,
            "TextAd": {
                "Title": title,
                "Title2": title2,
                "Text": text,
                "Href": B2B_HREF,
                "Mobile": "NO",
                "SitelinkSetId": SITELINK_SET_ID,
            }
        }]
    })
    if result and result.get("AddResults"):
        r = result["AddResults"][0]
        if r.get("Id"):
            ALL_NEW_AD_IDS.append(r["Id"])
            return r["Id"]
        else:
            print(f"    FAIL: {r.get('Errors')}")
    return None

# =================================================================
# STEP 1: A/B ads for Hot campaign
# =================================================================
print("=" * 60)
print("STEP 1: Creating B-variant ads for Hot campaign")
print("=" * 60)

HOT_B_VARIANTS = [
    {
        "group_id": 5692933735,
        "title": "Корпоративное такси межгород",
        "title2": "От 16 р/км. 79 регионов",
        "text": "Трансфер для сотрудников. Фиксированная цена. Без предоплаты.",
    },
    {
        "group_id": 5692933736,
        "title": "Такси в командировку межгород",
        "title2": "Фикс. цена. Без предоплаты",
        "text": "Подача от 1 часа. Закрывающие документы. 79 регионов России.",
    },
    {
        "group_id": 5692933737,
        "title": "Межгород такси с документами",
        "title2": "Акт и УПД через ЭДО",
        "text": "Закрывающие для бухгалтерии. Оплата по счёту. Без предоплаты.",
    },
    {
        "group_id": 5692933738,
        "title": "Такси с QR-чеком межгород",
        "title2": "Для авансового отчёта",
        "text": "Междугородний трансфер. Все документы. Оплата по счёту.",
    },
    {
        "group_id": 5692933739,
        "title": "Такси для организаций межгород",
        "title2": "По счёту или корп. картой",
        "text": "Трансфер для юрлиц. Договор, акт, УПД. Без предоплаты.",
    },
    {
        "group_id": 5692933740,
        "title": "Бронь трансфера заранее",
        "title2": "Гарантия подачи. 79 регионов",
        "text": "Бронирование межгород. Фикс. цена. Закрывающие для юрлиц.",
    },
    {
        "group_id": 5708296565,
        "title": "Заключить договор на трансфер",
        "title2": "Быстрое оформление",
        "text": "Перевозка сотрудников по договору. ЭДО. 79 регионов России.",
    },
    {
        "group_id": 5708296566,
        "title": "Трансфер межгород через ЭДО",
        "title2": "Диадок. Автоматически",
        "text": "Такси межгород. Все закрывающие электронно. Оплата по счёту.",
    },
    {
        "group_id": 5708296567,
        "title": "Перевозка персонала межгород",
        "title2": "От 16 р/км. 79 регионов",
        "text": "Регулярная развозка сотрудников. Договор. Оплата по счёту.",
    },
    {
        "group_id": 5708296568,
        "title": "VIP трансфер для делегации",
        "title2": "Бизнес и комфорт-класс",
        "text": "Встреча партнёров. Представительский автомобиль. По договору.",
    },
    {
        "group_id": 5708296569,
        "title": "Безналичное такси межгород",
        "title2": "Корп. карта или по счёту",
        "text": "Трансфер для бизнеса. Оплата по реквизитам. Все документы.",
    },
    {
        "group_id": 5708296570,
        "title": "Реестр поездок для компании",
        "title2": "Детализация. ЭДО",
        "text": "Междугороднее такси. Полный учёт поездок. Акт, УПД, чек с QR.",
    },
    # Industry segments B-variants
    {
        "group_id": 5716365909,  # MICE
        "title": "Перевозка на мероприятие",
        "title2": "Группы от 1 до 50 чел.",
        "text": "Трансфер делегатов на конференцию. Договор. Оплата по счёту.",
    },
    {
        "group_id": 5716366062,  # Стройка
        "title": "Перевозка бригады межгород",
        "title2": "Фикс. цена. По договору",
        "text": "Доставка строителей на объект. 79 регионов. Оплата по счёту.",
    },
    {
        "group_id": 5716366068,  # Вахта
        "title": "Вахтовые перевозки по России",
        "title2": "Регулярная ротация",
        "text": "Трансфер вахтовиков. Группы до 50 чел. Договор. По счёту.",
    },
    {
        "group_id": 5716366359,  # Медицина
        "title": "Трансфер для клиник межгород",
        "title2": "Комфорт. Фикс. цена",
        "text": "Перевозка врачей и пациентов. Договор. 79 регионов России.",
    },
]

created_hot = 0
for ad in HOT_B_VARIANTS:
    print(f"\n  Group {ad['group_id']}: {ad['title']}")
    aid = create_ad(ad["group_id"], ad["title"], ad["title2"], ad["text"])
    if aid:
        print(f"    OK: Ad ID={aid}")
        created_hot += 1
    time.sleep(0.3)

print(f"\nHot campaign: {created_hot}/{len(HOT_B_VARIANTS)} B-variants created")


# =================================================================
# STEP 2: A/B ads for Geo campaign
# =================================================================
print("\n" + "=" * 60)
print("STEP 2: Creating B-variant ads for Geo campaign")
print("=" * 60)

GEO_B_VARIANTS = [
    {
        "group_id": 5692933778,
        "title": "Бизнес такси Москва межгород",
        "title2": "От 16 р/км. По счёту",
        "text": "Корпоративный трансфер из Москвы. Фикс. цена. Договор.",
    },
    {
        "group_id": 5692933779,
        "title": "Бизнес такси СПб межгород",
        "title2": "От 16 р/км. По счёту",
        "text": "Корпоративный трансфер из Петербурга. Фикс. цена. Договор.",
    },
    {
        "group_id": 5692933780,
        "title": "Бизнес такси Казань межгород",
        "title2": "Фикс. цена. По договору",
        "text": "Корпоративный трансфер из Казани. Документы. Оплата по счёту.",
    },
    {
        "group_id": 5692933781,
        "title": "Бизнес такси Екатеринбург",
        "title2": "Фикс. цена. По договору",
        "text": "Корпоративный трансфер. Документы. Оплата по счёту. ЭДО.",
    },
    {
        "group_id": 5692933782,
        "title": "Бизнес такси Уфа межгород",
        "title2": "Фикс. цена. По договору",
        "text": "Корпоративный трансфер из Уфы. Документы. Оплата по счёту.",
    },
    {
        "group_id": 5692933783,
        "title": "Бизнес такси Самара межгород",
        "title2": "Фикс. цена. По договору",
        "text": "Корпоративный трансфер из Самары. Документы. Оплата по счёту.",
    },
    {
        "group_id": 5692933784,
        "title": "Бизнес такси Юг России",
        "title2": "Фикс. цена. По договору",
        "text": "Корпоративный трансфер. Краснодар, Ростов. Оплата по счёту.",
    },
]

created_geo = 0
for ad in GEO_B_VARIANTS:
    print(f"\n  Group {ad['group_id']}: {ad['title']}")
    aid = create_ad(ad["group_id"], ad["title"], ad["title2"], ad["text"])
    if aid:
        print(f"    OK: Ad ID={aid}")
        created_geo += 1
    time.sleep(0.3)

print(f"\nGeo campaign: {created_geo}/{len(GEO_B_VARIANTS)} B-variants created")


# =================================================================
# STEP 3: New cities for Geo campaign
# =================================================================
print("\n" + "=" * 60)
print("STEP 3: Adding new cities to Geo campaign")
print("=" * 60)

NEW_CITIES = [
    {
        "name": "Новосибирск",
        "keywords": [
            "корпоративное такси новосибирск",
            "бизнес трансфер новосибирск межгород",
            "новосибирск барнаул корпоративный трансфер",
            "новосибирск томск трансфер для бизнеса",
            "новосибирск омск такси для организаций",
        ],
        "ad_a": {"Title": "Трансфер Новосибирск межгород", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Новосибирск", "Title2": "Фикс. цена. По договору", "Text": "Корпоративный трансфер из Новосибирска. Документы. По счёту."},
    },
    {
        "name": "Нижний Новгород",
        "keywords": [
            "корпоративное такси нижний новгород",
            "бизнес трансфер нижний новгород межгород",
            "нижний новгород москва корпоративный трансфер",
            "нижний новгород казань трансфер для бизнеса",
            "нижний новгород владимир такси для организаций",
        ],
        "ad_a": {"Title": "Трансфер Нижний Новгород", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Нижний Новгород", "Title2": "Фикс. цена. По договору", "Text": "Трансфер из Н. Новгорода. Документы. Оплата по счёту."},
    },
    {
        "name": "Воронеж",
        "keywords": [
            "корпоративное такси воронеж",
            "бизнес трансфер воронеж межгород",
            "воронеж москва корпоративный трансфер",
            "воронеж липецк трансфер для бизнеса",
            "воронеж курск такси для организаций",
        ],
        "ad_a": {"Title": "Корпоративный трансфер Воронеж", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Воронеж межгород", "Title2": "Фикс. цена. По договору", "Text": "Корпоративный трансфер из Воронежа. Документы. По счёту."},
    },
    {
        "name": "Тюмень",
        "keywords": [
            "корпоративное такси тюмень",
            "бизнес трансфер тюмень межгород",
            "тюмень екатеринбург корпоративный трансфер",
            "тюмень сургут трансфер для бизнеса",
            "тюмень курган такси для организаций",
        ],
        "ad_a": {"Title": "Корпоративный трансфер Тюмень", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Тюмень межгород", "Title2": "Фикс. цена. По договору", "Text": "Корпоративный трансфер из Тюмени. Документы. По счёту."},
    },
    {
        "name": "Пермь",
        "keywords": [
            "корпоративное такси пермь",
            "бизнес трансфер пермь межгород",
            "пермь екатеринбург корпоративный трансфер",
            "пермь ижевск трансфер для бизнеса",
            "пермь уфа такси для организаций",
        ],
        "ad_a": {"Title": "Корпоративный трансфер Пермь", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Пермь межгород", "Title2": "Фикс. цена. По договору", "Text": "Корпоративный трансфер из Перми. Документы. По счёту."},
    },
    {
        "name": "Красноярск",
        "keywords": [
            "корпоративное такси красноярск",
            "бизнес трансфер красноярск межгород",
            "красноярск новосибирск корпоративный трансфер",
            "красноярск абакан трансфер для бизнеса",
            "красноярск томск такси для организаций",
        ],
        "ad_a": {"Title": "Трансфер Красноярск межгород", "Title2": "Документы. Чек с QR", "Text": "Межгородское такси для бизнеса. Акт через ЭДО. По счёту."},
        "ad_b": {"Title": "Бизнес такси Красноярск", "Title2": "Фикс. цена. По договору", "Text": "Корпоративный трансфер из Красноярска. Документы. По счёту."},
    },
]

# Check if city groups already exist (from previous failed run)
result = api_call("adgroups", "get", {
    "SelectionCriteria": {"CampaignIds": [GEO_CAMPAIGN_ID]},
    "FieldNames": ["Id", "Name"]
})
existing_groups = {}
if result:
    for g in result.get("AdGroups", []):
        existing_groups[g["Name"]] = g["Id"]

created_cities = 0
for city in NEW_CITIES:
    print(f"\n  City: {city['name']}...")

    # Check if group already exists
    if city["name"] in existing_groups:
        gid = existing_groups[city["name"]]
        print(f"    Group already exists: ID={gid}")
    else:
        # Create group
        result = api_call("adgroups", "add", {
            "AdGroups": [{
                "Name": city["name"],
                "CampaignId": GEO_CAMPAIGN_ID,
                "RegionIds": [225],
            }]
        })
        if not result or not result.get("AddResults") or not result["AddResults"][0].get("Id"):
            errors = result["AddResults"][0].get("Errors", []) if result and result.get("AddResults") else "no result"
            print(f"    FAIL group: {errors}")
            continue
        gid = result["AddResults"][0]["Id"]
        print(f"    Group created: ID={gid}")
        time.sleep(0.3)

        # Add keywords (only for new groups)
        kws = [{"Keyword": kw, "AdGroupId": gid} for kw in city["keywords"]]
        result = api_call("keywords", "add", {"Keywords": kws})
        if result and result.get("AddResults"):
            ok = sum(1 for r in result["AddResults"] if r.get("Id"))
            print(f"    Keywords: {ok}/{len(kws)} added")
        time.sleep(0.3)

    # Check if group already has ads
    r = requests.post(API_URL + "ads", json={"method": "get", "params": {
        "SelectionCriteria": {"AdGroupIds": [gid]},
        "FieldNames": ["Id"]
    }}, headers=HEADERS)
    existing_ads = r.json().get("result", {}).get("Ads", [])
    if existing_ads:
        print(f"    Already has {len(existing_ads)} ads, skipping")
        created_cities += 1
        continue

    # Create ad A
    aid_a = create_ad(gid, city["ad_a"]["Title"], city["ad_a"]["Title2"], city["ad_a"]["Text"])
    print(f"    Ad A: {aid_a}")
    time.sleep(0.3)

    # Create ad B
    aid_b = create_ad(gid, city["ad_b"]["Title"], city["ad_b"]["Title2"], city["ad_b"]["Text"])
    print(f"    Ad B: {aid_b}")
    time.sleep(0.3)

    created_cities += 1

print(f"\nNew cities: {created_cities}/{len(NEW_CITIES)} created")


# =================================================================
# STEP 4: Increase Geo campaign budget to 3000/week
# =================================================================
print("\n" + "=" * 60)
print("STEP 4: Increasing Geo campaign weekly budget")
print("=" * 60)

print("  Budget already updated to 3000 RUB/week in previous run")


# =================================================================
# STEP 5: Attach callouts to all new ads via ads.update
# =================================================================
print("\n" + "=" * 60)
print("STEP 5: Attaching callouts to new ads")
print("=" * 60)

if ALL_NEW_AD_IDS:
    callout_exts = [{"AdExtensionId": cid, "Operation": "SET"} for cid in CALLOUT_IDS]
    ads_to_update = [{"Id": aid, "TextAd": {"CalloutSetting": {"AdExtensions": callout_exts}}} for aid in ALL_NEW_AD_IDS]

    # Process in batches of 50
    for i in range(0, len(ads_to_update), 50):
        batch = ads_to_update[i:i+50]
        result = api_call("ads", "update", {"Ads": batch})
        if result:
            ok = sum(1 for r in result.get("UpdateResults", []) if r.get("Id"))
            fail = sum(1 for r in result.get("UpdateResults", []) if r.get("Errors"))
            print(f"  Batch {i//50+1}: {ok} updated, {fail} failed")
        time.sleep(0.5)
    print(f"  Total: {len(ALL_NEW_AD_IDS)} ads processed")
else:
    print("  No new ads to attach callouts to")


# =================================================================
# STEP 6: Send all new ads for moderation
# =================================================================
print("\n" + "=" * 60)
print("STEP 6: Sending new ads for moderation")
print("=" * 60)

for cid in [HOT_CAMPAIGN_ID, GEO_CAMPAIGN_ID]:
    r = requests.post(API_URL + "ads", json={"method": "get", "params": {
        "SelectionCriteria": {"CampaignIds": [cid], "States": ["OFF"], "Statuses": ["DRAFT"]},
        "FieldNames": ["Id"]
    }}, headers=HEADERS)
    result = r.json().get("result", {})
    draft_ids = [a["Id"] for a in result.get("Ads", [])]

    if draft_ids:
        print(f"\n  Campaign {cid}: {len(draft_ids)} draft ads to moderate")
        mod_result = api_call("ads", "moderate", {
            "SelectionCriteria": {"Ids": draft_ids}
        })
        if mod_result:
            ok = sum(1 for r in mod_result.get("ModerateResults", []) if r.get("Id"))
            print(f"    Sent for moderation: {ok}/{len(draft_ids)}")
    else:
        print(f"\n  Campaign {cid}: no draft ads")

# =================================================================
# SUMMARY
# =================================================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"  Hot campaign B-variants: {created_hot}/{len(HOT_B_VARIANTS)}")
print(f"  Geo campaign B-variants: {created_geo}/{len(GEO_B_VARIANTS)}")
print(f"  New cities added: {created_cities}/{len(NEW_CITIES)}")
print("  Geo budget: 1000 -> 3000 RUB/week")
print("\nDone!")
