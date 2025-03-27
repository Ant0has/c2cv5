'use client'

import { useRef } from "react"
import Welcome from "@/shared/components/Welcome/Welcome"
import Price from "@/shared/components/Price/Price"
import OrderSteps from "@/shared/components/OrderSteps/OrderSteps"
import Reviews from "@/shared/components/Reviews/Reviews"
import Questions from "@/shared/components/Questions/Questions"
import Cities from "@/shared/components/Cities/Cities"
import ForBusiness from "@/shared/components/ForBusiness/ForBusiness"
import RouteDescription from "@/shared/components/RouteDescription/RouteDescription"
import { IRouteData } from "@/shared/types/route.interface"


interface Props {
	routeData?: IRouteData
}

export function Home({ routeData }: Props) {
	const orderRef = useRef<HTMLDivElement>(null)

	const handleGoToOrder = () => {
		if (orderRef.current) {
			orderRef.current.scrollIntoView({ block: "center", behavior: "smooth" })
		}
	}

	return (
		<>
			<Welcome handleGoToOrder={handleGoToOrder} city={routeData?.regions_data.meta_value} />
			<Price orderRef={orderRef} />
			<OrderSteps />
			<Reviews />
			<Questions />
			<Cities routes={routeData?.routes} />
			<ForBusiness />
			{routeData?.content && <RouteDescription
				text={routeData?.content}
				title={routeData?.title}
			/>}

		</>
	)
}
