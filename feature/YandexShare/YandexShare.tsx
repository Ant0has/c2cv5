// components/YandexShare.js
'use client';

import { useEffect, useRef } from 'react';
import s from './YandexShare.module.scss';

declare global {
  interface Window {
    Ya?: {
      share2: (element: HTMLElement | null) => void;
    };
  }
}

const YandexShare = ({ 
  url = '',
  title = '',
  description = '',
  services = [
    'messenger','vkontakte','odnoklassniki','telegram','twitter','viber','whatsapp','moimir','pinterest'
  ]
}) => {
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    const loadYandexShare = () => {
      if (!shareRef.current) return;

      // Очищаем контейнер
      shareRef.current.innerHTML = '';

      // Создаем элемент для шаринга
      const shareElement = document.createElement('div');
      shareElement.className = 'ya-share2';
      shareElement.setAttribute('data-curtain', '');
      shareElement.setAttribute('data-size', 'l');
      shareElement.setAttribute('data-shape', 'round');
      shareElement.setAttribute('data-limit', services.length.toString());
      shareElement.setAttribute('data-services', services.join(','));
      shareElement.setAttribute('data-url', shareUrl);
      shareElement.setAttribute('data-title', title);
      shareElement.setAttribute('data-description', description);

      shareRef.current.appendChild(shareElement);

      // Если скрипт уже загружен, инициализируем сразу
      if (window.Ya?.share2) {
        window.Ya.share2(shareElement);
        return;
      }

      // Загружаем скрипт
      const scriptId = 'yandex-share-script';
      
      // Удаляем старый скрипт если есть
      const oldScript = document.getElementById(scriptId);
      if (oldScript) {
        oldScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://yastatic.net/share2/share.js';
      script.async = true;
      
      script.onload = () => {
        // Даем время скрипту на инициализацию
        setTimeout(() => {
          if (window.Ya?.share2 && shareRef.current) {
            const currentShareElement = shareRef.current.querySelector('.ya-share2');
            if (currentShareElement) {
              window.Ya.share2(currentShareElement as HTMLElement);
            }
          }
        }, 100);
      };

      script.onerror = () => {
        console.error('Failed to load Yandex Share script');
        if (shareRef.current) {
          shareRef.current.innerHTML = `
            <div style="border: 1px dashed #ccc; padding: 10px; text-align: center;">
              <p>Не удалось загрузить виджет шаринга</p>
            </div>
          `;
        }
      };

      document.head.appendChild(script);
    };

    loadYandexShare();

    // Очистка при размонтировании
    return () => {
      if (shareRef.current) {
        shareRef.current.innerHTML = '';
      }
    };
  }, [url, title, description, services]);

  return <div className={s.yandexShare} ref={shareRef} />;
};

export default YandexShare;