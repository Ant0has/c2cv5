'use client'
import Price from "@/pages-list/home/ui/Price/Price"
import Welcome from "@/pages-list/home/ui/Welcome/Welcome"
import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton"
import { goToOrder } from "@/shared/services/go-to-order"
import { IRouteData } from "@/shared/types/route.interface"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
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

const RouteDescriptionSection = dynamic(
	() => import("@/pages-list/home/ui/RouteDescription/RouteDescription").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const AttractionsSection = dynamic(
	() => import("@/pages-list/home/ui/attractions/Attractions").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const FaqSection = dynamic(
	() => import("@/pages-list/home/ui/faq/Faq").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const ReviewsSection = dynamic(
	() => import("@/pages-list/home/ui/Reviews/Reviews").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

const YandexReviewsSection = dynamic(
	() => import("@/shared/components/YandexReviews/YandexReviews").then((mod) => mod.default),
	{
		loading: () => <LoadingSkeleton height="300px" />,
		ssr: false,
	}
)

export function Home({ routeData }: Props) {
	const { setRoute } = useContext(RouteContext)
	const pathname = usePathname()

	const cityTitle = (routeData?.title || '').replace(/Такси\s+/gi, '').trim()

	const isMilitary = routeData?.is_svo === 1

	useLayoutEffect(() => {
		routeData && setRoute(routeData)
	}, [routeData])

	return (
		<>
			<Welcome route={routeData} isMilitary={isMilitary} handleGoToOrder={() => goToOrder()} city={cityTitle} />

			<Price routeData={routeData} title={cityTitle} cityData={routeData?.city_seo_data} />

			<Suspense>
				<OrderStepsSection isMilitary={isMilitary} />
			</Suspense>
			{/* <Suspense>
				<AttractionsSection
					title="Интересные места"
					titlePrimary="Москвы"
					cards={routeData?.attractions || []}
				/>
			</Suspense> */}
			{
				routeData?.region_id === 1 && routeData?.attractions && routeData?.attractions.length > 0 && (
					<Suspense>
						<AttractionsSection
							title="Интересные места"
							titlePrimary="Региона"
							cards={routeData?.attractions || []}
						/>
					</Suspense>
				)
			}

			<Suspense>
				<CitiesSection routes={routeData?.routes} routeData={routeData} />
			</Suspense>

			{routeData && (
				<Suspense>
					<FaqSection route={routeData} />
				</Suspense>
			)}

			<Suspense>
				<ReviewsSection reviews={routeData?.reviews?.data || []} />
			</Suspense>

			{
				pathname === '/' && (
					<Suspense>
						<YandexReviewsSection/>
					</Suspense>
				)
			}


			{
				routeData?.main_text && (
					<Suspense>
						<RouteDescriptionSection
							text={routeData?.main_text}
							title={cityTitle || 'такси межгород'}
						/>
					</Suspense>
				)
			}

			<Suspense>
				<QuestionsSection isMilitary={isMilitary} />
			</Suspense>
		</>
	)
}


