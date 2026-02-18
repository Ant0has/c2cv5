# Техническое задание: Настройка целей Яндекс.Метрики для city2city B2B

**Проект:** city2city.ru  
**Страница:** /dlya-biznesa  
**Дата:** 21 января 2026  

---

## 1. Обзор конверсионных точек на странице

### Анализ страницы /dlya-biznesa

| Элемент | Тип | Расположение | Приоритет |
|---------|-----|--------------|-----------|
| Форма «Получить расчёт» | Лид-форма | Первый экран | Высший |
| Кнопки «Получить предложение» | CTA | Два блока внизу | Высший |
| Калькулятор маршрута | Интерактив | Середина страницы | Высокий |
| Кнопка «Рассчитать свой маршрут» | CTA | После популярных маршрутов | Средний |
| Клик по телефону | Контакт | Шапка + футер + CTA-блоки | Высокий |
| Клик по email | Контакт | Шапка + футер + CTA-блоки | Средний |
| Клик в Telegram | Мессенджер | Шапка + футер + CTA-блоки | Высокий |
| Клик в WhatsApp | Мессенджер | Шапка + футер + CTA-блоки | Высокий |
| Клик в VK/Max | Мессенджер | Шапка + футер + CTA-блоки | Низкий |
| Раскрытие FAQ | Вовлечённость | Блок «Частые вопросы» | Низкий |
| Скролл до формы | Вовлечённость | — | Низкий |

---

## 2. Структура целей

### 2.1. Макроконверсии (для оптимизации Директа)

| ID цели | Название | Тип | Условие |
|---------|----------|-----|---------|
| `b2b_form_submit` | B2B: Форма отправлена | JavaScript-событие | Успешная отправка формы |
| `b2b_cta_offer` | B2B: Клик «Получить предложение» | JavaScript-событие | Клик по CTA-кнопке |
| `b2b_deal_closed` | B2B: Сделка закрыта | Офлайн-конверсия | Из CRM |

### 2.2. Микроконверсии (сигналы вовлечённости)

| ID цели | Название | Тип | Условие |
|---------|----------|-----|---------|
| `b2b_calc_used` | B2B: Калькулятор использован | JavaScript-событие | Клик «Рассчитать» |
| `b2b_calc_route` | B2B: Клик «Рассчитать свой маршрут» | JavaScript-событие | Клик по кнопке |
| `b2b_phone_click` | B2B: Клик по телефону | JavaScript-событие | Клик по `tel:` ссылке |
| `b2b_email_click` | B2B: Клик по email | JavaScript-событие | Клик по `mailto:` ссылке |
| `b2b_telegram_click` | B2B: Клик в Telegram | JavaScript-событие | Клик по ссылке t.me |
| `b2b_whatsapp_click` | B2B: Клик в WhatsApp | JavaScript-событие | Клик по ссылке wa.me |
| `b2b_messenger_click` | B2B: Клик в мессенджер | JavaScript-событие | Любой мессенджер |
| `b2b_faq_opened` | B2B: FAQ раскрыт | JavaScript-событие | Клик по вопросу |
| `b2b_scroll_form` | B2B: Скролл до формы | JavaScript-событие | Форма попала во viewport |

### 2.3. Составная цель (для Директа при малом трафике)

| ID цели | Название | Состав |
|---------|----------|--------|
| `b2b_composite` | B2B: Составная конверсия | См. раздел 5 |

---

## 3. JavaScript-код для отслеживания событий

### 3.1. Основной скрипт трекинга

**Файл:** `b2b-tracking.js`

