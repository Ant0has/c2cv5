import clsx from 'clsx';
import s from './TextPageLayout.module.scss';
import Breadcrumbs from '@/shared/components/Breadcrumbs/Breadcrumbs';

interface IProps {
    children: React.ReactNode;
    title: string;
    breadcrumbs?: boolean;
    articleClassName?: string;
}

const TextPageLayout = ({ children, title, breadcrumbs = true, articleClassName = 'default-tag' }: IProps) => {
    return (
        <div className={'container'}>
            <div className={s.inner}>
                <Breadcrumbs />
                <h1 className={clsx('title', s.title)}>{title}</h1>
                <article className={articleClassName}>
                    {children}
                </article>
            </div>
        </div>
    );
};

export default TextPageLayout;