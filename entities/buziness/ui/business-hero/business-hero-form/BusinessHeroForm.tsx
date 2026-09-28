'use client'
import { b2bGoals } from '@/shared/services/analytics.service'
import { Form, Input, notification } from "antd";
import { ButtonTypes } from "@/shared/types/enums";
import Button from "@/shared/components/ui/Button/Button";
import { useRef, useState } from "react";
import { mailService } from "@/shared/services/mail.service";
import { normalizePhoneNumber } from "@/shared/lib/phone-number";
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import ChatIcon from "@/public/icons/ChatIcon";
import PhoneIcon from "@/public/icons/PhoneIcon";
    
const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--light-gray)',
    borderColor: 'transparent',
    color: 'var(--dark)',
    fontSize: '16px',
    padding: '20px',
    paddingInline: '24px',
    height: '56px',
}

const buttonStyle = {
    width: '100%',
    height: '56px',
}

interface HeroFormValues {
    name: string
    phone: string
}

const BusinessHeroForm = () => {
    const [form] = Form.useForm<HeroFormValues>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submittingRef = useRef(false)
    const isMobile = useIsMobile()

    const handleHeroFormSubmit = async (values: HeroFormValues) => {
        if (submittingRef.current) return
        const phone = normalizePhoneNumber(values.phone)
        if (!phone) {
            form.setFields([{ name: 'phone', errors: ['Введите корректный телефон'] }])
            return
        }

        submittingRef.current = true
        try {
            setIsSubmitting(true)

            await mailService.sendMail({
                name: values.name,
                phone,
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
            submittingRef.current = false
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
                        {
                            validator: (_, value) => !value || normalizePhoneNumber(value)
                                ? Promise.resolve()
                                : Promise.reject(new Error('Введите корректный телефон'))
                        }
                    ]}
                >
                    <Input
                        type="tel"
                        autoComplete="tel"
                        prefix={<PhoneIcon fill='var(--dark-secondary)' />}
                        placeholder="Ваш телефон"
                        style={inputStyle}
                    />
                </Form.Item>
                <Form.Item className="width-full margin-b-0">
                    <Button
                        className="flex-1 w-full margin-b-0"
                        type={ButtonTypes.PRIMARY}
                        htmlType="submit"
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