```javascript
/**
 * Трекинг целей для страницы /dlya-biznesa
 * city2city.ru
 */
(function() {
  'use strict';
  
  // =====================================================
  // КОНФИГУРАЦИЯ
  // =====================================================
  
  const CONFIG = {
    counterId: 36995060, // Счётчик city2city.ru
    debug: false,      // true для отладки в консоли
    page: '/dlya-biznesa'
  };
  
  // =====================================================
  // УТИЛИТЫ
  // =====================================================
  
  /**
   * Отправка цели в Метрику
   */
  function sendGoal(goalId, params) {
    if (typeof ym === 'undefined') {
      console.warn('[C2C Tracking] ym not found');
      return;
    }
    
    if (CONFIG.debug) {
      console.log('[C2C Tracking] Goal:', goalId, params || '');
    }
    
    ym(CONFIG.counterId, 'reachGoal', goalId, params || {});
  }
  
  /**
   * Проверка, что мы на нужной странице
   */
  function isTargetPage() {
    return window.location.pathname === CONFIG.page || 
           window.location.pathname === CONFIG.page + '/';
  }
  
  /**
   * Делегирование событий
   */
  function delegate(selector, event, handler) {
    document.addEventListener(event, function(e) {
      const target = e.target.closest(selector);
      if (target) {
        handler(e, target);
      }
    });
  }
  
  /**
   * Intersection Observer для скролла
   */
  function onElementVisible(selector, callback, options) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options || { threshold: 0.5 });
    
    observer.observe(element);
  }
  
  // =====================================================
  // ТРЕКИНГ ФОРМЫ
  // =====================================================
  
  function trackForm() {
    const form = document.querySelector('form');
    if (!form) return;
    
    // Вариант 1: Перехват submit
    form.addEventListener('submit', function(e) {
      sendGoal('b2b_form_submit', {
        form_location: 'hero'
      });
    });
    
    // Вариант 2: Если форма отправляется через AJAX
    // Нужно вызвать sendGoal('b2b_form_submit') в callback успешной отправки
  }
  
  // =====================================================
  // ТРЕКИНГ CTA-КНОПОК
  // =====================================================
  
  function trackCTAButtons() {
    // Кнопки "Получить предложение"
    delegate('button', 'click', function(e, btn) {
      const text = btn.textContent.trim().toLowerCase();
      
      if (text.includes('получить предложение')) {
        sendGoal('b2b_cta_offer', {
          button_text: btn.textContent.trim()
        });
      }
      
      if (text.includes('рассчитать свой маршрут')) {
        sendGoal('b2b_calc_route');
      }
    });
  }
  
  // =====================================================
  // ТРЕКИНГ КАЛЬКУЛЯТОРА
  // =====================================================
  
  function trackCalculator() {
    delegate('button', 'click', function(e, btn) {
      const text = btn.textContent.trim().toLowerCase();
      
      // Кнопка "Рассчитать" в калькуляторе (не "Рассчитать свой маршрут")
      if (text === 'рассчитать') {
        // Получаем значения полей
        const fromInput = document.querySelector('input[placeholder="Москва"], [aria-label*="отправления"] input');
        const toInput = document.querySelector('input[placeholder="Нижний Новгород"], [aria-label*="прибытия"] input');
        
        sendGoal('b2b_calc_used', {
          from: fromInput ? fromInput.value : '',
          to: toInput ? toInput.value : ''
        });
      }
    });
  }
  
  // =====================================================
  // ТРЕКИНГ КОНТАКТОВ
  // =====================================================
  
  function trackContacts() {
    // Клик по телефону
    delegate('a[href^="tel:"]', 'click', function(e, link) {
      sendGoal('b2b_phone_click', {
        phone: link.href.replace('tel:', '')
      });
    });
    
    // Клик по email
    delegate('a[href^="mailto:"]', 'click', function(e, link) {
      sendGoal('b2b_email_click', {
        email: link.href.replace('mailto:', '')
      });
    });
    
    // Клик в Telegram
    delegate('a[href*="t.me"]', 'click', function(e, link) {
      sendGoal('b2b_telegram_click');
      sendGoal('b2b_messenger_click', { messenger: 'telegram' });
    });
    
    // Клик в WhatsApp
    delegate('a[href*="wa.me"]', 'click', function(e, link) {
      sendGoal('b2b_whatsapp_click');
      sendGoal('b2b_messenger_click', { messenger: 'whatsapp' });
    });
    
    // Клик в VK/Max
    delegate('a[href*="max.ru"]', 'click', function(e, link) {
      sendGoal('b2b_messenger_click', { messenger: 'vk_max' });
    });
  }
  
  // =====================================================
  // ТРЕКИНГ FAQ
  // =====================================================
  
  function trackFAQ() {
    // Поиск кнопок FAQ (аккордеон)
    const faqButtons = document.querySelectorAll('button');
    
    faqButtons.forEach(function(btn) {
      const text = btn.textContent.trim();
      
      // FAQ вопросы содержат "?"
      if (text.includes('?') && text.length > 20) {
        btn.addEventListener('click', function() {
          sendGoal('b2b_faq_opened', {
            question: text.substring(0, 50)
          });
        }, { once: true }); // Только первый раз
      }
    });
  }
  
  // =====================================================
  // ТРЕКИНГ СКРОЛЛА
  // =====================================================
  
  function trackScroll() {
    // Скролл до формы
    onElementVisible('form', function(element) {
      sendGoal('b2b_scroll_form');
    }, { threshold: 0.3 });
    
    // Скролл до блока "Как это работает"
    onElementVisible('h2:contains("Как это работает"), [class*="how-it-works"]', function() {
      sendGoal('b2b_scroll_how_it_works');
    });
  }
  
  // =====================================================
  // ИНИЦИАЛИЗАЦИЯ
  // =====================================================
  
  function init() {
    if (!isTargetPage()) {
      if (CONFIG.debug) {
        console.log('[C2C Tracking] Not target page, skipping');
      }
      return;
    }
    
    if (CONFIG.debug) {
      console.log('[C2C Tracking] Initializing for', CONFIG.page);
    }
    
    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        trackForm();
        trackCTAButtons();
        trackCalculator();
        trackContacts();
        trackFAQ();
        trackScroll();
      });
    } else {
      trackForm();
      trackCTAButtons();
      trackCalculator();
      trackContacts();
      trackFAQ();
      trackScroll();
    }
  }
  
  init();
  
})();
```

