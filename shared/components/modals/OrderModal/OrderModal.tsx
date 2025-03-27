'use client'

import { ModalContext } from "@/app/providers";
import { Form, Modal } from "antd";
import { FC, useContext } from "react";
import OrderForm from "../../forms/OrderForm/OrderForm";
import ModalTitle from "../ModalTitle/ModalTitle";

interface IProps {
  title?: unknown
}

const OrderModal: FC<IProps> = () => {
  const { isOpenOrderModal, setIsOpenOrderModal } = useContext(ModalContext)

  const [form] = Form.useForm();

  return (
    <Modal
      centered
      forceRender
      destroyOnClose
      open={isOpenOrderModal}
      onCancel={() => {
        setIsOpenOrderModal(false)
        form.resetFields()
      }}
      title={<ModalTitle title="Заказать такси" description="Надежные пассажирские перевозки" />}
      footer={false}
      width={588}
    >
      <OrderForm form={form} buttonText='Получить консультацию' />
    </Modal>
  )
}

export default OrderModal;