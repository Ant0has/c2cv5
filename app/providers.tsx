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





export const YandexMetrikaWrapper = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const yid = Number(process.env.NEXT_PUBLIC_YANDEX_ID || 0);
  const isProduction = process.env.NEXT_PUBLIC_STAGE === "production";

  const excludedPatterns = [
    /^\/admin(\/|$)/,
    /^\/test/,
    /\/preview/,
  ];

  const isExcludedPath = excludedPatterns.some((pattern) =>
    pattern.test(pathname || "")
  );

  const shouldRender = isProduction && yid > 0 && !isExcludedPath;

  // 👉 Отправка "хита" при изменении маршрута (SPA-навигация)
  useEffect(() => {
    if (!shouldRender || typeof window === "undefined") return;
    // @ts-expect-error: ym is injected by Yandex Metrika script
    if (typeof window.ym !== "function") return;
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    // @ts-expect-error: ym is injected by Yandex Metrika script
    window.ym(yid, "hit", url);
  }, [pathname, searchParams, shouldRender, yid]);

  if (!shouldRender) return null;

  return (
    <Script
      id="yandex-metrika"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${yid}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:false
          });
        `,
      }}
    />
  );
};