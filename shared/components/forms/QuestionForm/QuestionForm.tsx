'use client';

import { ButtonTypes } from "@/shared/types/enums";
import { Form, FormInstance, Input } from "antd";
import { FC } from "react";
import Button from "../../ui/Button/Button";
import s from './QuestionForm.module.scss';
import Link from "next/link";

interface IProps {
  buttonText?: string
  className?: string
  form?: FormInstance
  handleClickLink?: () => void
}

const QuestionForm: FC<IProps> = ({ buttonText, className, form, handleClickLink }) => {
  return (
    <Form
      form={form}
      name="questionForm"
      layout="vertical"
      onFinish={() => undefined}
      onFinishFailed={() => undefined}
      // style={{ maxWidth: 485 }}
      requiredMark={false}
      className={className}
    >
      <Form.Item
        label={<span className="font-14-normal">Введите ваше ФИО<span className="font-14-normal orange-color" >*</span></span>}
        name="fullName1"
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
        name="phoneNumber1"
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
        <Button type={ButtonTypes.PRIMARY} text={buttonText ?? 'Задать вопрос'} />
        <p className="font-14-normal">Нажимая на кнопку, вы соглашаетесь на обработку <Link onClick={handleClickLink} className="font-14-normal orange-color" href="privacy-policy">персональных данных</Link></p>
      </div>
    </Form>
  );
};

export default QuestionForm;
