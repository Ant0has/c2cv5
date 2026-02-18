"""
Upload ALL text-overlay banners to Yandex Direct RSYa campaign.
- Uploads 36 images (18 creatives x wide + square)
- Adds ads to existing 3 groups (series 1, 2, 4)
- Creates 3 new groups + ads (series 3, 5, 6)
Campaign: 706808352
"""
import json
import requests
import base64
import os
import sys
import time

sys.path.insert(0, "/home/anton-furs/yandex-direct-bot")
from config import OAUTH_TOKEN
TOKEN = OAUTH_TOKEN

API_URL = 'https://api.direct.yandex.com/json/v5/'
HEADERS = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json',
    'Accept-Language': 'ru'
}

CAMPAIGN_ID = 706808352
CREATIVES_DIR = '/home/anton-furs/yandex-direct-bot/creatives_all_text/'
LANDING = 'https://city2city.ru/dlya-biznesa'
UTM = '?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_id}&utm_term={keyword}'
HREF = LANDING + UTM

# Audience target
RETARGETING_LIST_ID = 38098389  # MAX look-alike
CONTEXT_BID = 300000  # 0.30 RUB in micros

# Existing ad groups
EXISTING_GROUPS = {
    'series1': 5708852960,  # Корпоративный трансфер
    'series2': 5708852959,  # Документы и отчетность
    'series4': 5708852961,  # Договор и оплата по счету
}

# Image files to upload: (series, creative_num, size, filename)
# Only wide (1920x1080) and square (1080x1080)
IMAGE_MAP = {
    # Series 1
    's1_1.2_wide': 'СЕРИЯ 1 «Гарантия подачи»/1.2 Flat lay_1920x1080.png',
    's1_1.2_sq':   'СЕРИЯ 1 «Гарантия подачи»/1.2 Flat lay_1080x1080.png',
    's1_1.3_wide': 'СЕРИЯ 1 «Гарантия подачи»/1.3 Водитель ждёт у офиса_1920x1080.png',
    's1_1.3_sq':   'СЕРИЯ 1 «Гарантия подачи»/1.3 Водитель ждёт у офиса_1080x1080.png',
    's1_1.1_wide': 'СЕРИЯ 1 «Гарантия подачи»/1_1_contrast_1920x1080.png',
    's1_1.1_sq':   'СЕРИЯ 1 «Гарантия подачи»/1_1_contrast_1080x1080.png',
    # Series 2
    's2_2.1_wide': 'СЕРИЯ 2«Документы для бухгалтерии»/2.1 Чек с QR-кодом 1920x1080.png',
    's2_2.1_sq':   'СЕРИЯ 2«Документы для бухгалтерии»/2.1 Чек с QR-кодом 1080x1080.png',
    's2_2.2_wide': 'СЕРИЯ 2«Документы для бухгалтерии»/2.2 Инфографика три шага 1920x1080.png',
    's2_2.2_sq':   'СЕРИЯ 2«Документы для бухгалтерии»/2.2 Инфографика три шага 1080x1080.png',
    's2_2.3_wide': 'СЕРИЯ 2«Документы для бухгалтерии»/2.3 Порядок на столе бухгалтера 1920x1080.png',
    's2_2.3_sq':   'СЕРИЯ 2«Документы для бухгалтерии»/2.3 Порядок на столе бухгалтера 1080x1080.png',
    # Series 3
    's3_3.1_wide': 'СЕРИЯ 3 «Фиксированная цена»/3.1 Замок на ценнике 1920x1080.png.png',
    's3_3.1_sq':   'СЕРИЯ 3 «Фиксированная цена»/3.1 Замок на ценнике 1080x1080.png',
    's3_3.2_wide': 'СЕРИЯ 3 «Фиксированная цена»/3.2 Контраст хаос цен vs. стабильность 1920x1080.png',
    's3_3.2_sq':   'СЕРИЯ 3 «Фиксированная цена»/3.2 Контраст хаос цен vs. стабильность 1080x1080.png',
    's3_3.3_wide': 'СЕРИЯ 3 «Фиксированная цена»/3.3 Калькулятор маршрута в руках 1920x1080.png',
    's3_3.3_sq':   'СЕРИЯ 3 «Фиксированная цена»/3.3 Калькулятор маршрута в руках 1080x1080 .png',
    # Series 4
    's4_4.1_wide': 'СЕРИЯ 4 «Персонажи _ роли»/4.1 Офис-менеджер бронирует трансфер 1920x1080.png',
    's4_4.1_sq':   'СЕРИЯ 4 «Персонажи _ роли»/4.1 Офис-менеджер бронирует трансфер 1080x1080.png',
    's4_4.2_wide': 'СЕРИЯ 4 «Персонажи _ роли»/4.2 HR встречает кандидата 1920x1080.png',
    's4_4.2_sq':   'СЕРИЯ 4 «Персонажи _ роли»/4.2 HR встречает кандидата 1080x1080.png',
    's4_4.3_wide': 'СЕРИЯ 4 «Персонажи _ роли»/4.3 Руководитель работает в пути 1920x1080.png',
    's4_4.3_sq':   'СЕРИЯ 4 «Персонажи _ роли»/4.3 Руководитель работает в пути 1080x1080.png',
    # Series 5
    's5_5.1_wide': 'СЕРИЯ 5 «География и масштаб»/5.1 Карта маршрутов России 1920x1080.png',
    's5_5.1_sq':   'СЕРИЯ 5 «География и масштаб»/5.1 Карта маршрутов России 1080x1080.png',
    's5_5.2_wide': 'СЕРИЯ 5 «География и масштаб»/5.2 Триптих утро — дорога — прибытие 1920x1080.png',
    's5_5.2_sq':   'СЕРИЯ 5 «География и масштаб»/5.2 Триптих утро — дорога — прибытие 1080x1080.png',
    's5_5.3_wide': 'СЕРИЯ 5 «География и масштаб»/5.3 Дорога между городами — вид из окна 1920x1080.png',
    's5_5.3_sq':   'СЕРИЯ 5 «География и масштаб»/5.3 Дорога между городами — вид из окна 1080x1080.png',
    # Series 6
    's6_6.1_wide': 'СЕРИЯ 6 «Ретаргетинг»/6.1 Одинокий седан на синем фоне 1920x1080.png',
    's6_6.1_sq':   'СЕРИЯ 6 «Ретаргетинг»/6.1 Одинокий седан на синем фоне 1080x1080.png',
    's6_6.2_wide': 'СЕРИЯ 6 «Ретаргетинг»/6.2 Премиальный фон для спецпредложения 1920x1080.png',
    's6_6.2_sq':   'СЕРИЯ 6 «Ретаргетинг»/6.2 Премиальный фон для спецпредложения 1080x1080.png',
    's6_6.3_wide': 'СЕРИЯ 6 «Ретаргетинг»/6.3 Абстрактный корпоративный фон 1920x1080.png',
    's6_6.3_sq':   'СЕРИЯ 6 «Ретаргетинг»/6.3 Абстрактный корпоративный фон 1080x1080.png',
}

