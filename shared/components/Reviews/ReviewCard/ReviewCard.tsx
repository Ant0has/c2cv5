import { formatDate } from '@/shared/services/formate-date';
import { IReviewData } from '@/shared/types/types';
import { Rate } from 'antd';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import s from './ReviewCard.module.scss';

interface IProps {
  review: IReviewData,
  avatar: StaticImageData
}

const ReviewCard: FC<IProps> = ({ review, avatar }) => {
  return (
    <div className={s.card}>
      <div className={s.top}>
        <div className={s.avatar}>
          <Image src={avatar} alt='avatar' width={100} height={100} />
        </div>
        <div className={s.info}>
          <div className={clsx(s.username, 'font-16-medium')}>{review.username}</div>
          <div className={clsx(s.city, 'font-14-normal')}>{review.city}</div>

          <div className={s.rate}><Rate disabled value={review.rate} /></div>
          <div className={clsx(s.date, 'font-14-normal gray-color')}>{formatDate(review.date)}</div>
        </div>
      </div>

      <div className={clsx(s.route, 'font-18-medium')}>{review.route}</div>

      <div className={clsx(s.review, 'font-16-normal')}>{review.review}</div>
    </div>
  )
}

export default ReviewCard;
