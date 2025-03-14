'use client'

import { ConfigProvider } from "antd"
import { PropsWithChildren } from "react"
import { tokens } from "../shared/styles/style-tokens"

export function Providers({ children }: PropsWithChildren) {

	return (
		<ConfigProvider
			wave={{ disabled: true }}
			theme={{
				components: tokens.components,
				token: tokens.token
			}}
		>
			{children}
		</ConfigProvider>
	)
}
