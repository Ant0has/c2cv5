'use client'

import { ConfigProvider } from "antd"
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react"
import { tokens } from "../shared/styles/style-tokens"
import { IRegion } from "@/shared/types/types"
import { YMaps } from "@pbe/react-yandex-maps"

interface ProvidersProps extends PropsWithChildren {
	regions: IRegion[]
}

interface ModalContextProps {
	isOpenQuestionModal: boolean,
	setIsOpenQuestionModal: Dispatch<SetStateAction<boolean>>

	isOpenOrderModal: boolean,
	setIsOpenOrderModal: Dispatch<SetStateAction<boolean>>
}

export const RegionsContext = createContext<IRegion[]>([])

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

export function Providers({ children, regions }: ProvidersProps) {
	const [isOpenQuestionModal, setIsOpenQuestionModal] = useState<boolean>(false)
	const [isOpenOrderModal, setIsOpenOrderModal] = useState<boolean>(false)

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
					<ModalContext.Provider value={{
						isOpenQuestionModal,
						setIsOpenQuestionModal,

						isOpenOrderModal,
						setIsOpenOrderModal
					}}>
						{children}
					</ModalContext.Provider>
				</RegionsContext.Provider>
			</ConfigProvider >
		</YMaps>
	)
}