### 3.2. Альтернатива: Трекинг через data-атрибуты

Если удобнее добавлять атрибуты в HTML:

```html
<!-- Пример разметки -->
<button data-goal="b2b_cta_offer" data-goal-params='{"location":"footer"}'>
  Получить предложение
</button>

<a href="tel:+79381568757" data-goal="b2b_phone_click">
  +7 (938) 156-87-57
</a>
```

```javascript
/**
 * Универсальный трекер по data-атрибутам
 */
(function() {
  const COUNTER_ID = 36995060;
  
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-goal]');
    if (!target) return;
    
    const goalId = target.getAttribute('data-goal');
    let params = {};
    
    try {
      const paramsAttr = target.getAttribute('data-goal-params');
      if (paramsAttr) {
        params = JSON.parse(paramsAttr);
      }
    } catch (err) {}
    
    if (typeof ym !== 'undefined') {
      ym(COUNTER_ID, 'reachGoal', goalId, params);
    }
  });
})();
```

---

## 4. Настройка целей в интерфейсе Метрики

### 4.1. Пошаговая инструкция

1. Войти в Яндекс.Метрику
2. Выбрать счётчик city2city.ru
3. Перейти: **Настройка → Цели → Добавить цель**

### 4.2. Конфигурация каждой цели

#### Макроконверсии

**Цель 1: B2B: Форма отправлена**
```
Тип: JavaScript-событие
Идентификатор: b2b_form_submit
Ретаргетинг: ✓ Включить
```

**Цель 2: B2B: Клик «Получить предложение»**
```
Тип: JavaScript-событие
Идентификатор: b2b_cta_offer
Ретаргетинг: ✓ Включить
```

**Цель 3: B2B: Сделка закрыта**
```
Тип: Офлайн-конверсия
Идентификатор: b2b_deal_closed
Ретаргетинг: ✗ Выключить
```

#### Микроконверсии

**Цель 4: B2B: Калькулятор использован**
```
Тип: JavaScript-событие
Идентификатор: b2b_calc_used
Ретаргетинг: ✓ Включить
```

**Цель 5: B2B: Клик «Рассчитать маршрут»**
```
Тип: JavaScript-событие
Идентификатор: b2b_calc_route
Ретаргетинг: ✓ Включить
```

**Цель 6: B2B: Клик по телефону**
```
Тип: JavaScript-событие
Идентификатор: b2b_phone_click
Ретаргетинг: ✓ Включить
```

**Цель 7: B2B: Клик по email**
```
Тип: JavaScript-событие
Идентификатор: b2b_email_click
Ретаргетинг: ✗ Выключить
```

**Цель 8: B2B: Клик в Telegram**
```
Тип: JavaScript-событие
Идентификатор: b2b_telegram_click
Ретаргетинг: ✓ Включить
```

**Цель 9: B2B: Клик в WhatsApp**
```
Тип: JavaScript-событие
Идентификатор: b2b_whatsapp_click
Ретаргетинг: ✓ Включить
```

**Цель 10: B2B: Клик в мессенджер (общая)**
```
Тип: JavaScript-событие
Идентификатор: b2b_messenger_click
Ретаргетинг: ✓ Включить
```

**Цель 11: B2B: FAQ раскрыт**
```
Тип: JavaScript-событие
Идентификатор: b2b_faq_opened
Ретаргетинг: ✗ Выключить
```

