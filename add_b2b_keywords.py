# -*- coding: utf-8 -*-
"""
Добавление новых B2B ключевых слов и групп объявлений
"""

import requests
import json
import time
from yandex_direct_api import YandexDirectAPI

api = YandexDirectAPI()

CAMPAIGN_HOT = 705839254  # B2B\Горячие
LANDING_URL = "https://city2city.ru/dlya-biznesa"

# ========================================
# 1. СОЗДАЁМ НОВЫЕ ГРУППЫ ОБЪЯВЛЕНИЙ
# ========================================
print("=" * 60)
print("1. СОЗДАНИЕ ГРУПП ОБЪЯВЛЕНИЙ")
print("=" * 60)

new_groups = [
    {"Name": "Договор / Закупка", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
    {"Name": "ЭДО / Электронный документооборот", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
    {"Name": "Развозка / Служебный транспорт", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
    {"Name": "Встреча делегаций / VIP", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
    {"Name": "Безнал / Постоплата", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
    {"Name": "Учёт / Отчётность", "CampaignId": CAMPAIGN_HOT, "RegionIds": [225]},
]

body = {
    "method": "add",
    "params": {
        "AdGroups": new_groups
    }
}
url = api.base_url + "adgroups"
resp = requests.post(url, headers=api.headers, json=body)
result = resp.json()

group_ids = {}
group_names = [g["Name"] for g in new_groups]

if "error" in result:
    print(f"  ОШИБКА: {json.dumps(result['error'], ensure_ascii=False)}")
else:
    add_results = result.get("result", {}).get("AddResults", [])
    for i, r in enumerate(add_results):
        if "Id" in r:
            gid = r["Id"]
            name = group_names[i]
            group_ids[name] = gid
            print(f"  ✓ {name}: ID {gid}")
        elif "Errors" in r:
            print(f"  ✗ {group_names[i]}: {json.dumps(r['Errors'], ensure_ascii=False)}")

if not group_ids:
    print("Группы не созданы, выходим")
    exit(1)

print(f"\n  Создано групп: {len(group_ids)}")
time.sleep(2)  # Пауза для применения

# ========================================
# 2. СОЗДАЁМ ОБЪЯВЛЕНИЯ ДЛЯ КАЖДОЙ ГРУППЫ
# ========================================
print()
print("=" * 60)
print("2. СОЗДАНИЕ ОБЪЯВЛЕНИЙ")
print("=" * 60)

ads_data = {
    "Договор / Закупка": {
        "Title": "Трансфер межгород по договору",
        "Title2": "Акт, УПД, Чек с QR",
        "Text": "Заключаем договор. Оплата по счёту. Закрывающие через ЭДО."
    },
    "ЭДО / Электронный документооборот": {
        "Title": "Такси межгород с ЭДО",
        "Title2": "Акт, УПД автоматически",
        "Text": "Электронный документооборот. Закрывающие без бумаг. По счёту."
    },
    "Развозка / Служебный транспорт": {
        "Title": "Развозка сотрудников межгород",
        "Title2": "Договор. Документы. ЭДО",
        "Text": "Служебные перевозки персонала между городами. Оплата по счёту."
    },
    "Встреча делегаций / VIP": {
        "Title": "Трансфер для делегаций",
        "Title2": "Бизнес-класс. Документы",
        "Text": "Встреча гостей и партнёров. Представительский класс. По счёту."
    },
    "Безнал / Постоплата": {
        "Title": "Такси межгород по безналу",
        "Title2": "По счёту. Акт. ЭДО",
        "Text": "Оплата по реквизитам, корп. картой. Закрывающие через ЭДО."
    },
    "Учёт / Отчётность": {
        "Title": "Такси с отчётом для юрлиц",
        "Title2": "Реестр поездок. ЭДО",
        "Text": "Детализация и реестр всех поездок. Акт, УПД. Чек с QR."
    },
}

ads_to_create = []
for group_name, gid in group_ids.items():
    ad_info = ads_data.get(group_name)
    if ad_info:
        ads_to_create.append({
            "AdGroupId": gid,
            "TextAd": {
                "Title": ad_info["Title"],
                "Title2": ad_info["Title2"],
                "Text": ad_info["Text"],
                "Href": LANDING_URL,
            }
        })

body = {
    "method": "add",
    "params": {
        "Ads": ads_to_create
    }
}
url = api.base_url + "ads"
resp = requests.post(url, headers=api.headers, json=body)
result = resp.json()

if "error" in result:
    print(f"  ОШИБКА: {json.dumps(result['error'], ensure_ascii=False)}")
else:
    add_results = result.get("result", {}).get("AddResults", [])
    created = sum(1 for r in add_results if "Id" in r)
    errors = [r for r in add_results if "Errors" in r]
    print(f"  Создано объявлений: {created}")
    for e in errors:
        print(f"  Ошибка: {json.dumps(e['Errors'], ensure_ascii=False)}")

    # Отправляем на модерацию
    ad_ids = [r["Id"] for r in add_results if "Id" in r]
    if ad_ids:
        try:
            api.moderate_ads(ad_ids)
            print(f"  Отправлено на модерацию: {len(ad_ids)}")
        except Exception as e:
            print(f"  Ошибка модерации: {e}")

time.sleep(2)

# ========================================
# 3. ДОБАВЛЯЕМ КЛЮЧЕВЫЕ СЛОВА
# ========================================
print()
print("=" * 60)
print("3. ДОБАВЛЕНИЕ КЛЮЧЕВЫХ СЛОВ")
print("=" * 60)

keywords_by_group = {
    "Договор / Закупка": [
        "заключить договор на такси межгород",
        "договор на перевозку сотрудников",
        "такси по договору для организаций",
        "договор на корпоративный трансфер",
        "тендер на перевозку сотрудников",
        "закупка услуг такси для организации",
        "поставщик транспортных услуг межгород",
    ],
    "ЭДО / Электронный документооборот": [
        "такси с ЭДО",
        "трансфер электронный документооборот",
        "такси с электронным актом",
        "междугороднее такси с УПД",
        "такси с актом сверки",
    ],
    "Развозка / Служебный транспорт": [
        "развозка сотрудников междугородняя",
        "служебный трансфер для сотрудников",
        "перевозка персонала между городами",
        "доставка сотрудников на объект межгород",
        "транспорт для вахтовиков межгород",
        "регулярные перевозки сотрудников",
    ],
    "Встреча делегаций / VIP": [
        "встреча делегации трансфер",
        "трансфер для деловой поездки",
        "представительский трансфер межгород",
        "такси для встречи партнёров",
        "трансфер для иностранной делегации",
    ],
    "Безнал / Постоплата": [
        "такси по безналу межгород",
        "трансфер с постоплатой для юрлиц",
        "такси по корпоративной карте межгород",
        "такси с выставлением счёта",
        "трансфер оплата по реквизитам",
    ],
    "Учёт / Отчётность": [
        "реестр поездок такси для организации",
        "такси с детализацией для юрлиц",
        "учёт командировочных расходов такси",
        "такси с отчётом по поездкам",
    ],
}

# Также добавляем ключи в существующие группы
existing_group_keywords = {
    # Группа "Закрывающие документы" (5692933737)
    5692933737: [
        "такси с ЭДО для юрлиц",
    ],
    # Группа "Бронирование" (5692933740) — переиспользуем, бывшие B2C ключи удалены
    5692933740: [
        "такси по договору межгород",
        "междугороднее такси по договору",
    ],
}

total_added = 0

# Новые группы
for group_name, kw_list in keywords_by_group.items():
    gid = group_ids.get(group_name)
    if not gid:
        print(f"  ⚠ Группа '{group_name}' не найдена, пропускаем")
        continue

    kw_items = [{"Keyword": kw, "AdGroupId": gid} for kw in kw_list]

    body = {
        "method": "add",
        "params": {
            "Keywords": kw_items
        }
    }
    url_kw = api.base_url + "keywords"
    resp = requests.post(url_kw, headers=api.headers, json=body)
    result = resp.json()

    if "error" in result:
        print(f"  {group_name}: ОШИБКА - {json.dumps(result['error'], ensure_ascii=False)}")
    else:
        add_results = result.get("result", {}).get("AddResults", [])
        created = sum(1 for r in add_results if "Id" in r)
        total_added += created
        print(f"  ✓ {group_name}: добавлено {created}/{len(kw_list)} ключей")
        for r in add_results:
            if "Errors" in r:
                print(f"    Ошибка: {json.dumps(r['Errors'], ensure_ascii=False)}")

# Существующие группы
for gid, kw_list in existing_group_keywords.items():
    kw_items = [{"Keyword": kw, "AdGroupId": gid} for kw in kw_list]

    body = {
        "method": "add",
        "params": {
            "Keywords": kw_items
        }
    }
    url_kw = api.base_url + "keywords"
    resp = requests.post(url_kw, headers=api.headers, json=body)
    result = resp.json()

    if "error" in result:
        print(f"  Группа {gid}: ОШИБКА - {json.dumps(result['error'], ensure_ascii=False)}")
    else:
        add_results = result.get("result", {}).get("AddResults", [])
        created = sum(1 for r in add_results if "Id" in r)
        total_added += created
        print(f"  ✓ Группа {gid}: добавлено {created}/{len(kw_list)} ключей")

# ========================================
# ИТОГО
# ========================================
print()
print("=" * 60)
print("ИТОГО")
print("=" * 60)
print(f"  Новых групп: {len(group_ids)}")
print(f"  Новых объявлений: {len(ads_to_create)}")
print(f"  Новых ключей: {total_added}")
print(f"  Удалено B2C ключей: 4 (ранее)")
print()
print("  Новые группы:")
for name, gid in group_ids.items():
    kw_count = len(keywords_by_group.get(name, []))
    print(f"    {name}: {kw_count} ключей (ID: {gid})")
print("=" * 60)
