'use client'

import { useEffect } from "react";
import Script from "next/script";
import { ConfigProvider } from "antd"
import { YMaps } from "@pbe/react-yandex-maps"
import { Blocks } from "@/shared/types/enums"
import { IRouteData } from "@/shared/types/route.interface"
import { IMailRequest, IRegion } from "@/shared/types/types"
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react"
import { tokens } from "../shared/styles/style-tokens"

interface ProvidersProps extends PropsWithChildren {
	regions: IRegion[]
}
interface IQuestionModalData {
	status: boolean,
	blockFrom: Blocks | null
}

export interface IOrderModalData extends IMailRequest {
	status: boolean,
}
interface ModalContextProps {
	questionModalData: IQuestionModalData,
	setQuestionModalData: Dispatch<SetStateAction<IQuestionModalData>>

	orderModalData: IOrderModalData,
	setOrderModalData: Dispatch<SetStateAction<IOrderModalData>>
}

interface RouteContextProps {
	route: IRouteData
	setRoute: Dispatch<SetStateAction<IRouteData>>
}

export const RegionsContext = createContext<IRegion[]>([])

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

export const RouteContext = createContext<RouteContextProps>({} as RouteContextProps)

export function Providers({ children, regions }: ProvidersProps) {
	const [questionModalData, setQuestionModalData] = useState<IQuestionModalData>({
		status: false,
		blockFrom: null
	})
	const [orderModalData, setOrderModalData] = useState<IOrderModalData>({ status: false })
	const [route, setRoute] = useState<IRouteData>({} as IRouteData)

	return (
		<YMaps query={{
			apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY
		}}>
			<ConfigProvider
				wave={{ disabled: true }}
				theme={{
					components: tokens.components,
					token: tokens.token
				}}
			>
				<RegionsContext.Provider value={regions}>
					<RouteContext.Provider value={{
						route,
						setRoute
					}}>
						<ModalContext.Provider value={{
							questionModalData,
							setQuestionModalData,

							orderModalData,
							setOrderModalData
						}}>
							{children}
						</ModalContext.Provider>
					</RouteContext.Provider>
				</RegionsContext.Provider>
			</ConfigProvider >
		</YMaps>
	)
}

declare global {
  interface Window {
    ym: YandexMetrikaFunction;
    initialReferrer?: string;
    yandexMetrikaCallback?: () => void;
  }
}

type YandexMetrikaFunction = (
  counterId: string | number,
  method: string,
  ...args: any[]
) => void;

interface YandexMetrikaInitParams {
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean | number;
  webvisor?: boolean;
  ecommerce?: string | boolean | any[];
  trackHash?: boolean;
  triggerEvent?: boolean;
  ut?: string;
  params?: boolean | any[];
}

interface YandexMetrikaHitOptions {
  referer?: string;
  title?: string;
  utm?: string;
}

export const YandexMetrikaWrapper = (): JSX.Element => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const yandexId = process.env.NEXT_PUBLIC_YANDEX_ID || '';
  const [isYmReady, setIsYmReady] = useState<boolean>(false);

  // Сохраняем исходный referrer при первой загрузке
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.initialReferrer) {
      window.initialReferrer = document.referrer;
    }
  }, []);

  // Инициализация проверки готовности Яндекс.Метрики
  useEffect(() => {
    const checkYmReady = (): boolean => {
      if (typeof window !== 'undefined' && typeof window.ym === 'function') {
        setIsYmReady(true);
        return true;
      }
      return false;
    };

    let attempts = 0;
    const maxAttempts = 10;
    
    const tryInitialize = (): void => {
      if (checkYmReady() || attempts >= maxAttempts) {
        clearInterval(intervalId);
        if (attempts < maxAttempts) {
          trackPageView();
        }
      }
      attempts++;
    };

    const intervalId = setInterval(tryInitialize, 500);
    // Первая проверка сразу
    tryInitialize();

    return () => clearInterval(intervalId);
  }, []);

  // Отслеживание изменения страницы
  useEffect(() => {
    if (isYmReady && yandexId) {
      trackPageView();
    }
  }, [pathname, isYmReady, yandexId, searchParams]);

  /**
   * Трекает просмотр страницы в Яндекс.Метрике
   */
  const trackPageView = (): void => {
    if (typeof window !== 'undefined' && window.ym && yandexId) {
      console.log('Yandex Metrika: Tracking page view', pathname);
      
      // Сохраняем UTM-метки и исходный referrer
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || 
                       (window.initialReferrer && new URL(window.initialReferrer).hostname) || 
                       document.referrer;
      
      const hitOptions: YandexMetrikaHitOptions = {
        referer: window.initialReferrer || document.referrer,
        title: document.title,
        utm: utmSource
      };
      
      // Отправляем hit с дополнительными параметрами
      window.ym(yandexId, 'hit', window.location.href, hitOptions);
    }
  };

  /**
   * Генерирует скрипт инициализации Яндекс.Метрики
   */
  const getYandexMetrikaScript = (): string => {
    const initParams: YandexMetrikaInitParams = {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: "dataLayer",
      trackHash: true,
      triggerEvent: true,
      ut: "noindex",
      params: true
    };

    return `
      (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          k=e.createElement(t),a=e.getElementsByTagName(t)[0];
          k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

      ym(${yandexId}, 'init', ${JSON.stringify(initParams)});
    `;
  };

  if (!yandexId) {
    console.warn('Yandex Metrika: Counter ID not provided');
    return <></>;
  }

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: getYandexMetrikaScript(),
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${yandexId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
};

// Вспомогательные типы для использования в других частях приложения
export type { YandexMetrikaInitParams, YandexMetrikaHitOptions };