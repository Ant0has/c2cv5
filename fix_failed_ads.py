"""
Fix failed ads - create the 14 ads that failed due to text length limits.
Title: max 56 chars, Title2: max 30 chars, Text: max 81 chars
"""
import json
import requests
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
HREF = 'https://city2city.ru/dlya-biznesa?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_id}&utm_term={keyword}'

# Image hashes from previous upload
HASHES = {
    's1_1.1_wide': 'Dz4xEaJjW5XxnV6UO1-5Ig',
    's1_1.1_sq': 'DRzOf8hdCbO5PhEDippT6g',
    's2_2.1_wide': 'JUCyATzstKXxjAhykehJSw',
    's2_2.1_sq': 'xJ8vSOqQYWmmiBy-Ci1BAg',
    's2_2.2_wide': 'WZAEAtf7R3erT50vcdaF3g',
    's2_2.2_sq': 'WvOEMLaALNcQlOe_oyfOPA',
    's2_2.3_wide': 'ow_RJSRpHTuoaEM8vPIxxw',
    's2_2.3_sq': '3K4DLBhqnMROCUImz5QkFQ',
    's4_4.2_wide': 'n-aa1PCcWCQYBCS_UZggwQ',
    's4_4.2_sq': 'ncocBETjLnsh12Byn4uLLQ',
    's5_5.1_wide': 'sSJnG07EcA30BeEb-6K-XA',
    's5_5.1_sq': 'agN8BrmW6x3TcFct9uNeHQ',
    's6_6.3_wide': 'aAOfC2DgWYyaJWBnTNwNVA',
    's6_6.3_sq': 'dIOEHMLovzkrxxtwa1nlhA',
}

# Group IDs
GROUPS = {
    'series1': 5708852960,
    'series2': 5708852959,
    'series3': 5715605412,
    'series4': 5708852961,
    'series5': 5715605413,
    'series6': 5715605414,
}

def api_call(service, body):
    r = requests.post(API_URL + service, json=body, headers=HEADERS, timeout=120)
    return r.json()

# Fixed ad copy (all within limits: Title≤56, Title2≤30, Text≤81)
# Each entry: (group_key, image_wide, image_sq, Title, Title2, Text)
FAILED_ADS = [
    # Series 1, copy[0] - Text was 87 chars -> shortened
    ('series1', 's1_1.1_wide', 's1_1.1_sq',
     'Корпоративный трансфер межгород',
     'Оплата по счёту. Договор. НДС',
     'Водитель подан вовремя. Закрывающие документы. Фикс. цена без переплат.'),

    # Series 2, copy[0] - Title2 was 31 chars, Text was 87 chars
    ('series2', 's2_2.1_wide', 's2_2.1_sq',
     'Такси с закрывающими для юрлиц',
     'Счёт, акт, УПД — автоматика',
     'Трансфер между городами с документами для бухгалтерии. Оплата по счёту.'),

    # Series 2, copy[1] - Title2 was 34 chars
    ('series2', 's2_2.2_wide', 's2_2.2_sq',
     'Закрывающие документы. ЭДО',
     'Счёт + акт + УПД за поездку',
     'Межгород для бизнеса. Документы в личном кабинете. Договор, постоплата.'),

    # Series 2, copy[2] - Title2 was 32 chars
    ('series2', 's2_2.3_wide', 's2_2.3_sq',
     'Документы для бухгалтерии',
     'Трансфер с отчётностью. ЮЛ',
     'Закрывающие по каждой поездке. УПД, акт, счёт. Электронный документооборот.'),

    # Series 4, copy[1] - Text was 82 chars
    ('series4', 's4_4.2_wide', 's4_4.2_sq',
     'Такси межгород по безналу',
     'Договор и акт за каждую поезд.',
     'Перевозка сотрудников между городами. Фикс. цена, все документы.'),

    # Series 5, copy[0] - Text was 84 chars
    ('series5', 's5_5.1_wide', 's5_5.1_sq',
     'Трансфер по всей России',
     'Для бизнеса. Договор и счёт',
     'Межгородские перевозки для корпоративных клиентов. Фикс. цена, документы.'),

    # Series 6, copy[2] - Title2 was 33 chars
    ('series6', 's6_6.3_wide', 's6_6.3_sq',
     'Межгород для компаний. Безнал',
     'Договор, УПД, акт — всё сразу',
     'Бизнес-трансфер с закрывающими. Оплата по счёту, фиксированная цена.'),
]

