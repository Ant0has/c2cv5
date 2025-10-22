'use client'

// Импортируем Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import s from './AttractionCardList.module.scss';

// Импортируем стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { useEffect, useRef, useState } from 'react';
import AttractionCard from '../AttractionCard';
import { useResize } from '@/shared/hooks/useResize';

interface IAttractionCardListProps {
    cards: Array<{
        title: string;
        subTitle: string;
        description: string;
        image: string;
    }>;
    isHorizontal?: boolean;
}

const AttractionCardList = ({ cards, isHorizontal }: IAttractionCardListProps) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [thumbPosition, setThumbPosition] = useState(0);
    const [thumbWidth, setThumbWidth] = useState(0);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartLeft = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const screenWidth = useResize();
    const isMobile = screenWidth <= 768; // или ваш брейкпоинт для мобильных
    const minCardsForScrollbar = isMobile ? 2 : 3; // на мобильных >1, на остальных >2
    const showScrollbar = cards.length >= minCardsForScrollbar;

    useEffect(() => {
        if (cards.length > 0) {
            setThumbWidth(Math.max(100 / cards.length, 10));
        }
    }, [cards.length]);

    const updateScrollbar = (swiper: SwiperType) => {
        if (isDragging.current) return;

        const progress = swiper.progress;
        const maxPosition = 100 - thumbWidth;
        const newPosition = progress * maxPosition;

        setThumbPosition(newPosition);
    };

    const handleThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!trackRef.current) return;

        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartLeft.current = thumbPosition;

        // Добавляем класс для стилей
        document.addEventListener('mousemove', handleThumbMouseMove);
        document.addEventListener('mouseup', handleThumbMouseUp);
    };

    const handleThumbMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !trackRef.current || !swiperRef.current) return;

        const track = trackRef.current;
        const trackRect = track.getBoundingClientRect();
        const trackWidth = trackRect.width;

        const deltaX = e.clientX - dragStartX.current;
        const deltaPercent = (deltaX / trackWidth) * 100;

        let newPosition = dragStartLeft.current + deltaPercent;
        const maxPosition = 100 - thumbWidth;

        // Ограничиваем позицию в пределах трека
        newPosition = Math.max(0, Math.min(newPosition, maxPosition));

        setThumbPosition(newPosition);

        // Плавно скроллим Swiper
        const progress = newPosition / maxPosition;
        const targetSlide = progress * (cards.length - 1);

        // Используем transition: false чтобы избежать конфликта анимаций
        if (swiperRef.current && 'setTransition' in (swiperRef.current as any)) {
            (swiperRef.current as any).setTransition(false);
        }
        swiperRef.current.slideTo(targetSlide);
    };

    const handleThumbMouseUp = () => {
        if (!isDragging.current || !swiperRef.current) return;

        isDragging.current = false;

        // Восстанавливаем transition для Swiper
        if (swiperRef.current && 'setTransition' in swiperRef.current) {
            (swiperRef.current as any).setTransition(true);
        }

        // Синхронизируем точное положение
        const maxPosition = 100 - thumbWidth;
        const progress = thumbPosition / maxPosition;
        const targetSlide = Math.round(progress * (cards.length - 1));

        swiperRef.current.slideTo(targetSlide, 300);

        document.removeEventListener('mousemove', handleThumbMouseMove);
        document.removeEventListener('mouseup', handleThumbMouseUp);
    };

    const handleTrackClick = (e: React.MouseEvent) => {
        if (!trackRef.current || !swiperRef.current || isDragging.current) return;

        const track = trackRef.current;
        const trackRect = track.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const progress = clickX / trackRect.width;

        const targetSlide = Math.round((cards.length - 1) * progress);
        swiperRef.current.slideTo(targetSlide, 300);
    };

    return (
        <div className={s.swiperWrapper}>
            <Swiper
                modules={[Navigation]}
                spaceBetween={36}
                slidesPerView={'auto'}
                speed={300}
                resistance={true}
                resistanceRatio={0.85}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    updateScrollbar(swiper);
                }}
                onSlideChange={(swiper) => {
                    updateScrollbar(swiper);
                }}
                onProgress={(swiper) => {
                    updateScrollbar(swiper);
                }}
                onSliderMove={(swiper) => {
                    if (!isDragging.current) {
                        updateScrollbar(swiper);
                    }
                }}
                className={s.swiperContainer}
            >
                {cards.map((attraction, index) => (
                    <SwiperSlide key={index} className={s.swiperSlide}>
                        <AttractionCard {...attraction} isHorizontal={isHorizontal} />
                    </SwiperSlide>
                ))}
            </Swiper>
            {showScrollbar && (
                <div className={s.customScrollbar}>
                    <div
                        ref={trackRef}
                        className={s.scrollbarTrack}
                        onClick={handleTrackClick}
                    >
                        <div
                            className={`${s.scrollbarThumb} ${isDragging.current ? s.dragging : ''}`}
                            style={{
                                width: `${thumbWidth}%`,
                                left: `${thumbPosition}%`,
                            }}
                            onMouseDown={handleThumbMouseDown}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttractionCardList;