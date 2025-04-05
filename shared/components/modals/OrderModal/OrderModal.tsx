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
  const { orderModalData, setOrderModalData } = useContext(ModalContext)

  const [form] = Form.useForm();

  return (
    <Modal
      centered
      forceRender
      destroyOnClose
      open={orderModalData.status}
      onCancel={() => {
        setOrderModalData({ status: false })
        form.resetFields()
      }}
      title={<ModalTitle title="Заказать такси" description="Надежные пассажирские перевозки" />}
      footer={false}
      width={588}
    >
      <OrderForm
        form={form}
        orderModalData={orderModalData}
        handleClickLink={() => {
          setOrderModalData({ status: false })
        }}
        handleClose={() => {
          setOrderModalData({ status: false })
          form.resetFields()
        }} />
    </Modal>
  )
}

export default OrderModal;