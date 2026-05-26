import { IPriceOptions } from "@/shared/types/types";
import { FC, ReactNode } from "react";
import s from './PriceOptions.module.scss'
import clsx from "clsx";

interface IProps {
  title: string
  options: IPriceOptions[]
  isMilitary?: boolean
  /** Опциональный слот между заголовком и таблицей опций (для CapacityBlock и т.п.) */
  slot?: ReactNode
}

const PriceOptions: FC<IProps> = ({ title, options, isMilitary, slot }) => {

  return (
    <div className={clsx(s.options, { [s.military]: isMilitary })}>
      <h3 className={clsx(s.title, 'font-24-medium')}>{title}</h3>

      {slot}

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