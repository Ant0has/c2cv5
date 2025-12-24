'use client';

import { LoadingSkeleton } from '@/shared/components/loadingSkeleton/LoadingSkeleton';
import clsx from 'clsx';
import { FC, useRef, useState } from 'react';
import s from './RouteVideo.module.scss';
import PlayIcon from '@/public/icons/PlayIcon';
import { BASE_URL } from '@/shared/constants';
import { useResize } from '@/shared/hooks/useResize';
import PlayIconMobile from '@/public/icons/PlayIconMobile';


interface IRouteVideoProps {
  videoUrl?: string | null;
  title?: string;
  route_video_thumbnail?: string;
}

const RouteVideo: FC<IRouteVideoProps> = ({ videoUrl, title, route_video_thumbnail }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenWidth = useResize();
  const isMobile = screenWidth <= 768;

  if (!videoUrl) return null;

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Проверяем, является ли URL видеофайлом
  const isVideoFile = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  if (!isVideoFile(videoUrl)) {
    console.warn(`URL ${videoUrl} не является поддерживаемым видеофайлом`);
    return null;
  }

  return (
    <section className={clsx(s.wrapper, 'container-40')}>
      <div className="container">
        <h2 className={clsx('title', 'title-m-32', 'text-left')}>
          Видеообзор <span>маршрута</span>
        </h2>
        
        <div className={clsx(s.content, 'content-block')}>
          {isLoading && !hasError && (
            <div className={s.loadingContainer}>
              <LoadingSkeleton height="400px" borderRadius="16px" />
            </div>
          )}
          
          {hasError && (
            <div className={s.error}>
              <p className="font-18-normal">Видео временно недоступно</p>
            </div>
          )}

          <div className={clsx(s.videoWrapper, { [s.hidden]: isLoading || hasError })}>
            <div className={s.videoContainer}>
              <video
                ref={videoRef}
                className={s.video}
                src={`${BASE_URL}${videoUrl}`}
                title={title || "Видео маршрута"}
                controls
                playsInline
                preload="metadata"
                onLoadedData={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                onPause={handlePause}
                onEnded={handleVideoEnd}
                poster={`${BASE_URL}/static-images${route_video_thumbnail}`}
              />
              
              {!isPlaying && !isLoading && !hasError && (
                <button 
                  className={s.playButton}
                  onClick={handlePlay}
                  aria-label="Воспроизвести видео"
                >
                    {isMobile ? <PlayIconMobile /> : <PlayIcon />}
                </button>
              )}
            </div>
            
            <div className={s.videoInfo}>
              <h3 className={clsx('font-24-medium', 'margin-b-16')}>
                {title || 'Маршрут'} в деталях
              </h3>
              <p className="font-16-normal">
                Посмотрите обзор маршрута, чтобы лучше понять особенности поездки, 
                условия на дороге и что вас ожидает в пути.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteVideo;