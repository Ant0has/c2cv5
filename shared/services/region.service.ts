import { BASE_URL_API } from "../constants"
import { IRegion } from "../types/types"

class RegionService {
    async getAll(): Promise<IRegion[]> {
        try {
            const response = await fetch(`${BASE_URL_API}/regions`, {
                next: { revalidate: 3600 } // Обновляем кэш каждый час
            })

            if (!response.ok) throw new Error('Failed to fetch regions')

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching regions:', error)
            return []
        }
    }
}

export const regionService = new RegionService() 