# Ad copy templates per group
AD_COPY = {
    'series1': [
        {'Title': 'Корпоративный трансфер межгород', 'Title2': 'Оплата по счёту. Договор. НДС', 'Text': 'Водитель подан вовремя. Закрывающие документы. Фиксированная цена без скрытых платежей.'},
        {'Title': 'Трансфер для сотрудников', 'Title2': 'Гарантия подачи и комфорта', 'Text': 'Перевозка сотрудников между городами. Договор, акт, счёт. Оплата по безналу.'},
        {'Title': 'Межгород для бизнеса. Договор', 'Title2': 'Водитель ждёт. Фикс. цена', 'Text': 'Корпоративные перевозки по всей России. Постоплата, закрывающие, ЭДО.'},
    ],
    'series2': [
        {'Title': 'Такси с закрывающими для юрлиц', 'Title2': 'Счёт, акт, УПД — автоматически', 'Text': 'Трансфер между городами с полным пакетом документов для бухгалтерии. Оплата по счёту.'},
        {'Title': 'Закрывающие документы. ЭДО', 'Title2': 'Счёт + акт + УПД за каждую поездку', 'Text': 'Межгород для бизнеса. Все документы в личном кабинете. Договор, постоплата.'},
        {'Title': 'Документы для бухгалтерии', 'Title2': 'Трансфер с отчётностью для юрлиц', 'Text': 'Закрывающие по каждой поездке. УПД, акт, счёт. Электронный документооборот.'},
    ],
    'series3': [
        {'Title': 'Фиксированная цена на трансфер', 'Title2': 'Без скрытых платежей. Договор', 'Text': 'Цена известна заранее и не меняется. Оплата по счёту для юрлиц. Закрывающие документы.'},
        {'Title': 'Трансфер по фиксу. Для бизнеса', 'Title2': 'Оплата по безналу. НДС', 'Text': 'Никаких сюрпризов: фиксированная стоимость поездки. Договор, акт, счёт.'},
        {'Title': 'Цена не изменится. Межгород', 'Title2': 'Фикс. тариф для корпоративных', 'Text': 'Фиксированная цена при бронировании. Закрывающие документы, оплата по счёту.'},
    ],
    'series4': [
        {'Title': 'Трансфер для бизнеса по договору', 'Title2': 'Постоплата. Закрывающие. НДС', 'Text': 'Корпоративный межгород с полным документооборотом. Оплата по счёту для юрлиц.'},
        {'Title': 'Такси межгород по безналу', 'Title2': 'Договор и акт на каждую поездку', 'Text': 'Перевозка сотрудников и гостей между городами. Фиксированная цена, все документы.'},
        {'Title': 'Бизнес-трансфер. Оплата по счёту', 'Title2': 'Для офис-менеджеров и HR', 'Text': 'Бронируйте трансфер онлайн. Договор, постоплата, закрывающие документы.'},
    ],
    'series5': [
        {'Title': 'Трансфер по всей России', 'Title2': 'Для бизнеса. Договор и счёт', 'Text': 'Межгородские перевозки для корпоративных клиентов. Фиксированная цена, закрывающие.'},
        {'Title': 'Межгород для бизнеса. Вся РФ', 'Title2': 'Оплата по счёту. Договор. НДС', 'Text': 'Корпоративный трансфер между городами России. Документы, постоплата, ЭДО.'},
        {'Title': 'Корпоративные перевозки. Межгород', 'Title2': 'Москва, регионы — вся Россия', 'Text': 'Бизнес-трансфер по всей России. Фиксированная цена, договор, закрывающие.'},
    ],
    'series6': [
        {'Title': 'Корпоративный трансфер. Договор', 'Title2': 'Оплата по счёту для юрлиц', 'Text': 'Надёжный межгород для бизнеса. НДС, закрывающие, постоплата. Фиксированная цена.'},
        {'Title': 'Трансфер для юрлиц. Счёт и акт', 'Title2': 'Фиксированная цена. Без сюрпризов', 'Text': 'Корпоративный межгородской трансфер. Оплата по безналу, полный пакет документов.'},
        {'Title': 'Межгород для компаний. Безнал', 'Title2': 'Договор, УПД, акт — всё включено', 'Text': 'Бизнес-трансфер с закрывающими документами. Оплата по счёту, фиксированная цена.'},
    ],
}

