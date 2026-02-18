#!/usr/bin/env python3
"""
Update B2B search campaigns:
1. Move negative keywords to campaign level + add missing ones
2. Add industry segment groups (MICE, Construction, Shift workers, Medicine)
   with keywords and ads to B2B\Hot campaign (705839254)
"""
import sys
sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
import requests
import json
import time

HEADERS = {"Authorization": "Bearer " + OAUTH_TOKEN, "Accept-Language": "ru"}
API_URL = "https://api.direct.yandex.com/json/v5/"

HOT_CAMPAIGN_ID = 705839254
GEO_CAMPAIGN_ID = 705839266

# B2B landing page
B2B_HREF = "https://city2city.ru/dlya-biznesa?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_id}&utm_term={keyword}"


def api_call(service, method, params):
    """Make API call and return result."""
    r = requests.post(
        API_URL + service,
        json={"method": method, "params": params},
        headers=HEADERS
    )
    data = r.json()
    if "error" in data:
        print(f"  ERROR [{service}.{method}]: {data['error']}")
        return None
    return data.get("result", {})


# =============================================================================
# STEP 1: Set negative keywords at CAMPAIGN level
# =============================================================================
print("=" * 60)
print("STEP 1: Setting campaign-level negative keywords")
print("=" * 60)

# Comprehensive B2B negative keywords list
NEGATIVE_KEYWORDS = [
    # Competitors
    "blablacar", "gett", "ситимобил", "убер", "яндекс такси", "максим",
    "делимобиль", "яндекс драйв", "kiwi taxi", "kiwi", "gettransfer",
    "intui travel", "wheely", "яндекс go",
    # Non-relevant transport
    "автобус", "жд", "поезд", "электричка", "газель", "фура", "маршрутка",
    "эвакуатор", "самолет", "авиа", "паром", "метро",
    # Employment / education
    "вакансия", "зарплата", "работа", "подработка", "устроиться", "резюме",
    "требуется", "обучение", "курсы", "автошкола", "стажировка", "hh",
    # Tourism / personal
    "отдых", "туризм", "экскурсия", "отпуск", "море", "свадьба", "похороны",
    "роддом", "детское кресло", "животные", "кошка", "собака", "переезд",
    "горнолыжка", "санаторий", "путевка",
    # Cheap / free
    "бесплатно", "дешево", "недорого", "эконом", "акция", "промокод",
    # Digital / apps
    "скачать", "приложение", "отзывы", "рейтинг", "форум", "википедия",
    # Other non-B2B
    "аренда", "аэропорт", "билет", "блаблакар", "водитель", "вокзал",
    "грузовой", "грузоперевозки", "грузчики", "подвезти", "попутка",
    "попутчик", "прокат", "расписание",
    # Extra B2B filters
    "каршеринг", "мотоцикл", "велосипед", "самокат", "лимузин",
    "катафалк", "ритуальный", "скорая",
]

# Deduplicate
NEGATIVE_KEYWORDS = sorted(set(NEGATIVE_KEYWORDS))
print(f"Total unique negative keywords: {len(NEGATIVE_KEYWORDS)}")

for cid in [HOT_CAMPAIGN_ID, GEO_CAMPAIGN_ID]:
    print(f"\nSetting negatives for campaign {cid}...")
    result = api_call("campaigns", "update", {
        "Campaigns": [{
            "Id": cid,
            "NegativeKeywords": {"Items": NEGATIVE_KEYWORDS}
        }]
    })
    if result:
        print(f"  SUCCESS: {len(NEGATIVE_KEYWORDS)} negative keywords set on campaign {cid}")
    time.sleep(1)


# =============================================================================
# STEP 2: Add industry segment groups to B2B\Hot campaign
# =============================================================================
print("\n" + "=" * 60)
print("STEP 2: Creating industry segment ad groups")
print("=" * 60)

