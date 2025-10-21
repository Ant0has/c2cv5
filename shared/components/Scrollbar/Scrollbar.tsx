// components/CustomScrollbar.tsx
'use client'
import { useEffect, useRef, useState } from 'react';
import s from './Scrollbar.module.scss';

interface CustomScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const CustomScrollbar = ({ containerRef }: CustomScrollbarProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateScrollbar = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = scrollWidth - clientWidth;

    // Рассчитываем прогресс скролла
    const progress = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
    setScrollProgress(progress);

    // Рассчитываем ширину бегунка
    const thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 10);
    setThumbWidth(thumbWidth);
  };

  const handleThumbClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !thumbRef.current) return;

    const container = containerRef.current;
    const track = thumbRef.current.parentElement;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrollLeft = (clickX / trackWidth) * scrollWidth;
    
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    
    const thumb = thumbRef.current;
    const track = thumb?.parentElement;
    const container = containerRef.current;
    
    if (!thumb || !track || !container) return;

    const startX = e.clientX;
    const startLeft = thumb.offsetLeft;
    const trackWidth = track.clientWidth;
    const thumbWidth = thumb.clientWidth;
    const scrollWidth = container.scrollWidth - container.clientWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = moveEvent.clientX - startX;
      let newLeft = startLeft + deltaX;
      
      // Ограничиваем движение бегунка в пределах трека
      newLeft = Math.max(0, Math.min(newLeft, trackWidth - thumbWidth));
      
      const scrollLeft = (newLeft / (trackWidth - thumbWidth)) * scrollWidth;
      container.scrollLeft = scrollLeft;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    // Инициализируем скроллбар
    updateScrollbar();

    return () => {
      container.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [containerRef]);

  const thumbPosition = scrollProgress * (100 - thumbWidth);

  return (
    <div className={s.customScrollbar}>
      <div className={s.scrollbarTrack}>
        <div
          ref={thumbRef}
          className={s.scrollbarThumb}
          style={{
            width: `${thumbWidth}%`,
            left: `${thumbPosition}%`
          }}
          onMouseDown={handleThumbMouseDown}
          onClick={handleThumbClick}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;