# New ad groups to create
NEW_GROUPS = {
    'series3': {'Name': 'Фиксированная цена', 'RegionIds': [225, 977]},
    'series5': {'Name': 'По всей России', 'RegionIds': [225, 977]},
    'series6': {'Name': 'Корпоративный (ретаргетинг)', 'RegionIds': [225, 977]},
}

# Map series to image keys
SERIES_IMAGES = {
    'series1': [('s1_1.1_wide', 's1_1.1_sq'), ('s1_1.2_wide', 's1_1.2_sq'), ('s1_1.3_wide', 's1_1.3_sq')],
    'series2': [('s2_2.1_wide', 's2_2.1_sq'), ('s2_2.2_wide', 's2_2.2_sq'), ('s2_2.3_wide', 's2_2.3_sq')],
    'series3': [('s3_3.1_wide', 's3_3.1_sq'), ('s3_3.2_wide', 's3_3.2_sq'), ('s3_3.3_wide', 's3_3.3_sq')],
    'series4': [('s4_4.1_wide', 's4_4.1_sq'), ('s4_4.2_wide', 's4_4.2_sq'), ('s4_4.3_wide', 's4_4.3_sq')],
    'series5': [('s5_5.1_wide', 's5_5.1_sq'), ('s5_5.2_wide', 's5_5.2_sq'), ('s5_5.3_wide', 's5_5.3_sq')],
    'series6': [('s6_6.1_wide', 's6_6.1_sq'), ('s6_6.2_wide', 's6_6.2_sq'), ('s6_6.3_wide', 's6_6.3_sq')],
}


def api_call(service, body):
    r = requests.post(API_URL + service, json=body, headers=HEADERS, timeout=120)
    return r.json()


