import { FC } from "react";
import s from './Addresses.module.scss'

import Moscow from '@/public/images/map/Moscow.png'
import Krasnodar from '@/public/images/map/Krasnodar.png'
import Ekaterinburg from '@/public/images/map/Ekaterinburg.png'
import Tyumen from '@/public/images/map/Tyumen.png'
import Belgorod from '@/public/images/map/Belgorod.png'
import Ufa from '@/public/images/map/Ufa.png'
import Samara from '@/public/images/map/Samara.png'
import Voronezh from '@/public/images/map/Voronezh.png'
import NizhniyNovgorod from '@/public/images/map/NizhniyNovgorod.png'
import Rostov from '@/public/images/map/Rostov.png'
import Kazan from '@/public/images/map/Kazan.png'
import Chelyabinsk from '@/public/images/map/Chelyabinsk.png'
import Image from "next/image";

interface IProps {
 title?:unknown;
}

const Addresses: FC<IProps> = () => {

  const addresses = [
    {
      id: 1,
      address: 'Москва, 3-я Парковая 41а, офис 430',
      map: Moscow
    },
    {
      id: 2,
      address: 'Краснодар, посёлок Знаменский, Берёзовая ул., 2/1',
      map: Krasnodar
    },
    {
      id: 3,
      address: 'Екатеринбург, Химмаш, Чкаловский район, Альпинистов, 57р',
      map: Ekaterinburg
    },
    {
      id: 4,
      address: 'Тюмень, ул. 30 лет Победы 17/1, офис 23',
      map: Tyumen
    },
    {
      id: 5,
      address: 'Белгород, Восточный округ, Константина Заслонова, 92 к5',
      map: Belgorod
    },
    {
      id: 6,
      address: 'Уфа, Орджоникидзевский район, Соединительное шоссе, 11',
      map: Ufa
    },
    {
      id: 7,
      address: 'Самара, Промышленный район, Совхозный проезд, 10 к2',
      map: Samara
    },
    {
      id: 8,
      address: 'Воронеж, Железнодорожный район, Землячки, 15/1',
      map: Voronezh
    },
    {
      id: 9,
      address: 'Нижний Новгород, Новикова-Прибоя, 4',
      map: NizhniyNovgorod
    },
    {
      id: 10,
      address: 'Ростов-на-Дону, ул. Ленина 90',
      map: Rostov
    },
    {
      id: 11,
      address: 'Казань, Меридианная 10, офис 58',
      map: Kazan
    },
    {
      id: 12,
      address: 'Челябинск, Курчатовский район, Радонежская, 15',
      map: Chelyabinsk
    },
  ]

  return (
    <div className={s.grid}>
      {addresses.map(address => (
        <div key={address.id} className={s.cell}>
          <h4 className="font-24-medium">{address.address}</h4>
          <div className={s.image}>
            <Image src={address.map} alt={address.address} layout="responsive" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Addresses;