"use-client";

import { formatPhoneNumber } from "@/shared/services/formate-phone-number";
import { Blocks, ButtonTypes } from "@/shared/types/enums";
import clsx from "clsx";
import Image from "next/image";
import { FC, useContext } from "react";
import Button from "../../../../shared/components/ui/Button/Button";
import s from "./OrderSteps.module.scss";
import OrderStepsContent from "./OrderStepsContent/OrderStepsContent";

import { ModalContext } from "@/app/providers";
import bigCarImage from "@/public/images/cars/car-big.png";
import bigCarMilitaryImage from "@/public/images/military/cars/car-big.png";
import { requisitsData } from "@/shared/data/requisits.data";

interface IProps {
  isMilitary?: boolean;
}

const OrderSteps: FC<IProps> = ({ isMilitary }) => {
  const { setQuestionModalData } = useContext(ModalContext);

  const {markedPhone:markedPhoneFirst,phone:phoneFirst} = formatPhoneNumber(requisitsData.PHONE)

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, "container-24")}>
        <OrderStepsContent />

        <div className={s.actions}>
          <Button
            type={ButtonTypes.PRIMARY}
            text="Заказать поездку"
            handleClick={() =>
              setQuestionModalData({
                status: true,
                blockFrom: Blocks.ORDER_STEPS,
              })
            }
          />
          <div className={s.contacts}>
            <span className="font-14-normal black-color">
              Закажите такси онлайн или по телефону{" "}
            </span>{" "}
            <a
              href={`tel:${phoneFirst}`}
              className="font-14-normal orange-color"
            >
              {markedPhoneFirst}
            </a>
          </div>
        </div>

        <div className={s.imageContainer} style={{ position: 'relative', aspectRatio: '1847/913' }}>
          <Image
            src={isMilitary ? bigCarMilitaryImage : bigCarImage}
            alt="car"
            fill
            sizes="(max-width: 480px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw"
            quality={
              typeof window !== "undefined" && window.innerWidth < 768 ? 75 : 85
            }
            className={s.image}
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
