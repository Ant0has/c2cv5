import json
import sys
sys.path.insert(0, '/home/anton-furs/yandex-direct-bot')
import requests
from config import OAUTH_TOKEN, API_URL

TOKEN = OAUTH_TOKEN

HEADERS = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json',
    'Accept-Language': 'ru'
}

CAMPAIGN_ID = 706808352

# First, get current ExcludedSites
print("=== Getting current ExcludedSites ===")
body = {
    "method": "get",
    "params": {
        "SelectionCriteria": {"Ids": [CAMPAIGN_ID]},
        "FieldNames": ["Id", "Name", "ExcludedSites"]
    }
}
r = requests.post(API_URL + 'campaigns', json=body, headers=HEADERS)
data = r.json()
print(json.dumps(data, indent=2, ensure_ascii=False))

current_excluded = []
if 'result' in data and 'Campaigns' in data['result']:
    camp = data['result']['Campaigns'][0]
    current_excluded = camp.get('ExcludedSites', {}).get('Items', [])
    print(f"\nCurrently excluded: {len(current_excluded)} sites")
    for s in current_excluded:
        print(f"  - {s}")

# Standard list of mobile apps and junk RSYa placements to exclude
# NOTE: Only domain names allowed, no paths (e.g. no "yandex.ru/games")
new_excludes = [
    # Mobile apps (major ones that drain budget with low-quality clicks)
    "com.avito.android",
    "com.vkontakte.android",
    "ru.ok.android",
    "com.whatsapp",
    "org.telegram.messenger",
    "com.viber.voip",
    "ru.mail.mailapp",
    "ru.mail.cloud",
    "com.instagram.android",
    "ru.yandex.searchplugin",
    "ru.yandex.weatherplugin",
    "com.facebook.katana",
    "com.facebook.orca",
    "ru.auto.ara",
    "ru.yandex.taxi",
    "com.badoo.mobile",
    "ru.tinkoff.investing",
    "com.spotify.music",
    "ru.sberbankmobile",
    "com.google.android.youtube",
    "ru.yandex.music",
    "com.tinder",
    "ru.youla.app",
    "com.drom.auto",
    "ru.cian.main",
    "com.wildberries.ru",
    "ru.ozon.app.android",
    "com.aliexpress",
    "ru.sravni.android",
    "com.xiaomi.midrop",
    "ru.yandex.disk",
    "com.samsung.android.app.notes",
    "com.android.chrome",
    "com.samsung.android.game.launcher",
    "ru.hh.android",
    # Known low-quality web placements (domains only)
    "dsp.yandex.ru",
    "zen.yandex.ru",
    "m.avito.ru",
    "www.avito.ru",
    "music.yandex.ru",
    "tv.yandex.ru",
    "games.yandex.ru",
    "pogoda.yandex.ru",
    "translate.yandex.ru",
    "slovari.yandex.ru",
]

# Merge with existing, remove duplicates
all_excluded = list(set(current_excluded + new_excludes))
print(f"\nTotal excluded sites after merge: {len(all_excluded)}")
for s in sorted(all_excluded):
    print(f"  - {s}")

# Update campaign
print("\n=== Updating ExcludedSites ===")
body = {
    "method": "update",
    "params": {
        "Campaigns": [{
            "Id": CAMPAIGN_ID,
            "ExcludedSites": {
                "Items": all_excluded
            }
        }]
    }
}
r = requests.post(API_URL + 'campaigns', json=body, headers=HEADERS)
data = r.json()
print(json.dumps(data, indent=2, ensure_ascii=False))

# Check for errors properly
has_error = False
if 'result' in data and 'UpdateResults' in data['result']:
    for res in data['result']['UpdateResults']:
        if 'Errors' in res and res['Errors']:
            has_error = True
            print(f"\nERROR updating ExcludedSites:")
            for err in res['Errors']:
                print(f"  Code {err['Code']}: {err['Message']} - {err.get('Details','')}")

if not has_error and 'result' in data:
    print(f"\nSuccessfully updated ExcludedSites: {len(all_excluded)} total entries")
elif 'error' in data:
    print(f"\nAPI Error: {data['error']}")

# Verify
print("\n=== Verifying ===")
body = {
    "method": "get",
    "params": {
        "SelectionCriteria": {"Ids": [CAMPAIGN_ID]},
        "FieldNames": ["Id", "Name", "ExcludedSites"]
    }
}
r = requests.post(API_URL + 'campaigns', json=body, headers=HEADERS)
data = r.json()
if 'result' in data and 'Campaigns' in data['result']:
    camp = data['result']['Campaigns'][0]
    final_excluded = camp.get('ExcludedSites', {}).get('Items', [])
    print(f"Verified: {len(final_excluded)} excluded sites")
    for s in sorted(final_excluded):
        print(f"  - {s}")