def upload_images():
    """Upload all images and return hash map."""
    print("=" * 60)
    print("STEP 1: Uploading images")
    print("=" * 60)

    hashes = {}
    # Upload in batches of 3 (API may have limits)
    keys = list(IMAGE_MAP.keys())
    for i in range(0, len(keys), 3):
        batch_keys = keys[i:i+3]
        images_batch = []
        for key in batch_keys:
            filepath = os.path.join(CREATIVES_DIR, IMAGE_MAP[key])
            if not os.path.exists(filepath):
                print(f"  NOT FOUND: {filepath}")
                continue
            with open(filepath, 'rb') as f:
                img_data = base64.b64encode(f.read()).decode()
            images_batch.append({
                'ImageData': img_data,
                'Name': f'b2b_{key}'
            })

        if not images_batch:
            continue

        result = api_call('adimages', {
            'method': 'add',
            'params': {'AdImages': images_batch}
        })

        if 'result' in result:
            for j, item in enumerate(result['result'].get('AddResults', [])):
                key = batch_keys[j]
                if 'AdImageHash' in item:
                    hashes[key] = item['AdImageHash']
                    print(f"  OK: {key} -> {item['AdImageHash']}")
                elif 'Errors' in item:
                    err = item['Errors'][0]
                    print(f"  ERR: {key} -> {err.get('Message', '')} (Code {err.get('Code', '')})")
                    # Duplicate? Try to find by name
                    if err.get('Code') == 8800:
                        get_r = api_call('adimages', {
                            'method': 'get',
                            'params': {
                                'SelectionCriteria': {},
                                'FieldNames': ['AdImageHash', 'Name']
                            }
                        })
                        for img in get_r.get('result', {}).get('AdImages', []):
                            if img.get('Name') == f'b2b_{key}':
                                hashes[key] = img['AdImageHash']
                                print(f"  FOUND existing: {key} -> {img['AdImageHash']}")
                                break
        else:
            print(f"  API ERROR: {json.dumps(result, ensure_ascii=False)[:200]}")

        time.sleep(0.5)  # Rate limit

    print(f"\nTotal uploaded: {len(hashes)}/{len(IMAGE_MAP)}")
    return hashes


def create_new_groups():
    """Create ad groups for series 3, 5, 6."""
    print("\n" + "=" * 60)
    print("STEP 2: Creating new ad groups")
    print("=" * 60)

    group_ids = {}
    groups_to_create = []
    for series_key, config in NEW_GROUPS.items():
        groups_to_create.append({
            'Name': config['Name'],
            'CampaignId': CAMPAIGN_ID,
            'RegionIds': config['RegionIds'],
            'NegativeKeywords': {'Items': ['бесплатн', 'дёшев', 'дешёв', 'попутчик']},
        })

    result = api_call('adgroups', {
        'method': 'add',
        'params': {'AdGroups': groups_to_create}
    })

    if 'result' in result:
        series_keys = list(NEW_GROUPS.keys())
        for i, item in enumerate(result['result'].get('AddResults', [])):
            if 'Id' in item:
                group_ids[series_keys[i]] = item['Id']
                print(f"  Created group '{NEW_GROUPS[series_keys[i]]['Name']}': ID {item['Id']}")
            elif 'Errors' in item:
                print(f"  ERROR: {item['Errors']}")
    else:
        print(f"  API ERROR: {json.dumps(result, ensure_ascii=False)[:300]}")

    return group_ids


def add_audience_targets(group_ids):
    """Add audience targeting to new groups."""
    print("\n" + "=" * 60)
    print("STEP 3: Adding audience targets to new groups")
    print("=" * 60)

    targets = []
    for series_key, group_id in group_ids.items():
        targets.append({
            'AdGroupId': group_id,
            'RetargetingListId': RETARGETING_LIST_ID,
            'ContextBid': CONTEXT_BID,
        })

    if not targets:
        print("  No targets to add")
        return

    result = api_call('audiencetargets', {
        'method': 'add',
        'params': {'AudienceTargets': targets}
    })
    print(f"  Result: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}")


