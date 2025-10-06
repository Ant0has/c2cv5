import { IRegion } from "../types/types"

class RegionService {
    private BASE_URL = 'https://city2city.ru/api'

    async getAll(): Promise<IRegion[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/regions`, {
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