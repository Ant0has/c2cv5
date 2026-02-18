'use client'
import { b2bGoals } from '@/shared/services/analytics.service'
import { Form, Input, notification } from "antd";
import { ButtonTypes } from "@/shared/types/enums";
import Button from "@/shared/components/ui/Button/Button";
import { useState } from "react";
import { mailService } from "@/shared/services/mail.service";
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import ChatIcon from "@/public/icons/ChatIcon";
import PhoneIcon from "@/public/icons/PhoneIcon";
    
const inputStyle = {
    width: '100% !important',
    backgroundColor: 'var(--light-gray) !important',
    borderColor: 'transparent !important',
    color: 'var(--dark) !important',
    fontSize: '16px !important',
    padding: '20px !important',
    paddingInline: '24px !important',
    height: '56px !important',
}

const buttonStyle = {
    width: '100% !important',
    height: '56px !important',
}

const BusinessHeroForm = () => {
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isMobile = useIsMobile()

    const handleHeroFormSubmit = async () => {
        try {
            setIsSubmitting(true)
            const values = form.getFieldsValue()

            await mailService.sendMail({
                name: values.name,
                phone: values.phone,
                block: 'B2B',
                order_from: 'Страница для бизнеса',
                order_to: 'Заявка на расчёт',
                additional_info: 'Запрос расчёта для юрлиц'
            })

            b2bGoals.formSubmit("hero")
            notification.success({
                message: 'Заявка отправлена!',
                description: 'Мы свяжемся с вами в течение 15 минут',
                placement: 'topRight',
            })

            form.resetFields()
        } catch (error) {
            notification.error({
                message: 'Ошибка при отправке',
                description: 'Попробуйте позвонить нам',
                placement: 'topRight',
            })
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className='margin-t-24 flex flex-col gap-16 padding-24 border-radius-24 bg-white'>
            <div className='flex justify-between items-center'>
                <h3 className="font-24-medium">Получить расчёт для юрлиц</h3>
                <span className="font-14-normal text-secondary"> Перезвоним в течение 15 минут</span>
            </div>
            <Form
                form={form}
                name="heroForm"
                className={clsx('flex gap-8', {'flex-col': isMobile}, {'grid grid-auto-flow-column grid-cols-2': !isMobile})}
                layout="horizontal"
                onFinish={handleHeroFormSubmit}
                requiredMark={false}
            >
                <Form.Item
                    name="name"
                    className="flex-1 w-full margin-b-0 gap-8"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input
                        prefix={<ChatIcon fill='var(--dark-secondary)' />}
                        placeholder="Ваше имя"
                        style={inputStyle}
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    className="flex-1 w-full margin-b-0 gap-8"
                    rules={[
                        { required: true, message: 'Введите телефон' },
                        { pattern: /^[0-9+() -]+$/, message: 'Некорректный номер' }
                    ]}
                >
                    <Input
                        prefix={<PhoneIcon fill='var(--dark-secondary)' />}
                        placeholder="Ваш телефон"
                        style={inputStyle}
                    />
                </Form.Item>
                <Form.Item className="width-full margin-b-0">
                    <Button
                        className="flex-1 w-full margin-b-0"
                        type={ButtonTypes.PRIMARY}
                        text="Получить расчёт"
                        loading={isSubmitting}
                        style={buttonStyle}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default BusinessHeroForm;