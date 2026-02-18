# Установка скрипта трекинга B2B

## Быстрая установка

Добавьте этот код **перед закрывающим тегом `</body>`** на странице `/dlya-biznesa`:

```html
<!-- C2C B2B Tracking -->
<script src="/js/b2b-tracking.min.js"></script>
```

Или вставьте код напрямую (inline):

```html
<!-- C2C B2B Tracking -->
<script>
!function(){"use strict";var e={counterId:36995060,debug:!1,page:"/dlya-biznesa"};function t(t,n){if("undefined"==typeof ym)return void(e.debug&&console.warn("[C2C] ym not found"));e.debug&&console.log("[C2C] Goal:",t,n||""),ym(e.counterId,"reachGoal",t,n||{})}function n(e,t,n){document.addEventListener(t,function(t){for(var o=t.target;o&&o!==document;){if(o.matches&&o.matches(e))return void n(t,o);o=o.parentNode}})}function o(t,n,o){var r=document.querySelector(t);r&&("IntersectionObserver"in window?new IntersectionObserver(function(e){e.forEach(function(e){e.isIntersecting&&(n(e.target),this.unobserve(e.target))}.bind(this))},o||{threshold:.5}).observe(r):n(r))}var r=window.location.pathname;if(r===e.page||r===e.page+"/"||0===r.indexOf(e.page)){function i(){document.querySelectorAll("form").forEach(function(e){e.addEventListener("submit",function(){t("b2b_form_submit",{form_location:"page"})})}),window.c2cTrackFormSubmit=function(e){t("b2b_form_submit",{form_location:e||"ajax"})},n("button, a.button, [role=button]","click",function(e,n){var o=(n.textContent||n.innerText||"").trim().toLowerCase();-1===o.indexOf("получить предложение")&&-1===o.indexOf("получить расчёт")&&-1===o.indexOf("получить расчет")||t("b2b_cta_offer",{button_text:o}),-1!==o.indexOf("рассчитать свой маршрут")&&t("b2b_calc_route")}),n("button","click",function(e,n){if("рассчитать"===(n.textContent||n.innerText||"").trim().toLowerCase()){var o=document.querySelector('input[placeholder*="откуда"], input[placeholder*="Откуда"], input[name*="from"]'),r=document.querySelector('input[placeholder*="куда"], input[placeholder*="Куда"], input[name*="to"]');t("b2b_calc_used",{from:o?o.value:"",to:r?r.value:""})}}),n('a[href^="tel:"]',"click",function(e,n){t("b2b_phone_click",{phone:n.href.replace("tel:","")})}),n('a[href^="mailto:"]',"click",function(e,n){t("b2b_email_click",{email:n.href.replace("mailto:","").split("?")[0]})}),n('a[href*="t.me"], a[href*="telegram"]',"click",function(){t("b2b_telegram_click"),t("b2b_messenger_click",{messenger:"telegram"})}),n('a[href*="wa.me"], a[href*="whatsapp"]',"click",function(){t("b2b_whatsapp_click"),t("b2b_messenger_click",{messenger:"whatsapp"})}),n('a[href*="vk.me"], a[href*="max.ru"]',"click",function(){t("b2b_messenger_click",{messenger:"vk"})});var r={};n('button, [role="button"], summary, .faq-item, .accordion-header',"click",function(e,n){var o=(n.textContent||n.innerText||"").trim();if(-1!==o.indexOf("?")&&o.length>15&&o.length<200){var i=o.substring(0,30);r[i]||(r[i]=!0,t("b2b_faq_opened",{question:o.substring(0,50)}))}}),o("form, .contact-form, #contact-form",function(){t("b2b_scroll_form")},{threshold:.3}),e.debug&&console.log("[C2C] Ready")}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",i):i(),window.c2cTracking={sendGoal:t,debug:function(t){e.debug=!1!==t,console.log("[C2C] Debug:",e.debug?"ON":"OFF")}}}}();
</script>
```

---

## Файлы

| Файл | Назначение | Размер |
|------|------------|--------|
| `b2b-tracking.js` | Полная версия с комментариями | ~8 KB |
| `b2b-tracking.min.js` | Минифицированная для продакшена | ~3 KB |

---

## Тестирование

### 1. Включить debug-режим

В консоли браузера:
```javascript
c2cTracking.debug(true);
```

### 2. Проверить события

Выполните действия на странице:
- Кликните по телефону
- Нажмите "Получить предложение"
- Используйте калькулятор

В консоли должны появиться сообщения:
```
[C2C] Goal: b2b_phone_click {phone: "+79381568757"}
[C2C] Goal: b2b_cta_offer {button_text: "получить предложение"}
```

### 3. Проверить в Метрике

Метрика → Отчёты → Стандартные → **В реальном времени**

---

## Для AJAX-форм

Если форма отправляется через JavaScript без перезагрузки:

```javascript
// После успешной отправки формы вызовите:
window.c2cTrackFormSubmit('hero');  // или 'footer', 'popup' и т.д.
```

---

## Ручная отправка целей

```javascript
// Отправить любую цель вручную:
c2cTracking.sendGoal('b2b_custom_event', { param: 'value' });
```

---

## Цели для создания в Метрике

| Идентификатор | Название | Тип |
|---------------|----------|-----|
| `b2b_form_submit` | B2B: Форма отправлена | JavaScript-событие |
| `b2b_cta_offer` | B2B: Клик «Получить предложение» | JavaScript-событие |
| `b2b_calc_used` | B2B: Калькулятор использован | JavaScript-событие |
| `b2b_calc_route` | B2B: Клик «Рассчитать маршрут» | JavaScript-событие |
| `b2b_phone_click` | B2B: Клик по телефону | JavaScript-событие |
| `b2b_email_click` | B2B: Клик по email | JavaScript-событие |
| `b2b_telegram_click` | B2B: Клик в Telegram | JavaScript-событие |
| `b2b_whatsapp_click` | B2B: Клик в WhatsApp | JavaScript-событие |
| `b2b_messenger_click` | B2B: Клик в мессенджер | JavaScript-событие |
| `b2b_faq_opened` | B2B: FAQ раскрыт | JavaScript-событие |
| `b2b_scroll_form` | B2B: Скролл до формы | JavaScript-событие |

---

## После создания целей в Метрике

Когда цели созданы, нужно привязать их к кампаниям Директа. Напишите мне ID целей — я настрою PriorityGoals.
