// shared/components/modals/QuestionModal/QuestionModal.tsx
'use client'

import { ModalContext } from "@/app/providers";
import { Form, Modal } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import QuestionForm from "../../forms/QuestionForm/QuestionForm";
import ModalTitle from "../ModalTitle/ModalTitle";
import styles from './QuestionModal.module.scss';

const initialQuestionModalData = {
  status: false,
  blockFrom: null,
  order_from: '',
  order_to: ''
} as const

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
        setQuestionModalData?.(initialQuestionModalData)
        form.resetFields()
      }}
      title={<ModalTitle className={questionModalData?.theme === 'dark' ? styles.darkThemeModalTitle : styles.lightThemeModalTitle} title="Получить консультацию" description="Услуги качественного сервиса заказа такси в России" />}
      footer={false}
      width={588}
      className={questionModalData?.theme === 'dark' ? styles.darkThemeModal : styles.lightThemeModal}
    >
      <QuestionForm
        className={questionModalData?.theme === 'dark' ? styles.darkThemeModalForm : styles.lightThemeModalForm}
        blockFrom={questionModalData?.blockFrom || null}
        handleClickLink={() => {
          setQuestionModalData?.(initialQuestionModalData)
        }}
        form={form}
        theme={questionModalData?.theme || 'light'}
        buttonText='Получить консультацию'
        handleClose={(isResetForm?: boolean) => {
          setQuestionModalData?.(initialQuestionModalData)
          isResetForm && form.resetFields()
        }}
        dataToSend={{
          deliveryWeight: questionModalData?.deliveryWeight || undefined,
          order_from: questionModalData?.order_from || '',
          order_to: questionModalData?.order_to || '',
        }}
      />
    </Modal>
  )
}

export default QuestionModal;