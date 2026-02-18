'use client';

import { mailService } from "@/shared/services/mail.service";
import { Blocks, ButtonTypes } from "@/shared/types/enums";
import { IMailRequest } from "@/shared/types/types";
import { Form, FormInstance, Input, notification } from "antd";
import Link from "next/link";
import { FC, useContext, useMemo, useState } from "react";
import Button from "../../ui/Button/Button";
import s from './QuestionForm.module.scss';
import { ModalContext } from "@/app/providers";
import clsx from "clsx";

interface IProps {
  buttonText?: string
  className?: string
  theme?: 'dark' | 'light'
  form?: FormInstance,
  blockFrom: Blocks | null
  dataToSend?: {
    deliveryWeight?: string
    order_from?: string
    order_to?: string
    price?: number
  }
  handleClickLink: () => void
  handleClose?: (isResetForm?: boolean) => void
}

const QuestionForm: FC<IProps> = ({ buttonText, className, form, handleClickLink, handleClose, theme, dataToSend }) => {
  const { orderModalData, setOrderModalData } = useContext(ModalContext)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAdditionalInfo = useMemo(() => {
    const additionalInfo = [];
    if (dataToSend?.deliveryWeight) {
      additionalInfo.push(`\n Вес груза: ${dataToSend.deliveryWeight}`);
    }
    if (dataToSend?.price) {
      additionalInfo.push(`\n Стоимость: ${dataToSend.price}`);
    }
    return additionalInfo.join('');
  }, [dataToSend])


  const handleSubmitForm = async () => {
    try {
      setIsSubmitting(true);
      const requestBody: IMailRequest = {
        ...orderModalData,
        ...form?.getFieldsValue(),
        order_from: orderModalData.order_from || dataToSend?.order_from || 'Не указано',
        order_to: orderModalData.order_to || dataToSend?.order_to || 'Не указано',
        type: 'question',
        additional_info: addAdditionalInfo,

      }
      delete requestBody.status
      await mailService.sendMail(requestBody);

      notification.success({
        message: 'Вопрос успешно отправлен',
        description: 'Мы свяжемся с вами в ближайшее время',
        placement: 'topRight',
      });

      if (handleClose) {
        handleClose(true);
      }
    } catch (error: unknown) {
      notification.error({
        message: 'Ошибка при отправке вопроса',
        placement: 'topRight',
      });

      if (handleClose) {
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form
        form={form}
        name="questionForm"
        layout="vertical"
        onFinish={handleSubmitForm}
        onFinishFailed={() => undefined}
        // style={{ maxWidth: 485 }}
        requiredMark={false}
        className={className}
      >
        <Form.Item
          label={<span className="font-14-normal">Введите ваше ФИО<span className="font-14-normal text-primary" >*</span></span>}
          name="name"
          rules={[
            {
              required: true,
              message: <span className="font-14-normal text-primary">Пожалуйста, введите ваше полное имя</span>
            },
          ]}
        >
          <Input placeholder="Ваше имя" />
        </Form.Item>

        <Form.Item
          label={<span className="font-14-normal">Ваш номер телефона<span className="font-14-normal text-primary" >*</span></span>}
          name="phone"
          rules={[
            {
              required: true,
              message: <span className="font-14-normal text-primary">Пожалуйста, введите ваш номер телефона</span>
            },
            {
              pattern: /^[0-9+()]+$/,
              message: <span className="font-14-normal text-primary">Введите корректный номер телефона</span>
            },
          ]}
        >
          <Input
            placeholder="Номер телефона" />
        </Form.Item>

        <div className={s.bottom}>
          <Button
            type={ButtonTypes.PRIMARY}
            text={buttonText ?? 'Задать вопрос'}
            loading={isSubmitting}
          />
          <p className={clsx("font-14-normal", theme === 'dark' ? 'text-white' : 'text-black')}>Нажимая на кнопку, вы соглашаетесь на обработку <Link onClick={handleClickLink} className="font-14-normal text-primary" href="privacy-policy">персональных данных</Link></p>
        </div>
      </Form>
    </>
  );
};

export default QuestionForm;
