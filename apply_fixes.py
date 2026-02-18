# -*- coding: utf-8 -*-
"""
Скрипт исправления кампаний B2B:
1. Отключить автотаргетинг
2. Добавить минус-слова
3. Снизить ставки
"""

import requests
import json
from yandex_direct_api import YandexDirectAPI

api = YandexDirectAPI()

CAMPAIGN_HOT = 705839254   # B2B\Горячие
CAMPAIGN_GEO = 705839266   # B2B\Гео

# ========================================
# 1. ОТКЛЮЧИТЬ АВТОТАРГЕТИНГ
# ========================================
print("=" * 60)
print("1. ОТКЛЮЧЕНИЕ АВТОТАРГЕТИНГА")
print("=" * 60)

autotargeting_ids = [
    # B2B\Горячие
    205692933735, 205692933736, 205692933737,
    205692933738, 205692933739, 205692933740,
    # B2B\Гео
    205692933778, 205692933779, 205692933780,
    205692933781, 205692933782, 205692933783, 205692933784,
]

try:
    body = {
        "method": "suspend",
        "params": {
            "SelectionCriteria": {
                "Ids": autotargeting_ids
            }
        }
    }
    url = api.base_url + "keywords"
    resp = requests.post(url, headers=api.headers, json=body)
    result = resp.json()

    if "error" in result:
        print(f"  ОШИБКА: {result['error']}")
    else:
        print(f"  Приостановлено {len(autotargeting_ids)} автотаргетингов")
        print(f"  Кампания Горячие: 6 шт")
        print(f"  Кампания Гео: 7 шт")
except Exception as e:
    print(f"  ОШИБКА: {e}")


# ========================================
# 2. ДОБАВИТЬ МИНУС-СЛОВА
# ========================================
print()
print("=" * 60)
print("2. ДОБАВЛЕНИЕ МИНУС-СЛОВ")
print("=" * 60)

# Общий расширенный список минус-слов
NEGATIVE_KEYWORDS_COMMON = [
    # === Зарубежные направления ===
    "япония", "грузия", "черногория", "бангкок", "паттайя",
    "таиланд", "турция", "египет", "дубай", "кипр",
    "болгария", "тунис", "вьетнам", "индия", "китай",
    "абхазия", "гагры", "армения", "азербайджан", "узбекистан",
    "antalya", "transfer ucreti",

    # === Туристические/курортные ===
    "архыз", "шерегеш", "домбай", "теберда", "роза хутор",
    "курорт", "горнолыжный", "санаторий", "пансионат",

    # === Ценовые запросы (B2C индикатор) ===
    "сколько стоит", "стоимость", "тариф", "расценки",
    "прайс", "калькулятор стоимости",

    # === Транспорт/альтернативы ===
    "blablacar", "автобус", "автошкола", "аренда",
    "билет", "блаблакар", "вакансия", "википедия",
    "водитель", "вокзал", "газель", "грузовой",
    "грузоперевозки", "грузчики", "жд",
    "животные", "зарплата", "каршеринг",
    "курсы", "максим", "обучение",
    "переезд", "подработка", "поезд",
    "попутка", "приложение", "прокат",
    "работа", "расписание", "резюме", "рейтинг",
    "ситимобил", "скачать", "требуется",
    "убер", "устроиться", "форум", "фура",
    "электричка", "яндекс такси",

    # === Личные поводы ===
    "свадьба", "свадебный", "роддом", "похороны",
    "ритуальный", "выпускной", "банкет", "праздник",
    "вечеринка", "день рождения",

    # === Другое нерелевантное ===
    "бесплатно", "дешево", "недорого", "бюджетно",
    "подвезти", "попутчик", "частный", "эконом",
    "личный", "кошка", "собака", "море",
    "отдых", "отзывы", "отпуск", "туризм", "экскурсия",
    "детское кресло", "номера такси",
    "частный извоз", "донецк",
]

# Убираем дубликаты
negative_keywords = sorted(set(NEGATIVE_KEYWORDS_COMMON))

print(f"  Минус-слов в списке: {len(negative_keywords)}")

