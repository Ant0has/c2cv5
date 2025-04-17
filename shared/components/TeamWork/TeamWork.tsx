import { FC } from "react";
import s from "./TeamWork.module.scss";
import Image from "next/image";
import clsx from "clsx";

import step1 from "@/public/images/step-1.png";
import step2 from "@/public/images/step-2.png";
import step3 from "@/public/images/step-3.png";
import step4 from "@/public/images/step-4.png";
import step5 from "@/public/images/step-5.png";

interface IProps {
  title?: unknown;
}

const TeamWork: FC<IProps> = () => {

  const imageAtrs = {
    width:378,
    height:317,
    layout:"responsive",
    sizes:"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 378px",
    quality:85
  }
  return (
    <div className={s.grid}>
      <div className={s.cell}>
        <Image
          src={step1}
          alt="step-1"
          {...imageAtrs}
        />
      </div>

      <div className={clsx(s.cell, s.text)}>
        <p className="font-32-semibold orange-color">№1</p>
        <p className={clsx(s.description, "font-16-normal")}>
          Работаем с поддержкой мероприятий больших объемов распределенных по
          разным городам и часовым поясам
        </p>
      </div>

      <div className={s.cell}>
        <Image
          src={step2}
          alt="step-2"
          {...imageAtrs}
        />
      </div>

      <div className={clsx(s.cell, s.text)}>
        <p className="font-32-semibold orange-color">№2</p>
        <p className={clsx(s.description, "font-16-normal")}>
          Перевозим большие группы людей как на короткие так и на сверхдальние
          расстояния
        </p>
      </div>

      <div className={s.cell}>
        <Image
          src={step3}
          alt="step-3"
          {...imageAtrs}
        />
      </div>

      <div className={clsx(s.cell, s.text)}>
        <p className="font-32-semibold orange-color">№3</p>
        <p className={clsx(s.description, "font-16-normal")}>
          Реализуем сложные задачи по перевозке грузов и особо важных пассажиров
        </p>
      </div>

      <div className={s.cell}>
        <Image
          src={step4}
          alt="step-4"
          {...imageAtrs}
        />
      </div>

      <div className={clsx(s.cell, s.text)}>
        <p className="font-32-semibold orange-color">№4</p>
        <p className={clsx(s.description, "font-16-normal")}>
          Бухгалтерская ответственность в любов виде. Счёт. Договор. Закрывающие
          Акты. Электронный документооборот. Чек с QR кодом с возможностью
          удаленной оплаты за пассажира
        </p>
      </div>

      <div className={s.cell}>
        <Image
          src={step5}
          alt="step-5"
          {...imageAtrs}
        />
      </div>
    </div>
  );
};

export default TeamWork;
