import { BASE_URL_API } from "../constants"
import { IRouteData } from "../types/route.interface"

class RouteService {

    async getRouteByUrl(url?: string): Promise<IRouteData | null> {
        try {
            const response = await fetch(`${BASE_URL_API}/routes/${url}`, {
                next: { revalidate: 86400 }
            })

            if (!response.ok) throw new Error('Failed to fetch route data')

            const data = await response.json()
            return data
        } catch {
            return null
        }
    }
}

export const routeService = new RouteService() 