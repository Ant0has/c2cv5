export interface IRouteData {
    ID: number
    post_id: number
    region_id: number
    content: string
    title: string
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
    price?: number
    distance?: number
    duration?: string
    regions_data: IRegionData,
    routes: IRoute[]
    is_military?: boolean
    attractions: IAttraction[]
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