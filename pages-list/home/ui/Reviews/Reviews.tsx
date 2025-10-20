'use client'

import { FC } from "react";
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import { reviews } from "./data";
import ReviewCard from "./ReviewCard/ReviewCard";

import avatar1 from '@/public/images/avatar-1.png';
import avatar2 from '@/public/images/avatar-2.png';
import avatar3 from '@/public/images/avatar-3.png';

import 'swiper/css';
import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
interface IProps {
  title?: unknown;
}

const Reviews: FC<IProps> = () => {
  const avatars = [avatar1, avatar2, avatar3]
  return (
    <>
      <HomeLayout top={<HomeLayoutTitle
        title="Отзывы - Междугороднее такси" titlePrimary="«CITY 2 CITY»" description="Комфорт, Бизнес и Минивэн - поездки на любой случай" />}
      >
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          loop
          modules={[Autoplay]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            700: {
              slidesPerView: 2,
            },
            1000: {
              slidesPerView: 3,
            },
          }}
        >
          {reviews.map(review => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} avatar={avatars[review.id & 2]} />
            </SwiperSlide>
          ))}
        </Swiper>
      </HomeLayout>
    </>
  )
}

export default Reviews;