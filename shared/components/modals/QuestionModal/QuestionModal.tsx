'use client'

import { ModalContext } from "@/app/providers";
import { Form, Modal } from "antd";
import { FC, useContext } from "react";
import QuestionForm from "../../forms/QuestionForm/QuestionForm";
import ModalTitle from "../ModalTitle/ModalTitle";

interface IProps {
  title?: unknown
}

const QuestionModal: FC<IProps> = () => {
  const { questionModalData, setQuestionModalData } = useContext(ModalContext)

  const [form] = Form.useForm();

  return (
    <Modal
      centered
      forceRender
      destroyOnClose
      open={questionModalData.status}
      onCancel={() => {
        setQuestionModalData({
          status: false,
          blockFrom: null
        })
        form.resetFields()
      }}
      title={<ModalTitle title="Получить консультацию" description="Услуги качественного сервиса заказа такси в России" />}
      footer={false}
      width={588}
    >
      <QuestionForm blockFrom={questionModalData.blockFrom} handleClickLink={() => {
        setQuestionModalData({
          status: false,
          blockFrom: null
        })
      }} form={form} buttonText='Получить консультацию' />
    </Modal>
  )
}

export default QuestionModal;