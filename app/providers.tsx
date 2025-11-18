'use client'

import { Blocks } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { IMailRequest, IRegion } from "@/shared/types/types";
import { YMaps } from "@pbe/react-yandex-maps";
import { ConfigProvider } from "antd";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from "react";
import { tokens } from "../shared/styles/style-tokens";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface ProvidersProps extends PropsWithChildren {
	regions: IRegion[]
}
interface IQuestionModalData {
	status: boolean,
	blockFrom: Blocks | null
}

declare global {
  interface Window {
    ym: (id: number, method: string, ...args: any[]) => void;
  }
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

export const YandexMetrikaWrapper = () => {
  const pathname = usePathname()
  const yandexId = process.env.NEXT_PUBLIC_YANDEX_ID

  if (!yandexId) {
    console.warn('Yandex Metrika ID not found')
    return null
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ym) {
      // Используем полный URL из window.location (включая query параметры)
      const fullUrl = window.location.pathname + window.location.search
      console.log('Yandex Metrika hit:', fullUrl)
      window.ym(parseInt(yandexId), 'hit', fullUrl)
    }
  }, [pathname, yandexId]) 

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                k=e.createElement(t),a=e.getElementsByTagName(t)[0];
                k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(${yandexId}, 'init', {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
                trackHash: true,
                ecommerce: "dataLayer"
            });
          `,
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
  )
}