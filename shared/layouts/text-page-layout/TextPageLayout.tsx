import clsx from 'clsx';
import s from './TextPageLayout.module.scss';
import Breadcrumbs from '@/shared/components/Breadcrumbs/Breadcrumbs';

const TextPageLayout = ({ children,title }: { children: React.ReactNode,title: string }) => {
    return (
        <div className={'container'}>
            <div className={s.inner}>
                <Breadcrumbs />
                    <h1 className={clsx('title',s.title)}>{title}</h1>
                    {children}
            </div>
        </div>
    );
};

export default TextPageLayout;