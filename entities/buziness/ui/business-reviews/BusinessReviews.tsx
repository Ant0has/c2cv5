'use client'
import styles from './BusinessReviews.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Rate } from 'antd';
import { useIsMobile } from '@/shared/hooks/useResize';
import clsx from 'clsx';
import { Pagination } from 'swiper/modules';

interface Props {
    list: { id: number, name: string, company: string, text: string, rating: number, date: string }[];
}

const BusinessReviews = ({ list }: Props) => {
    const isMobile = useIsMobile();
    return (
        <div className={styles.wrapper}>
            <div className="container">
                <h2 className="title text-white text-center"><span className="text-primary">Отзывы</span> клиентов</h2>

                <div className={clsx( {'margin-t-24': isMobile,'margin-t-48': !isMobile})}>
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={32}
                        slidesPerView={1}
                        loop
                        pagination={{
                            clickable: true,
                            renderBullet: (index: number, className: string) => {
                                return `<span class="${className} review-bullet"></span>`;
                            },
                        }}
                        breakpoints={{
                            700: {
                                slidesPerView: 2,
                            },
                            1000: {
                                slidesPerView: 3
                            },
                        }}
                    >
                        {list.map(review => (
                            <SwiperSlide key={review.id}>
                                {/* <ReviewCard review={review} avatar={avatars[2]} /> */}
                                <div className={styles.review}>
                                  
                                    
                                    <div className={'flex flex-col gap-4'}>
                                        <h6 className='font-24-medium text-white'>{review.name}</h6>
                                        <span className='font-16-normal text-dark-secondary'>{review.company}</span>
                                    </div>
                                    <p className={'margin-t-24 font-18-italic text-white'}>{review.text}</p>
                                    <div className={'margin-t-24 flex justify-between items-center'}>
                                        <Rate disabled value={review.rating} />
                                        <span className='font-16-normal text-dark-secondary'>{review.date}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default BusinessReviews;