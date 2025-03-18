'use client'

import { ModalContext } from "@/app/providers";
import { Modal } from "antd";
import { FC, useContext } from "react";
import ModalTitle from "../ModalTitle/ModalTitle";
import QuestionForm from "../../forms/QuestionForm/QuestionForm";

interface IProps {
  title?:unknown
}

const QuestionModal: FC<IProps> = () => {
  const { isOpenQuestionModal, setIsOpenQuestionModal } = useContext(ModalContext)



  return (
    <Modal
      centered
      forceRender
      destroyOnClose
      open={isOpenQuestionModal}
      onCancel={() => setIsOpenQuestionModal(false)}
      title={<ModalTitle title="Получить консультацию" description="Услуги качественного сервиса заказа такси в России" />}
      footer={false}
      width={588}
    >
      <QuestionForm buttonText='Получить консультацию' />
    </Modal>
  )
}

export default QuestionModal;