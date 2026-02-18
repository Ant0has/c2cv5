# -*- coding: utf-8 -*-
"""
Add second ads (square images) to each RSYa group for A/B rotation
"""

import requests, json, time
from config import OAUTH_TOKEN, API_URL

headers = {
    'Authorization': 'Bearer ' + OAUTH_TOKEN,
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'ru'
}

def api_call(service, body):
    resp = requests.post(API_URL + service, headers=headers, json=body)
    return resp.json()

LANDING = 'https://city2city.ru/dlya-biznesa'

# Square image hashes (uploaded earlier)
SQUARE_HASHES = {
    'doc': 'Doqh0ujE3Qbq2097cMHc8g',
    'corp': 'qU0kQpCpyEP58Vvw_xM72g',
    'contract': 'smhjME7-kSzHHaqdg-ZePg'
}

# Ad groups in RSYa campaign 706808352
groups = [
    {
        'group_id': 5708852959,
        'name': 'Документы и отчетность',
        'image_hash': SQUARE_HASHES['doc'],
        'Title': 'Закрывающие документы. ЭДО',
        'Title2': 'Чек с QR, акт, УПД',
        'Text': 'Все закрывающие для авансового отчета автоматически. Реестр поездок онлайн.'
    },
    {
        'group_id': 5708852960,
        'name': 'Корпоративный трансфер',
        'image_hash': SQUARE_HASHES['corp'],
        'Title': 'Трансфер для сотрудников',
        'Title2': 'Межгород. По договору',
        'Text': 'Подача к офису. Водитель встретит с табличкой. Оплата по счету для юрлиц.'
    },
    {
        'group_id': 5708852961,
        'name': 'Договор и оплата по счету',
        'image_hash': SQUARE_HASHES['contract'],
        'Title': 'Такси межгород по безналу',
        'Title2': 'Договор. Акт. ЭДО',
        'Text': 'Оплата по реквизитам или корп. картой. Закрывающие документы автоматически.'
    }
]

# ================================================
# 1. CREATE ADS WITH SQUARE IMAGES
# ================================================
print('=' * 60)
print('1. CREATING ADS WITH SQUARE IMAGES')
print('=' * 60)

ads_to_create = []
for g in groups:
    ads_to_create.append({
        'AdGroupId': g['group_id'],
        'TextAd': {
            'Title': g['Title'],
            'Title2': g['Title2'],
            'Text': g['Text'],
            'Href': LANDING,
            'AdImageHash': g['image_hash']
        }
    })

body = {'method': 'add', 'params': {'Ads': ads_to_create}}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

ad_ids = []
if 'result' in result:
    ar = result['result'].get('AddResults', [])
    for i, r in enumerate(ar):
        if 'Id' in r:
            ad_ids.append(r['Id'])
            print(groups[i]['name'] + ': Ad ID=' + str(r['Id']))
        elif 'Errors' in r:
            for e in r['Errors']:
                print(groups[i]['name'] + ' ERROR: ' + str(e.get('Code', '')) + ' ' + e.get('Message', ''))

if not ad_ids:
    print('No ads created, exiting')
    exit(1)

# ================================================
# 2. SEND TO MODERATION
# ================================================
print()
print('=' * 60)
print('2. SENDING TO MODERATION')
print('=' * 60)

body = {'method': 'moderate', 'params': {'SelectionCriteria': {'Ids': ad_ids}}}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

time.sleep(2)

# ================================================
# 3. VERIFY ALL ADS IN CAMPAIGN
# ================================================
print()
print('=' * 60)
print('3. ALL ADS IN CAMPAIGN 706808352')
print('=' * 60)

body = {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'CampaignIds': [706808352]},
        'FieldNames': ['Id', 'AdGroupId', 'State', 'Status', 'StatusClarification'],
        'TextAdFieldNames': ['Title', 'AdImageHash']
    }
}
result = api_call('ads', body)
ads = result.get('result', {}).get('Ads', [])
print('Total ads: ' + str(len(ads)))
for a in ads:
    title = a.get('TextAd', {}).get('Title', '?')
    img = a.get('TextAd', {}).get('AdImageHash', 'none')
    gid = a.get('AdGroupId', '?')
    clarif = a.get('StatusClarification', '')
    print('  [' + str(gid) + '] ' + title + ' | ' + a['State'] + ' | ' + a['Status'] + ' | img=' + str(img) + ' | ' + clarif)
