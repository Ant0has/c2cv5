class RouteService {
    private BASE_URL = 'https://city2city.ru/api'

    async getRouteByUrl(url?: string) {
        try {
            const response = await fetch(`${this.BASE_URL}/routes/${url}`, {
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