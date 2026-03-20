import { BASE_URL_API } from "../constants"
import { IHubDestination } from "../types/hub.interface"

class DestinationService {
    async getBySlug(slug: string): Promise<IHubDestination | null> {
        try {
            const response = await fetch(`${BASE_URL_API}/destinations/slug/${slug}`, {
                next: { revalidate: 86400 }
            })
            if (!response.ok) throw new Error('Failed to fetch destination')
            const data = await response.json()
            return data
        } catch {
            return null
        }
    }
}

export const destinationService = new DestinationService()