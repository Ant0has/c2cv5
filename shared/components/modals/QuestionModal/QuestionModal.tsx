// shared/components/modals/QuestionModal/QuestionModal.tsx
'use client'

import { ModalContext } from "@/app/providers";
import { Form, Modal } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import QuestionForm from "../../forms/QuestionForm/QuestionForm";
import ModalTitle from "../ModalTitle/ModalTitle";

const QuestionModal: FC = () => {
  const { questionModalData, setQuestionModalData } = useContext(ModalContext)
  const [form] = Form.useForm();
  const [isMounted, setIsMounted] = useState(false);

  // Решение для гидрации - рендерим только на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      centered
      destroyOnClose
      open={questionModalData?.status || false}
      onCancel={() => {
        setQuestionModalData?.({
          status: false,
          blockFrom: null
        })
        form.resetFields()
      }}
      title={<ModalTitle title="Получить консультацию" description="Услуги качественного сервиса заказа такси в России" />}
      footer={false}
      width={588}
    >
      <QuestionForm
        blockFrom={questionModalData?.blockFrom || null}
        handleClickLink={() => {
          setQuestionModalData?.({
            status: false,
            blockFrom: null
          })
        }}
        form={form}
        buttonText='Получить консультацию'
        handleClose={(isResetForm?: boolean) => {
          setQuestionModalData?.({ status: false, blockFrom: null })
          isResetForm && form.resetFields()
        }}
      />
    </Modal>
  )
}

export default QuestionModal;