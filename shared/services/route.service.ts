import { BASE_URL_API } from "../constants"

class RouteService {

    async getRouteByUrl(url?: string) {
        try {
            const response = await fetch(`${BASE_URL_API}/routes/${url}`, {
                next: { revalidate: 3600 } // Кэшируем на час
            })

            if (!response.ok) throw new Error('Failed to fetch route data')

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching route:', error)
            return null
        }
    }
}

export const routeService = new RouteService() 