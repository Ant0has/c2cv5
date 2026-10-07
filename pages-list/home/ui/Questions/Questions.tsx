"use-client";

import Image from "next/image";
import QuestionForm from "../../../../shared/components/forms/QuestionForm/QuestionForm";
import s from "./Questions.module.scss";
import man from "@/public/images/man.png";
import manMilitary from "@/public/images/military/man.png";
import clsx from "clsx";
import { Blocks } from "@/shared/types/enums";
import { SERVICE_POLICY } from "@/shared/configs/service-policy";

const Questions = ({ isMilitary }: { isMilitary?: boolean }) => {
  return (
    <div className={clsx(s.wrapper, { [s.military]: isMilitary })}>
      <div className={clsx(s.container, "container-24")}>
        <div className={s.left}>
          <h2 className="title title-m-32">
            Остались <span>вопросы?</span>
          </h2>
          <p className="font-16-normal title-m-32">
            {SERVICE_POLICY.callback}
          </p>
          <QuestionForm blockFrom={Blocks.QUESTIONS} className="white-input" handleClickLink={()=>undefined} />
        </div>
        <div className={s.right}>
          <Image
            src={isMilitary ? manMilitary : man}
            alt="man"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            quality={85}
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Questions;
