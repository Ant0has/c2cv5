'use client'

import { Blocks } from "@/shared/types/enums"
import { IRouteData } from "@/shared/types/route.interface"
import { IMailRequest, IRegion } from "@/shared/types/types"
import { YMaps } from "@pbe/react-yandex-maps"
import { ConfigProvider } from "antd"
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
