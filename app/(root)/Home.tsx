'use client'

import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton"
import Welcome from "@/shared/components/Welcome/Welcome"
import { goToOrder } from "@/shared/services/go-to-order"
import { IRouteData } from "@/shared/types/route.interface"
import dynamic from "next/dynamic"
import { Suspense, useContext, useLayoutEffect } from "react"
import { RouteContext } from "../providers"
import { moscowAttractions, regionAttractions } from "@/pages-list/home/data";

interface Props {
	routeData?: IRouteData
}

const PriceSection = dynamic(
	() => import("@/pages-list/home/ui/Price/Price").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const OrderStepsSection = dynamic(
	() => import("@/pages-list/home/ui/OrderSteps/OrderSteps").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const ReviewsSection = dynamic(
	() => import("@/pages-list/home/ui/Reviews/Reviews").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const QuestionsSection = dynamic(

	() => import("@/pages-list/home/ui/Questions/Questions").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
);

const CitiesSection = dynamic(
	() => import("@/pages-list/home/ui/Cities/Cities").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

const ForBusinessSection = dynamic(
	() => import("@/pages-list/home/ui/ForBusiness/ForBusiness").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

const RouteDescriptionSection = dynamic(
	() => import("@/pages-list/home/ui/RouteDescription/RouteDescription").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="80vh" />,
		ssr: false,
	}
)

const AttractionsSection = dynamic(
	() => import("@/pages-list/home/ui/attractions/Attractions").then((mod) => mod.default),
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
				<PriceSection isMilitary={routeData?.is_military}
					title={cityTitle} cityData={routeData?.city_seo_data}
				/>
			</Suspense>

			<Suspense>
				<OrderStepsSection isMilitary={routeData?.is_military} />
			</Suspense>
			<Suspense>
				<ReviewsSection title={cityTitle} />
			</Suspense>
			<Suspense>
				<AttractionsSection
					title="Достопримечательности"
					titlePrimary="Москвы"
					cards={[...moscowAttractions, ...moscowAttractions, ...moscowAttractions]}
				/>
			</Suspense>
			<Suspense>
				<AttractionsSection
					title="Достопримечательности"
					titlePrimary="Региона"
					isHorizontal={true}
					cards={[...regionAttractions, ...regionAttractions, ...regionAttractions]}
				/>
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
					text={routeData?.content} title={routeData?.city_seo_data || 'такси межгород'}
				/>
			</Suspense>
		</>
	)
}
