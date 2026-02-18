"""
Upload text-overlay banners to Yandex Direct and replace images on existing RSYa ads.
Campaign: 706808352 (B2B | RSYa | Look-alike)
"""
import json
import requests
import base64
import os
import sys

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
CREATIVES_DIR = '/home/anton-furs/yandex-direct-bot/creatives_text/'

# Image files mapping
IMAGES = {
    'corp_wide': 'corp_wide_text.png',
    'corp_square': 'corp_square_text.png',
    'doc_wide': 'doc_wide_text.png',
    'doc_square': 'doc_square_text.png',
    'contract_wide': 'contract_wide_text.png',
    'contract_square': 'contract_square_text.png',
}


def api_call(service, body):
    r = requests.post(API_URL + service, json=body, headers=HEADERS)
    return r.json()


# Step 1: Get all ads in campaign
print("=" * 60)
print("STEP 1: Getting current ads")
print("=" * 60)

result = api_call('ads', {
    "method": "get",
    "params": {
        "SelectionCriteria": {"CampaignIds": [CAMPAIGN_ID]},
        "FieldNames": ["Id", "AdGroupId", "State", "Status"],
        "TextAdFieldNames": ["Title", "Title2", "Text", "Href", "AdImageHash", "Mobile"]
    }
})

ads = result.get('result', {}).get('Ads', [])
print(f"Found {len(ads)} ads\n")

# Get ad groups to match ads to series
result_groups = api_call('adgroups', {
    "method": "get",
    "params": {
        "SelectionCriteria": {"CampaignIds": [CAMPAIGN_ID]},
        "FieldNames": ["Id", "Name"]
    }
})
groups = {g['Id']: g['Name'] for g in result_groups.get('result', {}).get('AdGroups', [])}

# Map ads: determine which image goes to which ad
# Groups: "Документы и отчетность" -> doc, "Корпоративный трансфер" -> corp, "Договор и оплата по счету" -> contract
GROUP_PREFIX_MAP = {
    'Документы': 'doc',
    'Корпоратив': 'corp',
    'Договор': 'contract',
}

ad_image_map = []  # list of (ad_id, image_key)

for ad in ads:
    ad_id = ad['Id']
    group_id = ad['AdGroupId']
    group_name = groups.get(group_id, '')
    title = ad.get('TextAd', {}).get('Title', '')
    mobile = ad.get('TextAd', {}).get('Mobile', 'NO')
    current_hash = ad.get('TextAd', {}).get('AdImageHash', 'none')

    # Determine series prefix from group name
    prefix = None
    for key, val in GROUP_PREFIX_MAP.items():
        if key in group_name:
            prefix = val
            break

    if not prefix:
        print(f"  SKIP ad {ad_id} - can't match group '{group_name}'")
        continue

    # Determine size: check current image hash to figure out if wide or square
    # Wide ads were created first (lower IDs), square ads later (higher IDs)
    # Alternative: we have 2 ads per group, one with wide and one with square
    # Let's just assign based on ad order within group
    print(f"  Ad {ad_id}: group='{group_name}' prefix={prefix} title='{title}' hash={current_hash}")
    ad_image_map.append({
        'ad_id': ad_id,
        'group_id': group_id,
        'group_name': group_name,
        'prefix': prefix,
        'current_hash': current_hash,
    })

# Sort by ad_id to get consistent ordering (first = wide, second = square per group)
for prefix in ['doc', 'corp', 'contract']:
    group_ads = [a for a in ad_image_map if a['prefix'] == prefix]
    group_ads.sort(key=lambda x: x['ad_id'])
    if len(group_ads) >= 2:
        group_ads[0]['image_key'] = f"{prefix}_wide"
        group_ads[1]['image_key'] = f"{prefix}_square"
    elif len(group_ads) == 1:
        group_ads[0]['image_key'] = f"{prefix}_wide"

print(f"\nMapped {len(ad_image_map)} ads to images")
for a in ad_image_map:
    print(f"  Ad {a['ad_id']}: {a.get('image_key', 'UNMAPPED')}")


# Step 2: Upload images
print("\n" + "=" * 60)
print("STEP 2: Uploading images to Yandex Direct")
print("=" * 60)

