'use client'

import { FC } from "react";
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import { reviews } from "./data";
import ReviewCard from "./ReviewCard/ReviewCard";
import s from './Reviews.module.scss';
import ReviewTitle from "./ReviewTitle/ReviewTitle";

import 'swiper/css';
interface IProps {
 title?:unknown;
}

const Reviews: FC<IProps> = () => {
  return (
    <>
      <div className='container-40'>
        <ReviewTitle />

        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          className={s.swiper}
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
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div >
    </>
  )
}

export default Reviews;