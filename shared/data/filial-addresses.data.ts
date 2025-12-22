import Moscow from "@/public/images/map/Moscow.png";
import Krasnodar from "@/public/images/map/Krasnodar.png";
import Ekaterinburg from "@/public/images/map/Ekaterinburg.png";
import Tyumen from "@/public/images/map/Tyumen.png";
import Belgorod from "@/public/images/map/Belgorod.png";
import Ufa from "@/public/images/map/Ufa.png";
import Samara from "@/public/images/map/Samara.png";
import Voronezh from "@/public/images/map/Voronezh.png";
import NizhniyNovgorod from "@/public/images/map/NizhniyNovgorod.png";
import Rostov from "@/public/images/map/Rostov.png";
import Kazan from "@/public/images/map/Kazan.png";
import Chelyabinsk from "@/public/images/map/Chelyabinsk.png";
import { StaticImageData } from "next/image";

interface IFilialAddress {
    id: number;
    address: string;
    map: StaticImageData;
    regionId: number;
}

// shared/data/filial-addresses.data.ts
export const filialAddressesData: IFilialAddress[] = [
    {
        id: 1,
        address: "Москва, 3-я Парковая 41а, офис 430",
        map: Moscow,
        regionId: 1, // Москва
    },
    {
        id: 2,
        address: "Краснодар, посёлок Знаменский, Берёзовая ул., 2/1",
        map: Krasnodar,
        regionId: 17, // Краснодар (ID: 17)
    },
    {
        id: 3,
        address: "Екатеринбург, Химмаш, Чкаловский район, Альпинистов, 57р",
        map: Ekaterinburg,
        regionId: 55, // Екатеринбург (ID: 55)
    },
    {
        id: 4,
        address: "Тюмень, ул. 30 лет Победы 17/1, офис 23",
        map: Tyumen,
        regionId: 61, // Тюмень (ID: 61)
    },
    {
        id: 5,
        address: "Белгород, Восточный округ, Константина Заслонова, 92 к5",
        map: Belgorod,
        regionId: 7, // Белгород (ID: 7)
    },
    {
        id: 6,
        address: "Уфа, Орджоникидзевский район, Соединительное шоссе, 11",
        map: Ufa,
        regionId: 40, // Уфа (ID: 40)
    },
    {
        id: 7,
        address: "Самара, Промышленный район, Совхозный проезд, 10 к2",
        map: Samara,
        regionId: 52, // Самара (ID: 52)
    },
    {
        id: 8,
        address: "Воронеж, Железнодорожный район, Землячки, 15/1",
        map: Voronezh,
        regionId: 12, // Воронеж (ID: 12)
    },
    {
        id: 9,
        address: "Нижний Новгород, Новикова-Прибоя, 4",
        map: NizhniyNovgorod,
        regionId: 27, // Нижний Новгород (ID: 27)
    },
    {
        id: 10,
        address: "Ростов-на-Дону, ул. Доватора 144/13",
        map: Rostov,
        regionId: 37, // Ростов (ID: 37) - обратите внимание, что в списке регионов "Ростов", но адрес "Ростов-на-Дону"
    },
    {
        id: 11,
        address: "Казань, Меридианная 10, офис 58",
        map: Kazan,
        regionId: 49, // Казань (ID: 49)
    },
    {
        id: 12,
        address: "Челябинск, Курчатовский район, Радонежская, 15",
        map: Chelyabinsk,
        regionId: 66, // Челябинск (ID: 66)
    },
]