import { BASE_URL_API } from "../constants";
import { IHub } from "../types/hub.interface";

class HubService {
    async getAll(): Promise<IHub[]> {
        try {
            const response = await fetch(`${BASE_URL_API}/hubs`, {
                next: { revalidate: 3600 } // Кэшируем на час
            });
            if (!response.ok) throw new Error('Failed to fetch hubs');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching hubs:', error);
            return [];
        }
    }

    async getBySlug(slug: string): Promise<IHub | null> {
        try {
            const response = await fetch(`${BASE_URL_API}/hubs/slug/${slug}`, {
                next: { revalidate: 3600 } // Кэшируем на час
            });
            if (!response.ok) throw new Error('Failed to fetch hub');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching hub:', error);
            return null;
        }
    }
}

export const hubService = new HubService();