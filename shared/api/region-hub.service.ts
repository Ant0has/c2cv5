import { BASE_URL_API } from "../constants"
import { RegionHubApiResponse } from "@/pages-list/region-hubs/types"

class RegionHubService {
    async getRoutesByRegionId(regionId: number): Promise<RegionHubApiResponse | null> {
        try {
            const response = await fetch(`${BASE_URL_API}/routes/by-region/${regionId}`, {
                next: { revalidate: 86400 }
            })

            if (!response.ok) throw new Error('Failed to fetch region hub data')

            return await response.json()
        } catch {
            return null
        }
    }
}

export const regionHubService = new RegionHubService()
