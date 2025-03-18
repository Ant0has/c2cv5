'use-client'

import Image from "next/image";
import QuestionForm from "../forms/QuestionForm/QuestionForm";
import s from './Questions.module.scss'
import man from '@/public/images/man.png'
import clsx from "clsx";

const Questions = () => {
  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, "container-24")}>
        <div className={s.left}>
          <h2 className="title title-m-32">Остались <span>вопросы?</span></h2>
          <p className="font-16-normal title-m-32">Отправьте заявку и наш менеджер свяжется с Вами в течении 5-ти минут.</p>
          <QuestionForm className="white-input" />
        </div>
        <div className={s.right}>
          <Image src={man} alt="man" objectFit="contain" layout="fill" />
        </div>
      </div>
    </div>
  )
}

export default Questions;
