export interface IRouteData {
    ID: number
    post_id: number
    region_id: number
    content: string
    title: string
    description: string
    // Добавьте другие поля, которые приходят с сервера
    // Это примерная структура, дополните её в соответствии с реальными данными
    meta?: {
        title?: string
        description?: string
        keywords?: string
    }
    from_city?: string
    to_city?: string
    city_seo_data?: string
    price?: number
    distance?: number
    duration?: string
    regions_data: IRegionData,
    routes: IRoute[]
    // Другие поля...
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