image_hashes = {}

for key, filename in IMAGES.items():
    filepath = os.path.join(CREATIVES_DIR, filename)
    if not os.path.exists(filepath):
        print(f"  ERROR: File not found: {filepath}")
        continue

    with open(filepath, 'rb') as f:
        img_data = base64.b64encode(f.read()).decode()

    result = api_call('adimages', {
        "method": "add",
        "params": {
            "AdImages": [{
                "ImageData": img_data,
                "Name": f"b2b_text_{key}"
            }]
        }
    })

    if 'result' in result:
        for item in result['result'].get('AddResults', []):
            if 'AdImageHash' in item:
                image_hashes[key] = item['AdImageHash']
                print(f"  Uploaded {key}: hash={item['AdImageHash']}")
            elif 'Errors' in item:
                # Check if it's a duplicate - try to find existing
                for err in item['Errors']:
                    print(f"  Error {key}: {err.get('Message', '')} (Code: {err.get('Code', '')})")
                    # If duplicate, we need to find the hash
                    if err.get('Code') == 8800:
                        print(f"  Image already exists, getting hash...")
                        # Get all images and find by name
                        get_result = api_call('adimages', {
                            "method": "get",
                            "params": {
                                "SelectionCriteria": {},
                                "FieldNames": ["AdImageHash", "Name", "Associated"]
                            }
                        })
                        for img in get_result.get('result', {}).get('AdImages', []):
                            if img.get('Name') == f"b2b_text_{key}":
                                image_hashes[key] = img['AdImageHash']
                                print(f"  Found existing hash for {key}: {img['AdImageHash']}")
                                break
    else:
        print(f"  API Error for {key}: {json.dumps(result, ensure_ascii=False)}")

print(f"\nUploaded {len(image_hashes)} images")
for k, v in image_hashes.items():
    print(f"  {k}: {v}")


# Step 3: Update ads with new images
print("\n" + "=" * 60)
print("STEP 3: Updating ads with new images")
print("=" * 60)

updates = []
for ad_info in ad_image_map:
    image_key = ad_info.get('image_key')
    if not image_key or image_key not in image_hashes:
        print(f"  SKIP ad {ad_info['ad_id']}: no image hash for {image_key}")
        continue

    new_hash = image_hashes[image_key]
    if new_hash == ad_info['current_hash']:
        print(f"  SKIP ad {ad_info['ad_id']}: already has correct image")
        continue

    updates.append({
        "Id": ad_info['ad_id'],
        "TextAd": {
            "AdImageHash": new_hash
        }
    })
    print(f"  Will update ad {ad_info['ad_id']}: {image_key} -> {new_hash}")

if updates:
    result = api_call('ads', {
        "method": "update",
        "params": {
            "Ads": updates
        }
    })
    print(f"\nUpdate result: {json.dumps(result, indent=2, ensure_ascii=False)}")

    if 'result' in result:
        for item in result['result'].get('UpdateResults', []):
            if 'Id' in item:
                print(f"  Updated ad {item['Id']}")
            elif 'Errors' in item:
                print(f"  Error: {item['Errors']}")
else:
    print("  No updates needed")


# Step 4: Verify
print("\n" + "=" * 60)
print("STEP 4: Verification")
print("=" * 60)

result = api_call('ads', {
    "method": "get",
    "params": {
        "SelectionCriteria": {"CampaignIds": [CAMPAIGN_ID]},
        "FieldNames": ["Id", "AdGroupId", "State", "Status", "StatusClarification"],
        "TextAdFieldNames": ["Title", "AdImageHash"]
    }
})

for ad in result.get('result', {}).get('Ads', []):
    ad_id = ad['Id']
    group_name = groups.get(ad['AdGroupId'], '?')
    status = ad.get('Status', '?')
    state = ad.get('State', '?')
    clarification = ad.get('StatusClarification', '')
    title = ad.get('TextAd', {}).get('Title', '')
    img_hash = ad.get('TextAd', {}).get('AdImageHash', 'none')
    print(f"  Ad {ad_id} [{group_name}]: {status}/{state} hash={img_hash} '{title}' {clarification}")

print("\nDone!")
