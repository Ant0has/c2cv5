'use client';

import { mailService } from "@/shared/services/mail.service";
import { Blocks, ButtonTypes } from "@/shared/types/enums";
import { IMailRequest } from "@/shared/types/types";
import { Form, FormInstance, Input, notification } from "antd";
import Link from "next/link";
import { FC, useState } from "react";
import Button from "../../ui/Button/Button";
import s from './QuestionForm.module.scss';

interface IProps {
  buttonText?: string
  className?: string
  form?: FormInstance,
  blockFrom: Blocks | null
  handleClickLink: () => void
  handleClose?: (isResetForm?: boolean) => void
}

const QuestionForm: FC<IProps> = ({ buttonText, className, form, handleClickLink, handleClose }) => {
  const [api, contextHolder] = notification.useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async () => {
    try {
      setIsSubmitting(true);
      const requestBody: IMailRequest = {
        ...form?.getFieldsValue(),
        type: 'question'
      }
      delete requestBody.status
      await mailService.sendMail(requestBody);

      api.success({
        message: 'Вопрос успешно отправлен',
        description: 'Мы свяжемся с вами в ближайшее время',
        placement: 'topRight',
      });

      if (handleClose) {
        handleClose(true);
      }
    } catch (error: unknown) {
      api.error({
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
      {contextHolder}
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
          label={<span className="font-14-normal">Введите ваше ФИО<span className="font-14-normal orange-color" >*</span></span>}
          name="name"
          rules={[
            {
              required: true,
              message: <span className="font-14-normal orange-color">Пожалуйста, введите ваше полное имя</span>
            },
          ]}
        >
          <Input placeholder="Ваше имя" />
        </Form.Item>

        <Form.Item
          label={<span className="font-14-normal">Ваш номер телефона<span className="font-14-normal orange-color" >*</span></span>}
          name="phone"
          rules={[
            {
              required: true,
              message: <span className="font-14-normal orange-color">Пожалуйста, введите ваш номер телефона</span>
            },
            {
              pattern: /^[0-9+()]+$/,
              message: <span className="font-14-normal orange-color">Введите корректный номер телефона</span>
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
          <p className="font-14-normal">Нажимая на кнопку, вы соглашаетесь на обработку <Link onClick={handleClickLink} className="font-14-normal orange-color" href="privacy-policy">персональных данных</Link></p>
        </div>
      </Form>
    </>
  );
};

export default QuestionForm;
