# -*- coding: utf-8 -*-
"""
Create RSYa campaign targeting B2B look-alike audience
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
LOOKALIKE_ID = 38098389

neg_kw = [
    'япония','грузия','черногория','бангкок','паттайя',
    'таиланд','турция','египет','дубай','кипр',
    'болгария','тунис','вьетнам','индия','китай',
    'абхазия','гагры','армения','азербайджан','узбекистан',
    'antalya','transfer ucreti',
    'архыз','шерегеш','домбай','теберда','роза хутор',
    'курорт','горнолыжный','санаторий','пансионат',
    'сколько стоит','стоимость','тариф','расценки',
    'прайс','калькулятор стоимости',
    'blablacar','автобус','автошкола','аренда',
    'билет','блаблакар','вакансия','википедия',
    'водитель','вокзал','газель','грузовой',
    'грузоперевозки','грузчики','жд',
    'животные','зарплата','каршеринг',
    'курсы','максим','обучение',
    'переезд','подработка','поезд',
    'попутка','приложение','прокат',
    'работа','расписание','резюме','рейтинг',
    'ситимобил','скачать','требуется',
    'убер','устроиться','форум','фура',
    'электричка','яндекс такси',
    'свадьба','свадебный','роддом','похороны',
    'ритуальный','выпускной','банкет','праздник',
    'вечеринка','день рождения',
    'бесплатно','дешево','недорого','бюджетно',
    'подвезти','попутчик','частный','эконом',
    'личный','кошка','собака','море',
    'отдых','отзывы','отпуск','туризм','экскурсия',
    'детское кресло','номера такси','частный извоз','донецк'
]

# ================================================
# 1. CREATE CAMPAIGN
# ================================================
print('=' * 60)
print('1. CREATING RSYa CAMPAIGN')
print('=' * 60)

body = {
    'method': 'add',
    'params': {
        'Campaigns': [{
            'Name': 'B2B | RSYa | Look-alike',
            'StartDate': '2026-01-30',
            'NegativeKeywords': {'Items': sorted(set(neg_kw))},
            'ExcludedSites': {
                'Items': [
                    'inner-active.mobi',
                    'com.google.android.googlequicksearchbox',
                    'com.android.chrome',
                    'com.yandex.browser',
                    'play.google.com',
                    'apps.apple.com'
                ]
            },
            'TimeTargeting': {
                'Schedule': {
                    'Items': [
                        '1,0,0,0,0,0,0,0,120,120,120,120,120,120,120,120,120,120,120,120,120,120,0,0,0',
                        '2,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0',
                        '3,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0',
                        '4,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0',
                        '5,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0',
                        '6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
                        '7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'
                    ]
                },
                'ConsiderWorkingWeekends': 'YES',
                'HolidaysSchedule': {'SuspendOnHolidays': 'YES'}
            },
            'TextCampaign': {
                'BiddingStrategy': {
                    'Search': {'BiddingStrategyType': 'SERVING_OFF'},
                    'Network': {
                        'BiddingStrategyType': 'WB_MAXIMUM_CLICKS',
                        'WbMaximumClicks': {
                            'WeeklySpendLimit': 7000000000,
                            'BidCeiling': 15000000
                        }
                    }
                },
                'Settings': [
                    {'Option': 'ADD_METRICA_TAG', 'Value': 'YES'},
                    {'Option': 'ADD_OPENSTAT_TAG', 'Value': 'NO'},
                    {'Option': 'ADD_TO_FAVORITES', 'Value': 'NO'},
                    {'Option': 'ENABLE_AREA_OF_INTEREST_TARGETING', 'Value': 'YES'},
                    {'Option': 'ENABLE_COMPANY_INFO', 'Value': 'YES'},
                    {'Option': 'ENABLE_SITE_MONITORING', 'Value': 'NO'},
                    {'Option': 'REQUIRE_SERVICING', 'Value': 'NO'}
                ]
            }
        }]
    }
}

result = api_call('campaigns', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

campaign_id = None
if 'result' in result:
    ar = result['result'].get('AddResults', [])
    if ar and 'Id' in ar[0]:
        campaign_id = ar[0]['Id']
        print('Campaign ID: ' + str(campaign_id))

if not campaign_id:
    print('FAILED to create campaign, exiting')
    exit(1)

time.sleep(2)

# ================================================
# 2. CREATE AD GROUPS (3 for A/B testing)
# ================================================
print()
print('=' * 60)
print('2. CREATING AD GROUPS')
print('=' * 60)

groups = [
    {'Name': 'Документы и отчетность', 'CampaignId': campaign_id, 'RegionIds': [225, 977]},
    {'Name': 'Корпоративный трансфер', 'CampaignId': campaign_id, 'RegionIds': [225, 977]},
    {'Name': 'Договор и оплата по счету', 'CampaignId': campaign_id, 'RegionIds': [225, 977]},
]

body = {'method': 'add', 'params': {'AdGroups': groups}}
result = api_call('adgroups', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

group_ids = {}
group_names = [g['Name'] for g in groups]
if 'result' in result:
    ar = result['result'].get('AddResults', [])
    for i, r in enumerate(ar):
        if 'Id' in r:
            group_ids[group_names[i]] = r['Id']
            print('  ' + group_names[i] + ': ID=' + str(r['Id']))

if not group_ids:
    print('FAILED to create groups')
    exit(1)

time.sleep(2)

# ================================================
# 3. CREATE ADS
# ================================================
print()
print('=' * 60)
print('3. CREATING ADS')
print('=' * 60)

ads_data = {
    'Документы и отчетность': {
        'Title': 'Такси с закрывающими для юрлиц',
        'Title2': 'Акт, УПД, чек с QR. ЭДО',
        'Text': 'Закрывающие документы автоматически. Реестр поездок. Оплата по счету.'
    },
    'Корпоративный трансфер': {
        'Title': 'Корпоративный трансфер межгород',
        'Title2': 'Договор. Документы. По счету',
        'Text': 'Перевозка сотрудников между городами. Договор. Закрывающие через ЭДО.'
    },
    'Договор и оплата по счету': {
        'Title': 'Трансфер для бизнеса по договору',
        'Title2': 'Безнал. Акт. ЭДО. Чек с QR',
        'Text': 'Заключаем договор. Оплата по реквизитам или корп. картой. Документы.'
    },
}

ads_to_create = []
for gname, gid in group_ids.items():
    ad_info = ads_data.get(gname)
    if ad_info:
        ads_to_create.append({
            'AdGroupId': gid,
            'TextAd': {
                'Title': ad_info['Title'],
                'Title2': ad_info['Title2'],
                'Text': ad_info['Text'],
                'Href': LANDING,
            }
        })

body = {'method': 'add', 'params': {'Ads': ads_to_create}}
result = api_call('ads', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

ad_ids = []
if 'result' in result:
    ar = result['result'].get('AddResults', [])
    ad_ids = [r['Id'] for r in ar if 'Id' in r]
    print('Created ads: ' + str(len(ad_ids)))

# Send to moderation
if ad_ids:
    body = {'method': 'moderate', 'params': {'SelectionCriteria': {'Ids': ad_ids}}}
    result = api_call('ads', body)
    print('Moderation: ' + json.dumps(result, ensure_ascii=False)[:300])

time.sleep(2)

# ================================================
# 4. ADD AUDIENCE TARGETS (look-alike)
# ================================================
print()
print('=' * 60)
print('4. ADDING AUDIENCE TARGETS')
print('=' * 60)

targets = []
for gname, gid in group_ids.items():
    targets.append({
        'AdGroupId': gid,
        'RetargetingListId': LOOKALIKE_ID
    })

body = {'method': 'add', 'params': {'AudienceTargets': targets}}
result = api_call('audiencetargets', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

# ================================================
# 5. ADD DEVICE ADJUSTMENTS (Mobile -30%, Desktop +30%)
# ================================================
print()
print('=' * 60)
print('5. ADDING DEVICE ADJUSTMENTS')
print('=' * 60)

body = {
    'method': 'add',
    'params': {
        'BidModifiers': [
            {
                'CampaignId': campaign_id,
                'MobileAdjustment': {'BidModifier': 70}
            },
            {
                'CampaignId': campaign_id,
                'DesktopAdjustment': {'BidModifier': 130}
            }
        ]
    }
}
result = api_call('bidmodifiers', body)
print(json.dumps(result, ensure_ascii=False, indent=2))

# ================================================
# SUMMARY
# ================================================
print()
print('=' * 60)
print('SUMMARY')
print('=' * 60)
print('Campaign: B2B | RSYa | Look-alike (ID: ' + str(campaign_id) + ')')
print('Strategy: WB_MAXIMUM_CLICKS, Network only')
print('Budget: 7000 rub/week, BidCeiling: 15 rub')
print('Groups: ' + str(len(group_ids)))
print('Ads: ' + str(len(ad_ids)))
print('Audience: MAX_look_alike_OWN_b2b (ID: ' + str(LOOKALIKE_ID) + ')')
print('Schedule: Mon-Fri 8-21, holidays OFF')
print('Regions: Russia + Crimea')
print('Negative keywords: ' + str(len(set(neg_kw))))
print('Excluded sites: mobile apps')
print('Device: Mobile -30%, Desktop +30%')
