'use client'
import CheckIcon from "@/public/icons/CheckIcon";
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import s from './BusinessHeroContent.module.scss';

interface Props {
  title: {text: string, isPrimary: boolean}[];
  description: string;
  bullets: string[];
  staticsList: {id: number, label: string, value: string}[];
}

const BusinessHeroContent = ({ title, description, bullets, staticsList }: Props) => {
  const isMobile = useIsMobile();

  const contentTitle = title.map(item => {
    if (item.isPrimary) {
      console.log(item.text);
      return <span key={item.text} className="text-primary">{` ${item.text} `}</span>
    }
    return `${item.text}`
  });


  return (
    <>
      <h1 className={clsx("text-white title font-64-medium margin-b-24", {'font-48-medium text-center': isMobile})}>{contentTitle}</h1>

      <p className={clsx(s.description, 'font-24-medium text-white margin-b-32')}>{description}</p >

      <ul className='flex col-flex-16 margin-b-40'>
        {
          bullets.map(advantage => (
            <li key={advantage} className={'flex items-center  gap-16'}>
              <CheckIcon fill='var(--white)' />
              <p className="font-18-normal text-white">{advantage}</p>
            </li>
          ))
        }
      </ul>

      <ul className={clsx('grid gap-16', {'grid-auto-flow-row grid-cols-2': isMobile},{'grid-auto-flow-column grid-cols-3': !isMobile})}>
        {
          staticsList.map(experience => (
            <li key={experience.id} className={'flex flex-col items-center justify-center gap-4 bg-primary border-radius-24 padding-16 text-center'}>
              <p className="font-32-semibold text-white whitespace-nowrap">{experience.label}</p>
              <p className="font-14-semibold text-white whitespace-nowrap">{experience.value}</p>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default BusinessHeroContent;