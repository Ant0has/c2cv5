'use client'
import Button from "@/shared/components/ui/Button/Button";
import { useIsMobile } from "@/shared/hooks/useResize";
import { mailService } from "@/shared/services/mail.service";
import { ButtonTypes } from "@/shared/types/enums";
import { Form, Input, notification, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from './BusinessDeliveryHeroForm.module.scss'
import { weightOptions } from "@/shared/constants";

const buttonStyle = {
    height: '56px !important',
    fontSize: '18px !important',
}

const whenOptions = [
    { label: 'Сегодня', value: "Сегодня" },
    { label: 'Завтра', value: "Завтра" },
    { label: 'Послезавтра', value: "Послезавтра" },
    { label: 'В следующий понедельник', value: "В следующий понедельник" },
    { label: 'В следующий вторник', value: "В следующий вторник" },
    { label: 'В следующий среду', value: "В следующий среду" },
    { label: 'В следующий четверг', value: "В следующий четверг" },
    { label: 'В следующий пятницу', value: "В следующий пятницу" },
    { label: 'В следующий субботу', value: "В следующий субботу" },
    { label: 'В следующий воскресенье', value: "В следующий воскресенье" },
    { label: 'Через неделю', value: "Через неделю" },
    { label: 'Через 2 недели', value: "Через 2 недели" },
    { label: 'Через 3 недели', value: "Через 3 недели" },
    { label: 'Через месяц', value: "Через месяц" },
]

const fieldClasses = {
    fieldBlock: 'bg-gray border-radius-12 padding-16 flex flex-col gap-4 border-1 border-transparent',
}

interface FormValues {
    departurePoint: string
    arrivalPoint: string
    weight: string
    when: string
    name: string
    phone: string
}

const initialValues: FormValues = {
    departurePoint: '',
    arrivalPoint: '',
    weight: 'До 5 кг',
    when: 'Завтра',
    name: '',
    phone: '',
}

interface FieldError {
    field: keyof FormValues
    message: string
}

const BusinessDeliveryHeroForm = () => {
    const [form] = useForm<FormValues>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isMobile = useIsMobile()
    const [errors, setErrors] = useState<FieldError[]>([])
    const [values, setValues] = useState<FormValues>(initialValues)

    const getFieldError = (field: keyof FormValues) => {
        return errors.find(error => error.field === field)?.message
    }

    const hasFieldError = (field: keyof FormValues) => {
        return errors.some(error => error.field === field)
    }

    const validateForm = (values: FormValues): FieldError[] => {
        const newErrors: FieldError[] = []

        if (!values.name || values.name.trim() === '') {
            newErrors.push({ field: 'name', message: 'Введите имя' })
        }

        if (!values.phone || values.phone.trim() === '') {
            newErrors.push({ field: 'phone', message: 'Введите телефон' })
        } else {
            const phoneRegex = /^[0-9+\-\s()]{10,20}$/
            if (!phoneRegex.test(values.phone)) {
                newErrors.push({ field: 'phone', message: 'Введите корректный телефон' })
            }
        }

        if (!values.departurePoint || values.departurePoint.trim() === '') {
            newErrors.push({ field: 'departurePoint', message: 'Введите точку отправления' })
        }

        if (!values.arrivalPoint || values.arrivalPoint.trim() === '') {
            newErrors.push({ field: 'arrivalPoint', message: 'Введите точку прибытия' })
        }

        if (!values.weight || values.weight.trim() === '') {
            newErrors.push({ field: 'weight', message: 'Выберите вес груза' })
        }

        if (!values.when || values.when.trim() === '') {
            newErrors.push({ field: 'when', message: 'Выберите время' })
        }

        return newErrors
    }

    const handleFieldChange = (field: keyof FormValues, value: string) => {
        setValues(prev => ({ ...prev, [field]: value } as FormValues))
        setErrors(prev => prev.filter(error => error.field !== field))
    }

    const handleHeroFormSubmit = async () => {
        try {
            const validationErrors = validateForm(values as FormValues)
            if (validationErrors.length > 0) {
                setErrors(validationErrors)

                notification.error({
                    message: 'Ошибка валидации',
                    description: validationErrors[0].message,
                    placement: 'topRight',
                })
                return
            }

            setIsSubmitting(true)

            await mailService.sendMail({
                name: values.name,
                phone: values.phone,
                block: 'Доставка грузов',
                order_from: values.departurePoint,
                order_to: values.arrivalPoint,
                additional_info: `
                Вес груза: ${values.weight},
                Когда забрать: ${values.when}
                `
            })

            notification.success({
                message: 'Заявка отправлена!',
                description: 'Мы свяжемся с вами в течение 15 минут',
                placement: 'topRight',
            })

            setValues({
                ...initialValues
            })
            setErrors([])
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
                <span className="font-14-normal text-secondary"> Ответим через 5 минут. <span className="font-14-normal text-primary">Цена — сразу</span></span>
            </div>
            <Form<FormValues>
                form={form}
                name="heroForm"
                className="flex flex-col gap-8"
                layout="vertical"
                onFinish={handleHeroFormSubmit}
                requiredMark={false}
            >
                <div className={clsx('flex gap-8 flex-col', { 'grid grid-auto-flow-row grid-cols-2': !isMobile })}>
                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('name')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Имя <span className="font-14-normal text-error">*</span>
                            </span>
                            <Input
                                className={clsx(styles.input, { 'border-error': hasFieldError('name') })}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                value={values.name}
                            />
                        </div>
                        {getFieldError('name') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('name')}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('phone')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Телефон <span className="font-14-normal text-error">*</span>
                            </span>
                            <Input
                                className={clsx(styles.input, { 'border-error': hasFieldError('phone') })}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                value={values.phone}
                            />
                        </div>
                        {getFieldError('phone') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('phone')}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('departurePoint')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Точка отправления <span className="font-14-normal text-error">*</span>
                            </span>
                            <Input
                                className={clsx(styles.input, { 'border-error': hasFieldError('departurePoint') })}
                                onChange={(e) => handleFieldChange('departurePoint', e.target.value)}
                                value={values.departurePoint}
                            />
                        </div>
                        {getFieldError('departurePoint') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('departurePoint')}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('arrivalPoint')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Точка прибытия <span className="font-14-normal text-error">*</span>
                            </span>
                            <Input
                                className={clsx(styles.input, { 'border-error': hasFieldError('arrivalPoint') })}
                                onChange={(e) => handleFieldChange('arrivalPoint', e.target.value)}
                                value={values.arrivalPoint}
                            />
                        </div>
                        {getFieldError('arrivalPoint') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('arrivalPoint')}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('weight')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Вес груза <span className="font-14-normal text-error">*</span>
                            </span>
                            <Select
                                className={clsx(styles.select, { 'border-error': hasFieldError('weight') })}
                                options={weightOptions}
                                onChange={(value) => handleFieldChange('weight', value)}
                                value={values.weight}
                            />
                        </div>
                        {getFieldError('weight') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('weight')}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className={clsx(fieldClasses.fieldBlock, {
                            'border-error': hasFieldError('when')
                        })}>
                            <span className="font-14-normal text-secondary">
                                Когда забрать <span className="font-14-normal text-error">*</span>
                            </span>
                            <Select
                                options={whenOptions}
                                onChange={(value) => handleFieldChange('when', value)}
                                className={clsx(styles.select, { 'border-error': hasFieldError('when') })}
                                value={values.when}
                            />
                        </div>
                        {getFieldError('when') && (
                            <span className="font-14-normal text-error margin-t-4">{getFieldError('when')}</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-16">
                    <Button
                        className="flex-1"
                        type={ButtonTypes.PRIMARY}
                        text="Рассчитать доставку"
                        loading={isSubmitting}
                        style={buttonStyle}
                    />
                    <span className="max-width-220 font-14-normal text-secondary">Рассчитайте предварительную стоимость за 30 секунд</span>
                </div>
            </Form>
        </div>
    )
}

export default BusinessDeliveryHeroForm;