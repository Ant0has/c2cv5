'use client'

import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton"
import Welcome from "@/shared/components/Welcome/Welcome"
import { goToOrder } from "@/shared/services/go-to-order"
import { IRouteData } from "@/shared/types/route.interface"
import dynamic from "next/dynamic"
import { Suspense, useContext, useEffect, useLayoutEffect, useState } from "react"
import { RouteContext } from "../providers"

interface Props {
	routeData?: IRouteData
}

const PriceSection = dynamic(
	() => import("@/shared/components/Price/Price").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const OrderStepsSection = dynamic(
	() => import("@/shared/components/OrderSteps/OrderSteps").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const ReviewsSection = dynamic(
	() => import("@/shared/components/Reviews/Reviews").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const QuestionsSection = dynamic(

	() => import("@/shared/components/Questions/Questions").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const CitiesSection = dynamic(
	() => import("@/shared/components/Cities/Cities").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

const ForBusinessSection = dynamic(
	() => import("@/shared/components/ForBusiness/ForBusiness").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

const RouteDescriptionSection = dynamic(
	() => import("@/shared/components/RouteDescription/RouteDescription").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

export function Home({ routeData }: Props) {
	const { setRoute } = useContext(RouteContext)

	const cityTitle = (routeData?.title || '').replace(/Такси\s+/gi, '').trim()

	useLayoutEffect(() => {
		routeData && setRoute(routeData)
	}, [routeData])

	return (
		<>
			<Welcome isMilitary={routeData?.is_military} handleGoToOrder={() => goToOrder()} city={cityTitle} />
			<Suspense>
				<PriceSection isMilitary={routeData?.is_military} title={cityTitle} cityData={routeData?.city_seo_data} />
			</Suspense>

			<Suspense>
				<OrderStepsSection isMilitary={routeData?.is_military} />
			</Suspense>
			<Suspense>
				<ReviewsSection />
			</Suspense>
			<Suspense>
				<QuestionsSection isMilitary={routeData?.is_military} />
			</Suspense>
			<Suspense>
				<CitiesSection routes={routeData?.routes}/>
			</Suspense>

			{!routeData?.is_military && (
				<Suspense>
					<ForBusinessSection />
				</Suspense>
			)}

			<Suspense>
				<RouteDescriptionSection text={routeData?.content} title={routeData?.city_seo_data || 'такси межгород'} />
			</Suspense>
		</>
	)
}
