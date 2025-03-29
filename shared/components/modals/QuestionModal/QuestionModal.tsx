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
  const { isOpenQuestionModal, setIsOpenQuestionModal } = useContext(ModalContext)

  const [form] = Form.useForm();

  return (
    <Modal
      centered
      forceRender
      destroyOnClose
      open={isOpenQuestionModal}
      onCancel={() => {
        setIsOpenQuestionModal(false)
        form.resetFields()
      }}
      title={<ModalTitle title="Получить консультацию" description="Услуги качественного сервиса заказа такси в России" />}
      footer={false}
      width={588}
    >
      <QuestionForm handleClickLink={() => {
        setIsOpenQuestionModal(false)
      }} form={form} buttonText='Получить консультацию' />
    </Modal>
  )
}

export default QuestionModal;