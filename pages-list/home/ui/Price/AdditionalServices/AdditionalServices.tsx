import { IPriceOptions } from "@/shared/types/types";
import clsx from "clsx";
import { FC } from "react";
import s from './AdditionalServices.module.scss';

interface IProps {
  services: IPriceOptions[]
}

const AdditionalServices: FC<IProps> = ({ services }) => {

  return (
    <div className={s.services}>
      {services.map(service => (
        <div key={service.id} className={s.row}>
          <div className={clsx(s.label, 'font-16-normal')}>{service.label}</div>
          <div className={clsx(s.value, 'font-16-normal')}>{service.value}</div>
        </div>
      ))}
    </div>
  )
}

export default AdditionalServices;
