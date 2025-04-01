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

interface Props {
	routeData?: IRouteData
}

export function Home({ routeData }: Props) {
	return (
		<>
			<Welcome handleGoToOrder={() => goToOrder()} city={routeData?.regions_data.meta_value} />
			<Price />
			<OrderSteps />
			<Reviews />
			<Questions />
			<Cities routes={routeData?.routes} />
			<ForBusiness />
			{routeData?.content && <RouteDescription
				text={routeData?.content}
				title={routeData?.city_seo_data}
			/>}

		</>
	)
}
