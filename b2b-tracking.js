/**
 * Трекинг целей для страницы /dlya-biznesa
 * city2city.ru
 *
 * Счётчик: 36995060
 * Версия: 1.0.0
 * Дата: 21.01.2026
 */
(function() {
  'use strict';

  // =====================================================
  // КОНФИГУРАЦИЯ
  // =====================================================

  var CONFIG = {
    counterId: 36995060,
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
      if (CONFIG.debug) {
        console.warn('[C2C Tracking] ym not found');
      }
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
    var path = window.location.pathname;
    return path === CONFIG.page ||
           path === CONFIG.page + '/' ||
           path.indexOf(CONFIG.page) === 0;
  }

  /**
   * Делегирование событий
   */
  function delegate(selector, event, handler) {
    document.addEventListener(event, function(e) {
      var target = e.target;
      while (target && target !== document) {
        if (target.matches && target.matches(selector)) {
          handler(e, target);
          return;
        }
        target = target.parentNode;
      }
    });
  }

  /**
   * Intersection Observer для скролла
   */
  function onElementVisible(selector, callback, options) {
    var element = document.querySelector(selector);
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback для старых браузеров
      callback(element);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
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
    var forms = document.querySelectorAll('form');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        sendGoal('b2b_form_submit', {
          form_location: 'page'
        });
      });
    });

    // Для AJAX-форм: глобальная функция
    window.c2cTrackFormSubmit = function(location) {
      sendGoal('b2b_form_submit', {
        form_location: location || 'ajax'
      });
    };
  }

  // =====================================================
  // ТРЕКИНГ CTA-КНОПОК
  // =====================================================

  function trackCTAButtons() {
    delegate('button, a.button, [role="button"]', 'click', function(e, btn) {
      var text = (btn.textContent || btn.innerText || '').trim().toLowerCase();

      // Кнопки "Получить предложение"
      if (text.indexOf('получить предложение') !== -1 ||
          text.indexOf('получить расчёт') !== -1 ||
          text.indexOf('получить расчет') !== -1) {
        sendGoal('b2b_cta_offer', {
          button_text: text
        });
      }

      // Кнопка "Рассчитать свой маршрут"
      if (text.indexOf('рассчитать свой маршрут') !== -1) {
        sendGoal('b2b_calc_route');
      }
    });
  }

  // =====================================================
  // ТРЕКИНГ КАЛЬКУЛЯТОРА
  // =====================================================

  function trackCalculator() {
    delegate('button', 'click', function(e, btn) {
      var text = (btn.textContent || btn.innerText || '').trim().toLowerCase();

      // Кнопка "Рассчитать" в калькуляторе (точное совпадение)
      if (text === 'рассчитать') {
        var fromInput = document.querySelector('input[placeholder*="откуда"], input[placeholder*="Откуда"], input[name*="from"]');
        var toInput = document.querySelector('input[placeholder*="куда"], input[placeholder*="Куда"], input[name*="to"]');

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
        email: link.href.replace('mailto:', '').split('?')[0]
      });
    });

    // Клик в Telegram
    delegate('a[href*="t.me"], a[href*="telegram"]', 'click', function(e, link) {
      sendGoal('b2b_telegram_click');
      sendGoal('b2b_messenger_click', { messenger: 'telegram' });
    });

    // Клик в WhatsApp
    delegate('a[href*="wa.me"], a[href*="whatsapp"]', 'click', function(e, link) {
      sendGoal('b2b_whatsapp_click');
      sendGoal('b2b_messenger_click', { messenger: 'whatsapp' });
    });

    // Клик в VK/Max
    delegate('a[href*="vk.me"], a[href*="max.ru"]', 'click', function(e, link) {
      sendGoal('b2b_messenger_click', { messenger: 'vk' });
    });
  }

  // =====================================================
  // ТРЕКИНГ FAQ
  // =====================================================

  function trackFAQ() {
    var faqTracked = {};

    delegate('button, [role="button"], summary, .faq-item, .accordion-header', 'click', function(e, btn) {
      var text = (btn.textContent || btn.innerText || '').trim();

      // FAQ вопросы содержат "?"
      if (text.indexOf('?') !== -1 && text.length > 15 && text.length < 200) {
        var key = text.substring(0, 30);

        // Отправляем только первый раз
        if (!faqTracked[key]) {
          faqTracked[key] = true;
          sendGoal('b2b_faq_opened', {
            question: text.substring(0, 50)
          });
        }
      }
    });
  }

  // =====================================================
  // ТРЕКИНГ СКРОЛЛА
  // =====================================================

  function trackScroll() {
    // Скролл до формы
    onElementVisible('form, .contact-form, #contact-form', function(element) {
      sendGoal('b2b_scroll_form');
    }, { threshold: 0.3 });
  }

  // =====================================================
  // ИНИЦИАЛИЗАЦИЯ
  // =====================================================

  function init() {
    if (!isTargetPage()) {
      if (CONFIG.debug) {
        console.log('[C2C Tracking] Not target page:', window.location.pathname);
      }
      return;
    }

    if (CONFIG.debug) {
      console.log('[C2C Tracking] Initializing for', CONFIG.page);
    }

    // Ждём загрузки DOM
    function start() {
      trackForm();
      trackCTAButtons();
      trackCalculator();
      trackContacts();
      trackFAQ();
      trackScroll();

      if (CONFIG.debug) {
        console.log('[C2C Tracking] Ready');
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  // Запуск
  init();

  // Экспорт для ручного вызова
  window.c2cTracking = {
    sendGoal: sendGoal,
    debug: function(enable) {
      CONFIG.debug = enable !== false;
      console.log('[C2C Tracking] Debug:', CONFIG.debug ? 'ON' : 'OFF');
    }
  };

})();
