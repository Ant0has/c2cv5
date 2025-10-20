import clsx from 'clsx';
import s from './HomeLayout.module.scss';

interface IHomeLayoutProps {
    children: React.ReactNode;
    className?: string;
    top?: React.ReactNode;
}
export const HomeLayout = ({ children, className, top }: IHomeLayoutProps) => {
    return (
        <div className={clsx('container-40', className)}>
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
		<div className={s.titleContainer}>
            <h2 className={clsx(s.title, 'font-56-medium black-color')}>
				{title}
				{titlePrimary && <span className="font-56-medium orange-color"> {titlePrimary}</span>}
            </h2>
            {description && <div className={s.description}>
                {description}
            </div>}
        </div>
    )
}