**Цель 12: B2B: Скролл до формы**
```
Тип: JavaScript-событие
Идентификатор: b2b_scroll_form
Ретаргетинг: ✗ Выключить
```

---

## 5. Составная цель для Яндекс.Директ

### 5.1. Зачем нужна

При малом количестве конверсий (<10 в неделю) алгоритму Директа не хватает данных для обучения. Составная цель объединяет макро- и микроконверсии с весами.

### 5.2. Настройка в Метрике

**Настройка → Цели → Добавить цель → Составная цель**

```
Название: B2B: Составная конверсия
Идентификатор: b2b_composite

Шаги (любой из):
┌─────────────────────────────┬───────┐
│ Цель                        │ Вес   │
├─────────────────────────────┼───────┤
│ b2b_form_submit             │ 10    │
│ b2b_cta_offer               │ 10    │
│ b2b_phone_click             │ 5     │
│ b2b_telegram_click          │ 4     │
│ b2b_whatsapp_click          │ 4     │
│ b2b_calc_used               │ 2     │
│ b2b_calc_route              │ 2     │
│ b2b_scroll_form             │ 1     │
└─────────────────────────────┴───────┘
```

### 5.3. Логика весов

| Вес | Обоснование |
|-----|-------------|
| 10 | Явное намерение оставить заявку |
| 5 | Готовность к прямому контакту |
| 4 | Предпочтение мессенджера (высокая конверсия в лид) |
| 2 | Интерес к расчёту стоимости |
| 1 | Базовое вовлечение |

---

## 6. Рекомендации по использованию в Яндекс.Директ

### 6.1. Выбор цели для оптимизации

| Ситуация | Рекомендуемая цель |
|----------|-------------------|
| >20 конверсий/неделю | `b2b_form_submit` или `b2b_deal_closed` |
| 10-20 конверсий/неделю | `b2b_composite` |
| <10 конверсий/неделю | `b2b_composite` или оптимизация на клики |

### 6.2. Настройка стратегии Директа

**Для B2B трафика рекомендую:**

```
Стратегия: Оптимизация конверсий
Оплата: За клики
Цель: b2b_composite (или b2b_form_submit при достаточном объёме)
Модель атрибуции: Последний переход из Директа
Ограничение: Недельный бюджет

Период обучения: 2-3 недели
Минимум данных: 10-20 конверсий для начала оптимизации
```

### 6.3. Модели атрибуции

| Модель | Когда использовать |
|--------|-------------------|
| Последний переход | Короткий цикл сделки, импульсные покупки |
| Последний значимый | B2B с длинным циклом, много касаний |
| Первый переход | Важно привлечение новых клиентов |

**Для city2city B2B:** Начать с «Последний переход», через месяц сравнить с «Последний значимый».

### 6.4. Сегментация кампаний

Рекомендую разделить кампании по интенту:

| Кампания | Примеры запросов | Цель оптимизации |
|----------|-----------------|------------------|
| Горячий спрос | «корпоративное такси договор», «трансфер для юрлиц» | b2b_form_submit |
| Средний спрос | «междугороднее такси для сотрудников» | b2b_composite |
| Широкий охват | «такси москва санкт-петербург» | b2b_calc_used |

---

## 7. Сегменты для ретаргетинга

### 7.1. Рекомендуемые сегменты

Создать в **Метрика → Сегменты**:

| Сегмент | Условие | Использование |
|---------|---------|---------------|
| B2B: Горячие | Достигли `b2b_form_submit` или `b2b_cta_offer` | Исключить из рекламы |
| B2B: Тёплые | Достигли `b2b_calc_used` + НЕ достигли `b2b_form_submit` | Ретаргетинг |
| B2B: Звонившие | Достигли `b2b_phone_click` | Ретаргетинг (напоминание) |
| B2B: Мессенджеры | Достигли `b2b_messenger_click` | Исключить (уже в воронке) |

### 7.2. Настройка ретаргетинга в Директе

1. Создать условие ретаргетинга на основе сегмента «B2B: Тёплые»
2. Создать отдельную кампанию с корректировкой ставки +50%
3. Использовать более агрессивные объявления: «Рассчитали маршрут? Получите скидку 10% на первую поездку»

---

## 8. Тестирование целей

### 8.1. Проверка в реальном времени

