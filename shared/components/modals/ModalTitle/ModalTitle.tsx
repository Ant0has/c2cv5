import { FC } from "react";
import s from './ModalTitle.module.scss'

interface IProps {
  title: string
  description?: string
}

const ModalTitle: FC<IProps> = ({ title, description }) => {

  return (
    <div className={s.title}>
      <h5>{title}</h5>
      {description && <p>{description}</p>}
    </div>
  )
}

export default ModalTitle;