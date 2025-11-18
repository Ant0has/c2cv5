// shared/components/modals/OrderModal/OrderModal.tsx
'use client'

import { ModalContext } from "@/app/providers";
import { Form, Modal } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import OrderForm from "../../forms/OrderForm/OrderForm";
import ModalTitle from "../ModalTitle/ModalTitle";

const OrderModal: FC = () => {
  const { orderModalData, setOrderModalData } = useContext(ModalContext);
  const [form] = Form.useForm();
  const [isMounted, setIsMounted] = useState(false);

  // Защита от гидрации - рендерим только после монтирования
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // На сервере не рендерим модалку
  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      centered
      destroyOnClose
      open={orderModalData?.status || false}
      onCancel={() => {
        setOrderModalData?.({ status: false });
        form.resetFields();
      }}
      title={<ModalTitle title="Заказать такси" description="Надежные пассажирские перевозки" />}
      footer={false}
      width={588}
    >
      <OrderForm
        form={form}
        orderModalData={orderModalData || { status: false }}
        handleClickLink={() => {
          setOrderModalData?.({ status: false });
        }}
        handleClose={(isResetForm?: boolean) => {
          setOrderModalData?.({ status: false });
          isResetForm && form.resetFields();
        }} 
      />
    </Modal>
  );
}

export default OrderModal;