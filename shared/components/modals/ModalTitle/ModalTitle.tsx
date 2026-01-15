import { FC } from "react";
import s from './ModalTitle.module.scss'
import clsx from "clsx";

interface IProps {
  title: string
  description?: string
  className?: string
}

const ModalTitle: FC<IProps> = ({ title, description, className }) => {

  return (
    <div className={clsx(s.title, className)}>
      <h5>{title}</h5>
      {description && <p>{description}</p>}
    </div>
  )
}

export default ModalTitle;