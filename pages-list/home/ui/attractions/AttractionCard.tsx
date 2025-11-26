import Image from 'next/image';
import s from './Attractions.module.scss';
import clsx from 'clsx';
import { BASE_URL } from '@/shared/constants';

interface IProps {
    title: string;
    subTitle: string
    description: string;
    image: string;
    isHorizontal?: boolean;
    tags?: Array<{
        name: string
        isPrimary?: boolean
    }>
}

const AttractionCard = ({ title, subTitle, isHorizontal, description, image, tags }: IProps) => {

    const getImageSize = () => {
        if (isHorizontal) {
            return "(max-width: 640px) 100vw, (max-width: 768px) 258px, (max-width: 1024px) 258px, 258px"
        }
        return "(max-width: 640px) 100vw, (max-width: 768px) 540px, (max-width: 1024px) 540px, 540px"
    }

    return (
        <div className={clsx(s.cardWrapper, isHorizontal && s.horizontalCardWrapper)}>
            <div className={s.cardContainer}>
                <div className={s.imageWrapper}>
                    <Image src={`${BASE_URL}/static-images${image}`} alt={title} fill
                        sizes={getImageSize()}
                    />
                    {tags && tags.length > 0 && (
                        <ul className={s.cardTags}>{
                            tags.map((tag) => (
                                <li className={clsx(s.cardTag, tag.isPrimary && s.primary)} key={tag.name}>{tag.name}</li>
                            ))
                        }</ul>
                    )}
                </div>

                <div className={s.cardContent}>
                    <div className={s.cardTop}>
                        <h5 className={clsx('font-24-medium')}>{title}</h5>
                        {subTitle && <span className={clsx('font-14-medium gray-color')}>{subTitle}</span>}

                    </div>
                    <div className={clsx('font-16-normal',s.attractionDescription)} dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>
        </div>
    )
}

export default AttractionCard;