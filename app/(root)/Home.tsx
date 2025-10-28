'use client'

import Price from "@/pages-list/home/ui/Price/Price"
import Welcome from "@/pages-list/home/ui/Welcome/Welcome"
import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton"
import { goToOrder } from "@/shared/services/go-to-order"
import { IRouteData } from "@/shared/types/route.interface"
import dynamic from "next/dynamic"
import { Suspense, useContext, useLayoutEffect } from "react"
import { RouteContext } from "../providers"

interface Props {
	routeData?: IRouteData
}

const OrderStepsSection = dynamic(
	() => import("@/pages-list/home/ui/OrderSteps/OrderSteps").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
);

const ReviewsSection = dynamic(
	() => import("@/pages-list/home/ui/Reviews/Reviews").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
);

const QuestionsSection = dynamic(

	() => import("@/pages-list/home/ui/Questions/Questions").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
);

const CitiesSection = dynamic(
	() => import("@/pages-list/home/ui/Cities/Cities").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const ForBusinessSection = dynamic(
	() => import("@/pages-list/home/ui/ForBusiness/ForBusiness").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const RouteDescriptionSection = dynamic(
	() => import("@/pages-list/home/ui/RouteDescription/RouteDescription").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
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
			<Price isMilitary={routeData?.is_military} title={cityTitle} cityData={routeData?.city_seo_data} />

			<Suspense>
				<OrderStepsSection isMilitary={routeData?.is_military} />
			</Suspense>
			{/* <Suspense>
				<AttractionsSection
					title="Интересные места"
					titlePrimary="Москвы"
					cards={moscowAttractions}
				/>
			</Suspense>
			<Suspense>
				<AttractionsSection
					title="Интересные места"
					titlePrimary="Региона"
					isHorizontal={true}
					cards={regionAttractions}
				/>
			</Suspense> */}
			<Suspense>
				<ReviewsSection title={cityTitle} />
			</Suspense>
			<Suspense>
				<QuestionsSection isMilitary={routeData?.is_military} />
			</Suspense>
			<Suspense>
				<CitiesSection routes={routeData?.routes} />
			</Suspense>

			{!routeData?.is_military && (
				<Suspense>
					<ForBusinessSection />
				</Suspense>
			)}

			<Suspense>
				<RouteDescriptionSection
					text={routeData?.content} title={cityTitle || 'такси межгород'}
				/>
			</Suspense>
		</>
	)
}
