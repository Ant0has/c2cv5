'use client'
import clsx from 'clsx';
import s from './HomeLayout.module.scss';
import { useIsMobile } from '@/shared/hooks/useResize';

interface IHomeLayoutProps {
    children: React.ReactNode;
    className?: string;
    top?: React.ReactNode;
}
export const HomeLayout = ({ children, className, top }: IHomeLayoutProps) => {
    const isMobile = useIsMobile();
    return (
        <div className={clsx('container', { 'padding-y-104': !isMobile }, className)}>
            {top && top}
            {children}
        </div >
    )
}

interface IHomeLayoutTitleProps {
    title: string;
    titlePrimary?: string;
    description?: string;
}

export const HomeLayoutTitle = ({ title, titlePrimary, description }:IHomeLayoutTitleProps) => {
    return (
		<div className={clsx('title-container flex justify-between items-center')}>
            <h2 className={'title'}>
				{title}
				{titlePrimary && <span className="text-primary"> {titlePrimary}</span>}
            </h2>
            {description && <div className={s.description}>
                {description}
            </div>}
        </div>
    )
}
