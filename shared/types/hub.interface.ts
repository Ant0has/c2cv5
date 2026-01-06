export interface IHub {
    id: number;
    "name": "Горнолыжка",
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    heroImage: string;
    features: string;
    faq: string;
    destinations: IHubDestination[];
}

export interface IHubDestination {
    id: number;
    hubId: number;
    name: string;
    slug: string;
    description: string;
    title: string;
    subtitle: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    heroImage: string;
    sortOrder: number;
    isActive: boolean;
    isFeatured: boolean;
    heroImagePrompt: string;
    toLat: string;
    toLng: string;
    "weatherData": IHubWeatherData,
    weatherUpdatedAt: string;
    tripCountBase: number;
    tripCountDate: string;
    createdAt: string;
    updatedAt: string;

    content: string;
    fromCity: string;
    toCity: string;
    distance: string;
    duration: string;
    price: string;
    priceNote: string;
    features: string;
    gallery: string;
    faq: string;
    tariffs: string;
    targetAudience: string;

    hub: IHub;
}

export interface IHubWeatherForecast {
    date: string;
    icon: string;
    tempMax: number;
    tempMin: number;
    dayOfWeek: string;
    description: string;
    weatherCode: number;
    precipitationProbability: number;
}

export interface IHubWeatherData {
    city: string;
    forecast: IHubWeatherForecast[];
    updatedAt: string;
}