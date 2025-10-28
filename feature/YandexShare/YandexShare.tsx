// components/YandexShare.js
'use client';

import { useEffect, useRef } from 'react';

const YandexShare = ({ 
  url = '',
  title = '',
  description = '',
  services = ['vkontakte', 'telegram', 'twitter', 'whatsapp']
}) => {
  const shareRef = useRef(null);

  useEffect(() => {
    // Устанавливаем URL по умолчанию
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    const loadYandexShare = () => {
      if (shareRef.current) {
        (shareRef.current as HTMLElement).innerHTML = `
          <div class="ya-share2" 
               data-curtain 
               data-size="l" 
               data-shape="round"
               data-limit="${services.length}"
               data-services="${services.join(',')}"
               data-url="${shareUrl}"
               data-title="${title}"
               data-description="${description}"></div>
        `;

        // Загружаем скрипт если еще не загружен
        if (!(window as any).Ya) {
          const script = document.createElement('script');
          script.src = 'https://yastatic.net/share2/share.js';
          script.async = true;
          document.head.appendChild(script);
        } else if ((window as any).Ya.share2 && shareRef.current && typeof shareRef.current === 'object' && 'querySelector' in shareRef.current) {
          // Переинициализируем если Ya.share2 уже доступен
          (window as any).Ya.share2((shareRef.current as HTMLElement).querySelector('.ya-share2') as HTMLElement);
        }
      }
    };

    loadYandexShare();
  }, [url, title, description, services]);

  return <div ref={shareRef} />;
};

export default YandexShare;