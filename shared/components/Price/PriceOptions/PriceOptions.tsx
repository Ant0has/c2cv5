import { IPriceOptions } from "@/shared/types/types";
import { FC } from "react";
import s from './PriceOptions.module.scss'
import clsx from "clsx";

interface IProps {
  title: string
  options: IPriceOptions[]
  isMilitary?: boolean
}

const PriceOptions: FC<IProps> = ({ title, options, isMilitary }) => {

  return (
    <div className={clsx(s.options, { [s.military]: isMilitary })}>
      <h3 className={clsx(s.title, 'font-24-medium')}>{title}</h3>

      <div className={s.table}>
        {options.map(option => (
          <div key={option.id} className={s.row}>
            <div className={clsx(s.label, 'font-18-normal')}>{option.label}</div>
            <div className={clsx(s.value, 'font-18-normal')}>{option.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PriceOptions;