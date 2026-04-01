'use client'

import { Blocks } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { IMailRequest, IRegion } from "@/shared/types/types";
import { ConfigProvider, notification } from "antd";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useRef, useState } from "react";
import { tokens } from "../shared/styles/style-tokens";
import { usePathname } from "next/navigation";

interface ProvidersProps extends PropsWithChildren {
	regions: IRegion[]
}
interface IQuestionModalData {
	status: boolean,
	blockFrom: Blocks | null,
	order_from?: string,
	order_to?: string,
  theme?: 'dark' | 'light'
  deliveryWeight?: string
  price?: number
}

declare global {
  interface Window {
    ym: (id: number, method: string, ...args: unknown[]) => void;
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
		blockFrom: null,
		order_from: '',
		order_to: '',
	})
	const [orderModalData, setOrderModalData] = useState<IOrderModalData>({ status: false })
	const [route, setRoute] = useState<IRouteData>({} as IRouteData)

  useEffect(() => {
    // Глобальная настройка уведомлений
    notification.config({
      duration: 3, 
      placement: 'topRight',
      maxCount: 3, 
    });
  }, []);

	return (
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
	)
}

export function YandexHit() {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // первый рендер — Метрика init сама обрабатывает
    }
    if (typeof window === 'undefined') return
    if (!window.ym) return

    const url = window.location.pathname + window.location.search
    window.ym(Number(process.env.NEXT_PUBLIC_YANDEX_ID), "hit", url, {
      title: document.title
    })
  }, [pathname])

  return null
}