'use client'

import Cities from "@/shared/components/Cities/Cities"
import ForBusiness from "@/shared/components/ForBusiness/ForBusiness"
import OrderSteps from "@/shared/components/OrderSteps/OrderSteps"
import Price from "@/shared/components/Price/Price"
import Questions from "@/shared/components/Questions/Questions"
import Reviews from "@/shared/components/Reviews/Reviews"
import RouteDescription from "@/shared/components/RouteDescription/RouteDescription"
import Welcome from "@/shared/components/Welcome/Welcome"
import { goToOrder } from "@/shared/services/go-to-order"
import { IRouteData } from "@/shared/types/route.interface"
import { useContext, useEffect, useState } from "react"
import { RouteContext } from "../providers"

interface Props {
	routeData?: IRouteData
}

export function Home({ routeData }: Props) {
	const { setRoute } = useContext(RouteContext)
	const [isMilitary, setIsMilitary] = useState<boolean>(false)

	const cityTitle = (routeData?.title || '').replace(/Такси\s+/gi, '').trim()
	
	useEffect(() => {
		routeData && setRoute(routeData)
		setIsMilitary(!!routeData?.is_military)
	}, [routeData])

	console.log(routeData, '--routeData')

	return (
		<>
			<Welcome isMilitary={isMilitary} handleGoToOrder={() => goToOrder()} city={cityTitle} />
			<Price isMilitary={isMilitary} title={cityTitle} cityData={routeData?.city_seo_data} />
			<OrderSteps isMilitary={isMilitary} />
			<Reviews />
			<Questions isMilitary={isMilitary} />
			<Cities routes={routeData?.routes} />
			{!isMilitary && <ForBusiness />}

			{routeData?.content && <RouteDescription
				text={routeData?.content}
				title={routeData?.city_seo_data}
			/>}

		</>
	)
}
