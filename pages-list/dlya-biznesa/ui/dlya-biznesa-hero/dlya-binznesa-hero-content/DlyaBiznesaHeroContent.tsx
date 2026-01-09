'use client'
import { companyAdvantagesList, companyExperienceList } from "@/pages-list/dlya-biznesa/utils/data";
import CheckIcon from "@/public/icons/CheckIcon";
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import { FC } from "react";
import s from './DlyaBiznesaHeroContent.module.scss';

interface IProps {
  title?: unknown;
}

const DlyaBiznesaHeroContent: FC<IProps> = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <h2 className={clsx("text-white title font-64-medium margin-b-24", {'font-48-medium text-center': isMobile})}> Трансфер <span className="text-primary">для бизнеса</span></h2>

      <p className={clsx(s.description, 'font-24-medium text-white margin-b-32')}>Бронируйте заранее — машина гарантированно будет</p >

      <ul className='flex col-flex-16 margin-b-40'>
        {
          companyAdvantagesList.map(advantage => (
            <li key={advantage} className={'flex items-center  gap-16'}>
              <CheckIcon fill='var(--white)' />
              <p className="font-18-normal text-white">{advantage}</p>
            </li>
          ))
        }
      </ul>

      <ul className={clsx('grid gap-16', {'grid-auto-flow-row grid-cols-2': isMobile},{'grid-auto-flow-column grid-cols-3': !isMobile})}>
        {
          companyExperienceList.map(experience => (
            <li key={experience.id} className={'flex flex-col items-center justify-center  gap-4 bg-primary border-radius-24 padding-16 text-center'}>
              <p className="font-32-semibold text-white">{experience.label}</p>
              <p className="font-14-semibold text-white">{experience.value}</p>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default DlyaBiznesaHeroContent;