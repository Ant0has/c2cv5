import { notFound } from "next/navigation"
import { Home } from "../Home"
import { routeService } from "@/shared/services/route.service"

interface Props {
    params: {
        region: string
    }
}

export default async function RegionPage({ params }: Props) {
    const data = await routeService.getRouteByUrl(params.region)

    if (data === null) {
        notFound()
    }

    return <Home routeData={data} />
} 