# Обновляем обе кампании
for campaign_id, name in [(CAMPAIGN_HOT, "B2B\\Горячие"), (CAMPAIGN_GEO, "B2B\\Гео")]:
    try:
        body = {
            "method": "update",
            "params": {
                "Campaigns": [{
                    "Id": campaign_id,
                    "NegativeKeywords": {
                        "Items": negative_keywords
                    }
                }]
            }
        }
        url = api.base_url + "campaigns"
        resp = requests.post(url, headers=api.headers, json=body)
        result = resp.json()

        if "error" in result:
            print(f"  {name}: ОШИБКА - {result['error']}")
        else:
            print(f"  {name}: установлено {len(negative_keywords)} минус-слов")
    except Exception as e:
        print(f"  {name}: ОШИБКА - {e}")


# ========================================
# 3. СНИЗИТЬ СТАВКИ
# ========================================
print()
print("=" * 60)
print("3. СНИЖЕНИЕ СТАВОК")
print("=" * 60)

# Получаем все ключевые слова (не автотаргетинг)
keywords = api.get_keywords(campaign_ids=[CAMPAIGN_HOT, CAMPAIGN_GEO])

# Новые ставки по категориям
BID_TIERS = {
    # Горячие B2B-ключи (документы, юрлица, НДС) — 35-40₽
    'hot': {
        'keywords': [
            'закрывающими документами', 'акт выполненных работ',
            'для юрлиц', 'для юридических лиц', 'с НДС',
            'счет фактура', 'оплата по счету', 'чек для бухгалтерии',
            'авансового отчета', 'чек с qr', 'безналичный расчет',
        ],
        'bid': 40000000,  # 40₽
    },
    # Корпоративные ключи — 30-35₽
    'corporate': {
        'keywords': [
            'корпоративн', 'для организаций', 'для бизнеса',
            'для сотрудников', 'для компании', 'корпоративных клиентов',
            'для командировок', 'командировочные', 'командировка',
        ],
        'bid': 35000000,  # 35₽
    },
    # Остальные — 25-30₽
    'default': {
        'bid': 30000000,  # 30₽
    }
}

new_bids = {}
changes_log = []

for kw in keywords:
    kw_id = kw['Id']
    keyword_text = kw.get('Keyword', '')
    current_bid = kw.get('Bid', 0)

    # Пропускаем автотаргетинг (уже приостановлен)
    if 'autotargeting' in keyword_text:
        continue

    # Определяем категорию
    new_bid = BID_TIERS['default']['bid']
    category = 'default'

    for tier_name in ['hot', 'corporate']:
        tier = BID_TIERS[tier_name]
        for pattern in tier['keywords']:
            if pattern.lower() in keyword_text.lower():
                new_bid = tier['bid']
                category = tier_name
                break
        if category != 'default':
            break

    if current_bid != new_bid:
        new_bids[kw_id] = new_bid
        changes_log.append({
            'keyword': keyword_text[:45],
            'old': current_bid / 1000000,
            'new': new_bid / 1000000,
            'category': category
        })

print(f"  Ключевых слов к изменению: {len(new_bids)}")
print()

# Выводим лог изменений
for item in sorted(changes_log, key=lambda x: x['category']):
    print(f"  [{item['category']:>10}] {item['keyword'][:40]:40} {item['old']:>5.0f}₽ → {item['new']:>5.0f}₽")

# Применяем
if new_bids:
    try:
        api.set_keyword_bids(new_bids)
        print(f"\n  Ставки обновлены: {len(new_bids)} ключей")
    except Exception as e:
        print(f"\n  ОШИБКА при обновлении ставок: {e}")


# ========================================
# ИТОГО
# ========================================
print()
print("=" * 60)
print("ИТОГО")
print("=" * 60)
print(f"  Автотаргетинг: отключён ({len(autotargeting_ids)} шт)")
print(f"  Минус-слова: {len(negative_keywords)} шт на каждую кампанию")
print(f"  Ставки снижены: {len(new_bids)} ключей")
print()
print("  Ожидаемый эффект:")
print("  - Экономия ~4500₽/5 дней за счёт отключения автотаргетинга")
print("  - Фильтрация нецелевого B2C трафика через минус-слова")
print("  - Снижение CPC с 54₽ до 30-40₽")
print("=" * 60)
