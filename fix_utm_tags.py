# -*- coding: utf-8 -*-
"""
Fix UTM tags on all B2B ads and enable Metrika auto-tagging
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

CAMPAIGNS = [
    (705839254, 'B2B_Goryachie'),
    (705839266, 'B2B_Geo'),
    (706808352, 'B2B_RSYa_Lookalike'),
]

# ================================================
# 1. ENABLE ADD_METRICA_TAG ON ALL CAMPAIGNS
# ================================================
print('=' * 60)
print('1. ENABLING METRICA TAG ON CAMPAIGNS')
print('=' * 60)

updates = []
for cid, cname in CAMPAIGNS:
    updates.append({
        'Id': cid,
        'TextCampaign': {
            'Settings': [
                {'Option': 'ADD_METRICA_TAG', 'Value': 'YES'}
            ]
        }
    })

body = {'method': 'update', 'params': {'Campaigns': updates}}
result = api_call('campaigns', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

time.sleep(1)

# ================================================
# 2. ADD UTM TAGS TO ALL ADS
# ================================================
print()
print('=' * 60)
print('2. ADDING UTM TAGS TO ADS')
print('=' * 60)

UTM_TEMPLATE = '?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_id}&utm_term={keyword}'
BASE_URL = 'https://city2city.ru/dlya-biznesa'

for cid, cname in CAMPAIGNS:
    # Get all ads
    body = {
        'method': 'get',
        'params': {
            'SelectionCriteria': {'CampaignIds': [cid]},
            'FieldNames': ['Id'],
            'TextAdFieldNames': ['Title', 'Title2', 'Text', 'Href', 'AdImageHash']
        }
    }
    result = api_call('ads', body)
    ads = result.get('result', {}).get('Ads', [])
    print(cname + ': ' + str(len(ads)) + ' ads')

    updates = []
    for ad in ads:
        ad_id = ad['Id']
        text_ad = ad.get('TextAd', {})
        current_href = text_ad.get('Href', '')

        # Strip existing trailing slash and any existing UTM
        clean_href = current_href.split('?')[0].rstrip('/')
        new_href = clean_href + UTM_TEMPLATE

        update = {
            'Id': ad_id,
            'TextAd': {
                'Title': text_ad['Title'],
                'Title2': text_ad.get('Title2', ''),
                'Text': text_ad['Text'],
                'Href': new_href,
            }
        }
        # Preserve image if exists
        if text_ad.get('AdImageHash'):
            update['TextAd']['AdImageHash'] = text_ad['AdImageHash']

        updates.append(update)
        title = text_ad.get('Title', '?')
        print('  ' + title + ' -> UTM added')

    if updates:
        body = {'method': 'update', 'params': {'Ads': updates}}
        result = api_call('ads', body)

        # Check results
        update_results = result.get('result', {}).get('UpdateResults', [])
        ok = sum(1 for r in update_results if 'Id' in r)
        err = sum(1 for r in update_results if 'Errors' in r)
        print('  Result: ' + str(ok) + ' OK, ' + str(err) + ' errors')

        if err > 0:
            for r in update_results:
                if 'Errors' in r:
                    for e in r['Errors']:
                        print('  ERROR: ' + str(e.get('Code', '')) + ' ' + e.get('Message', '') + ' ' + e.get('Details', ''))

        # Check warnings
        for r in update_results:
            if 'Warnings' in r:
                for w in r['Warnings']:
                    print('  WARNING: ' + str(w.get('Code', '')) + ' ' + w.get('Message', ''))

    time.sleep(1)

# ================================================
# 3. VERIFY
# ================================================
print()
print('=' * 60)
print('3. VERIFICATION')
print('=' * 60)

time.sleep(2)

for cid, cname in CAMPAIGNS:
    body = {
        'method': 'get',
        'params': {
            'SelectionCriteria': {'CampaignIds': [cid]},
            'FieldNames': ['Id', 'State', 'Status'],
            'TextAdFieldNames': ['Title', 'Href']
        }
    }
    result = api_call('ads', body)
    ads = result.get('result', {}).get('Ads', [])
    print(cname + ':')
    for a in ads:
        title = a.get('TextAd', {}).get('Title', '?')
        href = a.get('TextAd', {}).get('Href', '?')
        has_utm = 'utm_source' in href
        status = a.get('Status', '?')
        print('  [' + status + '] ' + title + ' | UTM: ' + ('YES' if has_utm else 'NO'))
    print()

# Check campaign settings
body = {
    'method': 'get',
    'params': {
        'SelectionCriteria': {'Ids': [705839254, 705839266, 706808352]},
        'FieldNames': ['Id', 'Name'],
        'TextCampaignFieldNames': ['Settings']
    }
}
result = api_call('campaigns', body)
campaigns = result.get('result', {}).get('Campaigns', [])
print('Campaign Metrica tag settings:')
for c in campaigns:
    name = c.get('Name', '?')
    settings = c.get('TextCampaign', {}).get('Settings', [])
    for s in settings:
        if s.get('Option') == 'ADD_METRICA_TAG':
            print('  ' + name + ': ADD_METRICA_TAG = ' + s.get('Value', '?'))