INDUSTRY_SEGMENTS = [
    {
        "name": "MICE / Ивент / Конференции",
        "keywords": [
            "трансфер на конференцию",
            "трансфер для участников мероприятия",
            "перевозка участников конференции",
            "трансфер на выставку для сотрудников",
            "корпоративный трансфер на мероприятие",
            "трансфер на форум для делегатов",
            "автобус на конференцию для компании",
            "перевозка гостей мероприятия межгород",
            "трансфер на корпоратив межгород",
            "организация трансфера на семинар",
        ],
        "ad": {
            "Title": "Трансфер на конференцию",
            "Title2": "Договор. ЭДО. Чек с QR",
            "Text": "Доставим делегатов на мероприятие. Оплата по счёту. 79 регионов.",
        }
    },
    {
        "name": "Строительство / Стройка",
        "keywords": [
            "доставка бригады на объект межгород",
            "перевозка строителей межгород",
            "трансфер строительной бригады",
            "такси для строителей на объект",
            "перевозка рабочих на стройку межгород",
            "доставка рабочих на строительный объект",
            "транспорт для строительной компании",
            "корпоративный трансфер на стройку",
            "перевозка монтажников межгород",
            "доставка бригады на вахту",
        ],
        "ad": {
            "Title": "Доставка бригады на объект",
            "Title2": "От 16 ₽/км. Документы",
            "Text": "Перевозка строителей межгород. Договор, акт, УПД. Оплата по счёту.",
        }
    },
    {
        "name": "Вахта / Вахтовые перевозки",
        "keywords": [
            "вахтовая перевозка межгород",
            "трансфер вахтовиков",
            "перевозка вахтовых бригад",
            "доставка вахтовиков на объект",
            "такси для вахтовых работников",
            "перевозка персонала на вахту",
            "трансфер на вахту межгород",
            "ротация вахтовиков перевозка",
            "регулярная перевозка вахтовиков",
            "корпоративная перевозка на вахту",
        ],
        "ad": {
            "Title": "Перевозка вахтовиков межгород",
            "Title2": "Договор. Регулярные рейсы",
            "Text": "Вахтовые перевозки по всей России. Группы 1-50 чел. Оплата по счёту.",
        }
    },
    {
        "name": "Медицина / Фарма",
        "keywords": [
            "медицинский трансфер межгород",
            "перевозка пациентов межгород",
            "трансфер для медицинского персонала",
            "перевозка врачей между городами",
            "транспорт для фармкомпании",
            "перевозка медработников на объект",
            "корпоративный трансфер клиника",
            "трансфер в клинику межгород",
            "доставка медперсонала межгород",
            "перевозка сотрудников больницы",
        ],
        "ad": {
            "Title": "Медицинский трансфер межгород",
            "Title2": "Комфорт. Документы. ЭДО",
            "Text": "Перевозка медперсонала и пациентов. Фикс. цена. Договор для клиники.",
        }
    },
]

# Create ad groups
new_groups = []
for seg in INDUSTRY_SEGMENTS:
    print(f"\nCreating group: {seg['name']}...")
    result = api_call("adgroups", "add", {
        "AdGroups": [{
            "Name": seg["name"],
            "CampaignId": HOT_CAMPAIGN_ID,
            "RegionIds": [225],  # All Russia
            "TextAdGroupFeedParams": None,
        }]
    })
    if result and result.get("AddResults"):
        gid = result["AddResults"][0].get("Id")
        if gid:
            print(f"  SUCCESS: Group created, ID = {gid}")
            new_groups.append({"id": gid, "segment": seg})
        else:
            errors = result["AddResults"][0].get("Errors", [])
            print(f"  FAILED: {errors}")
    time.sleep(0.5)


# =============================================================================
# STEP 3: Add keywords to new groups
# =============================================================================
print("\n" + "=" * 60)
print("STEP 3: Adding keywords to new groups")
print("=" * 60)

for grp in new_groups:
    gid = grp["id"]
    seg = grp["segment"]
    keywords_to_add = [{"Keyword": kw, "AdGroupId": gid} for kw in seg["keywords"]]

    print(f"\nAdding {len(keywords_to_add)} keywords to group {gid} ({seg['name']})...")
    result = api_call("keywords", "add", {"Keywords": keywords_to_add})
    if result and result.get("AddResults"):
        ok = sum(1 for r in result["AddResults"] if r.get("Id"))
        fail = sum(1 for r in result["AddResults"] if r.get("Errors"))
        print(f"  SUCCESS: {ok} added, {fail} failed")
        if fail > 0:
            for r in result["AddResults"]:
                if r.get("Errors"):
                    print(f"    Error: {r['Errors']}")
    time.sleep(0.5)


# =============================================================================
# STEP 4: Create ads for new groups
# =============================================================================
print("\n" + "=" * 60)
print("STEP 4: Creating ads for new groups")
print("=" * 60)

for grp in new_groups:
    gid = grp["id"]
    seg = grp["segment"]
    ad_data = seg["ad"]

    # Validate lengths
    t1 = ad_data["Title"]
    t2 = ad_data["Title2"]
    txt = ad_data["Text"]
    print(f"\n  Group {gid} ({seg['name']}):")
    print(f"    Title ({len(t1)} chars): {t1}")
    print(f"    Title2 ({len(t2)} chars): {t2}")
    print(f"    Text ({len(txt)} chars): {txt}")

    assert len(t1) <= 56, f"Title too long: {len(t1)}"
    assert len(t2) <= 30, f"Title2 too long: {len(t2)}"
    assert len(txt) <= 81, f"Text too long: {len(txt)}"

    result = api_call("ads", "add", {
        "Ads": [{
            "AdGroupId": gid,
            "TextAd": {
                "Title": t1,
                "Title2": t2,
                "Text": txt,
                "Href": B2B_HREF,
                "Mobile": "NO",
            }
        }]
    })
    if result and result.get("AddResults"):
        aid = result["AddResults"][0].get("Id")
        if aid:
            print(f"    SUCCESS: Ad created, ID = {aid}")
        else:
            errors = result["AddResults"][0].get("Errors", [])
            print(f"    FAILED: {errors}")
    time.sleep(0.5)


# =============================================================================
# SUMMARY
# =============================================================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Campaign-level negative keywords: {len(NEGATIVE_KEYWORDS)} set on both campaigns")
print(f"New industry segment groups created: {len(new_groups)}")
for grp in new_groups:
    print(f"  - {grp['id']}: {grp['segment']['name']} ({len(grp['segment']['keywords'])} keywords)")
print("\nDone!")
