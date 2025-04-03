'use client'

import { Prices } from '@/shared/types/enums';
import { IPriceOptions } from '@/shared/types/types';
import { Collapse, CollapseProps } from 'antd';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import AdditionalServices from '../AdditionalServices/AdditionalServices';
import { additionalServices, businessOptions, comfortOptions, comfortPlusOptions, deliveryOptions, minivanOptions, standardOptions } from '../data';
import PriceOptions from '../PriceOptions/PriceOptions';

import standard1 from '@/public/images/cars/standard-1.png';

import comfort1 from '@/public/images/cars/comfort-1.png';
import comfort2 from '@/public/images/cars/comfort-2.png';
import comfort3 from '@/public/images/cars/comfort-3.png';

import comfortPlus1 from '@/public/images/cars/comfort-plus-1.png';
import comfortPlus2 from '@/public/images/cars/comfort-plus-2.png';
import comfortPlus3 from '@/public/images/cars/comfort-plus-3.png';

import business1 from '@/public/images/cars/business-1.png';
import business2 from '@/public/images/cars/business-2.png';
import business3 from '@/public/images/cars/business-3.png';
import business4 from '@/public/images/cars/business-4.png';

import minivan1 from '@/public/images/cars/minivan-1.png';
import minivan2 from '@/public/images/cars/minivan-2.png';
import minivan3 from '@/public/images/cars/minivan-3.png';

import delivery1 from '@/public/images/cars/delivery-1.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import s from './PriceContent.module.scss';

interface IProps {
  type: Prices,
  isMilitary?: boolean
}

const PriceContent: FC<IProps> = ({ type, isMilitary }) => {

  const contentByType: {
    [key in Prices]: {
      title: string
      options: IPriceOptions[],
      carsImages: StaticImageData[],
      additionalServices?: CollapseProps['items']
    }
  } = {
    [Prices.STANDARD]: {
      title: 'Тариф Стандарт',
      options: standardOptions,
      carsImages: [standard1],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    },

    [Prices.COMFORT]: {
      title: 'Тариф Комфорт',
      options: comfortOptions,
      carsImages: [comfort1, comfort2, comfort3],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    },

    [Prices.COMFORT_PLUS]: {
      title: 'Тариф Комфорт+',
      options: comfortPlusOptions,
      carsImages: [comfortPlus1, comfortPlus2, comfortPlus3],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    },

    [Prices.BUSINESS]: {
      title: 'Тариф Бизнес',
      options: businessOptions,
      carsImages: [business1, business2, business3, business4],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    },

    [Prices.MINIVAN]: {
      title: 'Тариф Минивэн',
      options: minivanOptions,
      carsImages: [minivan1, minivan2, minivan3],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    },

    [Prices.DELIVERY]: {
      title: 'Тариф Доставка',
      options: deliveryOptions,
      carsImages: [delivery1],
      additionalServices: [{
        key: '1',
        label: 'Дополнительные услуги',
        children: <AdditionalServices services={additionalServices} />,
      }],
    }
  }

  return (
    <div className={clsx(s.content, { [s.military]: isMilitary })}>
      <div className={s.top}>
        <div className={s.options}>
          <PriceOptions isMilitary={isMilitary} title={contentByType[type].title} options={contentByType[type].options} />
        </div>

        <div className={s.swiper}>
          <Swiper
            grabCursor={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={48}
          >
            {contentByType[type].carsImages.map((image: StaticImageData, id: number) => (
              <SwiperSlide key={id}>
                <Image
                  src={image}
                  alt="car-example"
                  layout="fill"
                  objectFit="contain"
                  className={s.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className={s.additionalServices}>
        <Collapse
          expandIconPosition='end'
          ghost
          items={contentByType[type].additionalServices}
          expandIcon={(panelProps) => {
            return <div className={clsx(s.expand, { [s.open]: panelProps.isActive })}></div>
          }}
        />
      </div>
    </div >
  )
}

export default PriceContent;