# Validate lengths before sending
print("=== Validating ad copy lengths ===")
all_ok = True
for entry in FAILED_ADS:
    group_key, wide, sq, title, title2, text = entry
    issues = []
    if len(title) > 56:
        issues.append(f"Title={len(title)}>56")
    if len(title2) > 30:
        issues.append(f"Title2={len(title2)}>30")
    if len(text) > 81:
        issues.append(f"Text={len(text)}>81")
    if issues:
        print(f"  FAIL [{group_key}] {title}: {', '.join(issues)}")
        all_ok = False
    else:
        print(f"  OK [{group_key}] Title={len(title)} Title2={len(title2)} Text={len(text)}")

if not all_ok:
    print("\nFIX THE LENGTHS ABOVE BEFORE PROCEEDING!")
    sys.exit(1)

# Create ads
print("\n=== Creating ads ===")
ads_to_create = []
for entry in FAILED_ADS:
    group_key, wide_key, sq_key, title, title2, text = entry
    group_id = GROUPS[group_key]

    # Wide
    if wide_key in HASHES:
        ads_to_create.append({
            'AdGroupId': group_id,
            'TextAd': {
                'Title': title,
                'Title2': title2,
                'Text': text,
                'Href': HREF,
                'AdImageHash': HASHES[wide_key],
                'Mobile': 'NO',
            }
        })
    # Square
    if sq_key in HASHES:
        ads_to_create.append({
            'AdGroupId': group_id,
            'TextAd': {
                'Title': title,
                'Title2': title2,
                'Text': text,
                'Href': HREF,
                'AdImageHash': HASHES[sq_key],
                'Mobile': 'NO',
            }
        })

print(f"  Creating {len(ads_to_create)} ads...")

for i in range(0, len(ads_to_create), 10):
    batch = ads_to_create[i:i+10]
    result = api_call('ads', {'method': 'add', 'params': {'Ads': batch}})
    if 'result' in result:
        for item in result['result'].get('AddResults', []):
            if 'Id' in item:
                print(f"  Created ad {item['Id']}")
            elif 'Errors' in item:
                print(f"  ERROR: {item['Errors']}")
    else:
        print(f"  API ERROR: {json.dumps(result, ensure_ascii=False)[:300]}")
    time.sleep(0.5)

# Moderate
print("\n=== Sending to moderation ===")
result = api_call('ads', {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'CampaignIds': [CAMPAIGN_ID], 'Statuses': ['DRAFT']},
        'FieldNames': ['Id']
    }
})
draft_ids = [ad['Id'] for ad in result.get('result', {}).get('Ads', [])]
if draft_ids:
    mod = api_call('ads', {'method': 'moderate', 'params': {'SelectionCriteria': {'Ids': draft_ids}}})
    print(f"  Moderated {len(draft_ids)} ads")
else:
    print("  No drafts")

# Final count
print("\n=== Final count ===")
result = api_call('ads', {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'CampaignIds': [CAMPAIGN_ID]},
        'FieldNames': ['Id', 'AdGroupId', 'Status'],
        'TextAdFieldNames': ['Title']
    }
})
ads = result.get('result', {}).get('Ads', [])
print(f"Total ads in campaign: {len(ads)}")
for ad in ads:
    print(f"  {ad['Id']}: [{ad['Status']}] {ad.get('TextAd', {}).get('Title', '')}")
