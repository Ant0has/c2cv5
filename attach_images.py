# -*- coding: utf-8 -*-
"""
Upload images to Yandex.Direct and attach to RSYa ads
"""

import requests, json, base64, time
from config import OAUTH_TOKEN, API_URL

headers = {
    'Authorization': 'Bearer ' + OAUTH_TOKEN,
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'ru'
}

def api_call(service, body):
    resp = requests.post(API_URL + service, headers=headers, json=body)
    return resp.json()

CAMPAIGN_ID = 706808352
CREATIVES_DIR = '/home/anton-furs/yandex-direct-bot/creatives/'

# Ad IDs and their corresponding images
# Group 1: Документы и отчетность (AdGroup 5708852959, Ad 17574558472)
# Group 2: Корпоративный трансфер (AdGroup 5708852960, Ad 17574558473)
# Group 3: Договор и оплата по счету (AdGroup 5708852961, Ad 17574558474)

ads_images = [
    {
        'ad_id': 17574558472,
        'name': 'Документы и отчетность',
        'square': CREATIVES_DIR + 'doc_square.png',
        'wide': CREATIVES_DIR + 'doc_wide.png'
    },
    {
        'ad_id': 17574558473,
        'name': 'Корпоративный трансфер',
        'square': CREATIVES_DIR + 'corp_square.png',
        'wide': CREATIVES_DIR + 'corp_wide.png'
    },
    {
        'ad_id': 17574558474,
        'name': 'Договор и оплата по счету',
        'square': CREATIVES_DIR + 'contract_square.png',
        'wide': CREATIVES_DIR + 'contract_wide.png'
    }
]

# ================================================
# 1. ARCHIVE ADS (required before editing)
# ================================================
print('=' * 60)
print('1. ARCHIVING ADS FOR EDITING')
print('=' * 60)

ad_ids = [a['ad_id'] for a in ads_images]

# First need to suspend, then archive... actually for update we just need to get current state
# Let's first get current ad details
body = {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'Ids': ad_ids},
        'FieldNames': ['Id', 'State', 'Status'],
        'TextAdFieldNames': ['Title', 'Title2', 'Text', 'Href', 'AdImageHash', 'SitelinkSetId']
    }
}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

# ================================================
# 2. UPLOAD IMAGES
# ================================================
print()
print('=' * 60)
print('2. UPLOADING IMAGES')
print('=' * 60)

image_hashes = {}

for ad_info in ads_images:
    for img_type in ['square', 'wide']:
        filepath = ad_info[img_type]
        key = str(ad_info['ad_id']) + '_' + img_type

        with open(filepath, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')

        body = {
            'method': 'add',
            'params': {
                'AdImages': [{
                    'ImageData': image_data,
                    'Name': ad_info['name'] + ' ' + img_type
                }]
            }
        }

        result = api_call('adimages', body)
        print(ad_info['name'] + ' [' + img_type + ']: ', end='')

        if 'result' in result:
            ar = result['result'].get('AddResults', [])
            if ar and 'AdImageHash' in ar[0]:
                h = ar[0]['AdImageHash']
                image_hashes[key] = h
                print('OK, hash=' + h)
            elif ar and 'Errors' in ar[0]:
                errs = ar[0]['Errors']
                for e in errs:
                    print('ERROR: ' + str(e.get('Code', '')) + ' ' + e.get('Message', ''))
            else:
                print('Unknown result: ' + json.dumps(ar, ensure_ascii=False)[:200])
        else:
            err = result.get('error', {})
            print('API ERROR: ' + str(err.get('error_code', '')) + ' ' + err.get('error_detail', ''))

        time.sleep(1)

print()
print('Uploaded hashes: ' + str(len(image_hashes)))
for k, v in image_hashes.items():
    print('  ' + k + ': ' + v)

if not image_hashes:
    print('No images uploaded, exiting')
    exit(1)

# ================================================
# 3. UPDATE ADS WITH IMAGES
# ================================================
print()
print('=' * 60)
print('3. UPDATING ADS WITH IMAGES')
print('=' * 60)

# Get current ad data first
body = {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'Ids': ad_ids},
        'FieldNames': ['Id', 'State'],
        'TextAdFieldNames': ['Title', 'Title2', 'Text', 'Href']
    }
}
result = api_call('ads', body)
current_ads = result.get('result', {}).get('Ads', [])

updates = []
for ad in current_ads:
    ad_id = ad['Id']
    text_ad = ad.get('TextAd', {})

    square_hash = image_hashes.get(str(ad_id) + '_square')
    wide_hash = image_hashes.get(str(ad_id) + '_wide')

    update_data = {
        'Id': ad_id,
        'TextAd': {
            'Title': text_ad['Title'],
            'Title2': text_ad.get('Title2', ''),
            'Text': text_ad['Text'],
            'Href': text_ad['Href'],
        }
    }

    if square_hash:
        update_data['TextAd']['AdImageHash'] = square_hash
    if wide_hash:
        update_data['TextAd']['AdImageHash'] = wide_hash  # wide takes priority

    updates.append(update_data)
    print('Updating ad ' + str(ad_id) + ': square=' + str(square_hash) + ', wide=' + str(wide_hash))

body = {'method': 'update', 'params': {'Ads': updates}}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

# ================================================
# 4. RE-SEND TO MODERATION
# ================================================
print()
print('=' * 60)
print('4. RE-SENDING TO MODERATION')
print('=' * 60)

body = {'method': 'moderate', 'params': {'SelectionCriteria': {'Ids': ad_ids}}}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

# ================================================
# 5. VERIFY
# ================================================
print()
print('=' * 60)
print('5. VERIFICATION')
print('=' * 60)

time.sleep(2)
body = {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'Ids': ad_ids},
        'FieldNames': ['Id', 'State', 'Status', 'StatusClarification'],
        'TextAdFieldNames': ['Title', 'AdImageHash']
    }
}
result = api_call('ads', body)
for ad in result.get('result', {}).get('Ads', []):
    title = ad.get('TextAd', {}).get('Title', '?')
    img = ad.get('TextAd', {}).get('AdImageHash', 'none')
    print(title + ' | ' + ad['State'] + ' | ' + ad['Status'] + ' | img=' + str(img))
