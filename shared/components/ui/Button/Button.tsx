'use-clint'

import { ButtonTypes } from "@/shared/types/enums";
import { FC, ReactElement } from "react";
import s from './Button.module.scss'
import clsx from "clsx";

interface IButtonProps {
  type: ButtonTypes,
  link?: string
  linkType?: string
  icon?: ReactElement
  text?: string
  className?: string,
  handleClick?: () => void
}

const Button: FC<IButtonProps> = (props) => {
  const { type,
    link,
    icon,
    text,
    className,
    handleClick } = props

  if (type === ButtonTypes.LINK) {
    return <a
      target="_blank"
      href={link}
      className={clsx(s.buttonLink, className)}
    >
      {icon && <i className={s.icon}>{icon}</i>}
      {text && <span className={'font-14-medium'}>{text}</span>}
    </a>
  }

  return (
    <button className={clsx(s.button, s[type], 'font-16-medium')} onClick={handleClick}>
      {icon && <i className={s.icon}>{icon}</i>}
      {text && <span className={clsx('font-16-medium', s.text)}>{text}</span>}
    </button>
  )
}

export default Button;