def create_ads(all_group_ids, hashes):
    """Create ads for all groups."""
    print("\n" + "=" * 60)
    print("STEP 4: Creating ads")
    print("=" * 60)

    # First, get existing ads to know which to skip
    existing = api_call('ads', {
        'method': 'get',
        'params': {
            'SelectionCriteria': {'CampaignIds': [CAMPAIGN_ID]},
            'FieldNames': ['Id', 'AdGroupId'],
            'TextAdFieldNames': ['Title', 'AdImageHash']
        }
    })
    existing_by_group = {}
    for ad in existing.get('result', {}).get('Ads', []):
        gid = ad['AdGroupId']
        if gid not in existing_by_group:
            existing_by_group[gid] = []
        existing_by_group[gid].append(ad.get('TextAd', {}).get('AdImageHash', ''))

    ads_to_create = []
    for series_key, group_id in all_group_ids.items():
        images = SERIES_IMAGES[series_key]
        copies = AD_COPY[series_key]
        existing_hashes = existing_by_group.get(group_id, [])

        for i, (wide_key, sq_key) in enumerate(images):
            copy = copies[i]
            # Wide ad
            if wide_key in hashes and hashes[wide_key] not in existing_hashes:
                ads_to_create.append({
                    'AdGroupId': group_id,
                    'TextAd': {
                        'Title': copy['Title'],
                        'Title2': copy['Title2'],
                        'Text': copy['Text'],
                        'Href': HREF,
                        'AdImageHash': hashes[wide_key],
                        'Mobile': 'NO',
                    }
                })
            # Square ad
            if sq_key in hashes and hashes[sq_key] not in existing_hashes:
                ads_to_create.append({
                    'AdGroupId': group_id,
                    'TextAd': {
                        'Title': copy['Title'],
                        'Title2': copy['Title2'],
                        'Text': copy['Text'],
                        'Href': HREF,
                        'AdImageHash': hashes[sq_key],
                        'Mobile': 'NO',
                    }
                })

    print(f"  Ads to create: {len(ads_to_create)}")

    # Create in batches of 10
    created = 0
    for i in range(0, len(ads_to_create), 10):
        batch = ads_to_create[i:i+10]
        result = api_call('ads', {
            'method': 'add',
            'params': {'Ads': batch}
        })
        if 'result' in result:
            for item in result['result'].get('AddResults', []):
                if 'Id' in item:
                    created += 1
                    print(f"  Created ad {item['Id']}")
                elif 'Errors' in item:
                    print(f"  ERROR: {item['Errors']}")
        else:
            print(f"  API ERROR: {json.dumps(result, ensure_ascii=False)[:300]}")
        time.sleep(0.5)

    print(f"\n  Total created: {created}")
    return created


def send_to_moderation():
    """Send all new ads to moderation."""
    print("\n" + "=" * 60)
    print("STEP 5: Sending to moderation")
    print("=" * 60)

    # Get all DRAFT ads
    result = api_call('ads', {
        'method': 'get',
        'params': {
            'SelectionCriteria': {
                'CampaignIds': [CAMPAIGN_ID],
                'Statuses': ['DRAFT']
            },
            'FieldNames': ['Id', 'Status']
        }
    })

    draft_ids = [ad['Id'] for ad in result.get('result', {}).get('Ads', [])]
    if not draft_ids:
        print("  No DRAFT ads to moderate")
        return

    print(f"  Sending {len(draft_ids)} ads to moderation...")
    mod_result = api_call('ads', {
        'method': 'moderate',
        'params': {'SelectionCriteria': {'Ids': draft_ids}}
    })
    print(f"  Result: {json.dumps(mod_result, indent=2, ensure_ascii=False)[:500]}")


def verify():
    """Final verification."""
    print("\n" + "=" * 60)
    print("STEP 6: Final verification")
    print("=" * 60)

    # Groups
    groups = api_call('adgroups', {
        'method': 'get',
        'params': {
            'SelectionCriteria': {'CampaignIds': [CAMPAIGN_ID]},
            'FieldNames': ['Id', 'Name', 'Status']
        }
    })
    print("\nAd Groups:")
    for g in groups.get('result', {}).get('AdGroups', []):
        print(f"  {g['Id']}: {g['Name']} ({g['Status']})")

    # Ads
    ads = api_call('ads', {
        'method': 'get',
        'params': {
            'SelectionCriteria': {'CampaignIds': [CAMPAIGN_ID]},
            'FieldNames': ['Id', 'AdGroupId', 'State', 'Status', 'StatusClarification'],
            'TextAdFieldNames': ['Title', 'AdImageHash']
        }
    })
    print(f"\nAds ({len(ads.get('result', {}).get('Ads', []))} total):")
    for ad in ads.get('result', {}).get('Ads', []):
        print(f"  {ad['Id']}: [{ad['Status']}/{ad['State']}] {ad.get('TextAd', {}).get('Title', '')} | {ad.get('StatusClarification', '')}")


def main():
    # Step 1: Upload all images
    hashes = upload_images()

    # Step 2: Create new groups
    new_group_ids = create_new_groups()

    # Step 3: Add audience targets
    add_audience_targets(new_group_ids)

    # Merge all group IDs
    all_group_ids = dict(EXISTING_GROUPS)
    all_group_ids.update(new_group_ids)

    # Step 4: Create ads
    create_ads(all_group_ids, hashes)

    # Step 5: Moderate
    send_to_moderation()

    # Step 6: Verify
    verify()

    print("\n" + "=" * 60)
    print("DONE!")
    print("=" * 60)


if __name__ == '__main__':
    main()
