export interface IRouteData {
    ID: number
    post_id: number
    region_id: number
    content: string
    title: string
    url: string
    description: string
    meta?: {
        title?: string
        description?: string
        keywords?: string
    }
    // from_city?: string
    // to_city?: string
    city_data?: string
    city_seo_data?: string
    seo_title?: string
    seo_description?: string
    price?: number
    distance?: number
    duration_hours?: number
    duration?: string
    regions_data: IRegionData,
    routes: IRoute[]
    attractions: IAttraction[]
    is_indexable?: number
    canonical_url:string | null
    is_whitelist?: boolean

    city_from?: string;
    city_to?: string;
    distance_km: number;
    price_economy?: number;
    price_comfort?: number;
    price_comfort_plus?: number;
    price_business?: number;
    price_minivan?: number;
    price_delivery?: number;
    faq1_q: string | null;
    faq1_a: string | null;
    faq2_q: string | null;
    faq2_a: string | null;
    faq3_q: string | null;
    faq3_a: string | null;
    is_svo?: 0 | 1;
}

export interface IAttraction{
    id: number
    regionId: number
    regionCode: string
    imageDesktop: string
    imageMobile: string
    name: string
    description: string
    createdAt: string
}

export interface IRegionData {
    ID: number;
    post_id: number;
    meta_key: string;
    meta_id: number;
    meta_value: string;
    region_value: string;
    url: string;
    address: string;
    phone_number: string;
}

export interface IRoute {
    ID: number;
    post_id: number;
    region_id: number;
    content: string;
    title: string;
    url: string;
    distance?: string;
    seo_title?: string;
    seo_description?: string;
    city_data: string;
    city_seo_data: string;
}