1. Открыть Метрику → Отчёты → Стандартные → В реальном времени
2. В соседней вкладке открыть `/dlya-biznesa`
3. Выполнить действия (клик по телефону, заполнение калькулятора и т.д.)
4. Убедиться, что цели фиксируются

### 8.2. Отладка через консоль

Включить debug-режим в скрипте:
```javascript
const CONFIG = {
  debug: true,
  // ...
};
```

В консоли браузера должны появляться сообщения:
```
[C2C Tracking] Goal: b2b_phone_click {phone: "+79381568757"}
```

### 8.3. Проверка через Яндекс.Метрика Tag Assistant

1. Установить расширение [Яндекс.Метрика Tag Assistant](https://chrome.google.com/webstore/detail/yandex-metrica-tag-assist)
2. Открыть `/dlya-biznesa`
3. Выполнить действия
4. Проверить, что события отправляются

### 8.4. Чек-лист тестирования

- [ ] Отправка формы → `b2b_form_submit` зафиксирована
- [ ] Клик «Получить предложение» → `b2b_cta_offer` зафиксирована
- [ ] Клик «Рассчитать» в калькуляторе → `b2b_calc_used` зафиксирована
- [ ] Клик «Рассчитать свой маршрут» → `b2b_calc_route` зафиксирована
- [ ] Клик по телефону → `b2b_phone_click` зафиксирована
- [ ] Клик по email → `b2b_email_click` зафиксирована
- [ ] Клик в Telegram → `b2b_telegram_click` + `b2b_messenger_click` зафиксированы
- [ ] Клик в WhatsApp → `b2b_whatsapp_click` + `b2b_messenger_click` зафиксированы
- [ ] Раскрытие FAQ → `b2b_faq_opened` зафиксирована
- [ ] Скролл до формы → `b2b_scroll_form` зафиксирована (один раз)

---

## 9. Мониторинг и отчётность

### 9.1. Еженедельный отчёт

Настроить в Метрике автоматическую отправку:

**Метрика → Отчёты → Конверсии → Цели → Сохранить → Настроить рассылку**

Включить:
- Количество достижений по каждой цели
- Конверсия (%)
- Источники трафика

### 9.2. Ключевые метрики для отслеживания

| Метрика | Формула | Целевое значение |
|---------|---------|------------------|
| CR формы | b2b_form_submit / Визиты | >2% |
| CR калькулятора | b2b_calc_used / Визиты | >5% |
| Доля мессенджеров | b2b_messenger_click / (phone + email + messenger) | Отслеживать динамику |
| Стоимость лида | Расход Директа / b2b_form_submit | Зависит от маржи |

---

## 10. Файлы для внедрения

```
/project
├── js/
│   └── b2b-tracking.js           # Основной скрипт трекинга
├── docs/
│   └── metrika-goals-config.md   # Этот документ
```

---

## 11. Приоритет внедрения

| Приоритет | Задача | Время |
|-----------|--------|-------|
| 1 | Создать цели в интерфейсе Метрики | 15 мин |
| 2 | Подключить b2b-tracking.js на страницу | 10 мин |
| 3 | Протестировать все события | 20 мин |
| 4 | Создать составную цель | 10 мин |
| 5 | Настроить ретаргетинг-сегменты | 15 мин |
| 6 | Привязать цели к Директу | 10 мин |

**Общее время:** ~1.5 часа

---

## 12. Дополнительные рекомендации

### 12.1. Коллтрекинг

Для более точного отслеживания звонков рекомендую подключить коллтрекинг (Calltouch, CoMagic, Roistat). Это позволит:
- Фиксировать реальные звонки, а не только клики
- Записывать разговоры
- Передавать данные о звонках в Метрику как офлайн-конверсии

### 12.2. Чат-боты мессенджеров

Если используются боты в Telegram/WhatsApp, настроить передачу событий:
- Начало диалога → `b2b_chat_started`
- Квалификация лида → `b2b_chat_qualified`

### 12.3. Тепловые карты

Включить в Метрике Вебвизор и карту кликов для анализа:
- Где пользователи кликают
- Доскролливают ли до формы
- Какие элементы отвлекают внимание

---

## 13. Контакты и ресурсы

- **Справка по целям:** https://yandex.ru/support/metrica/general/goals.html
- **JavaScript API:** https://yandex.ru/support/metrica/code/counter-js-api.html
- **Составные цели:** https://yandex.ru/support/metrica/general/composite-goal.html
- **Офлайн-конверсии:** https://yandex.ru/support/metrica/data/offline-conversion.html
