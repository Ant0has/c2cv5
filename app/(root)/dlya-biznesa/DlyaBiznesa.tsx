'use client'

import { ModalContext } from '@/app/providers'
import Button from '@/shared/components/ui/Button/Button'
import { mailService } from '@/shared/services/mail.service'
import { Blocks, ButtonTypes } from '@/shared/types/enums'
import { Form, Input, notification } from 'antd'
import { useContext, useState } from 'react'
import styles from './dlya-biznesa.module.scss'

// SVG Icons
const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconDocument = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const IconCar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6L19 10H5L8 6H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10H20V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V10Z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const IconUsers = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconClock = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
)

const IconChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconBuilding = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 21V11L19 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 13V13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const IconParty = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.8 11.3L2 22L12.7 18.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 3H4.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 8H22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 2H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 20H22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 2L12.7 11.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11L12 14L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconHelmet = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V18C22 16.8954 21.1046 16 20 16H4C2.89543 16 2 16.8954 2 18V18Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 16V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V16" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 16V14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14V16" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const IconPlane = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8C20.9996 7.64927 20.9071 7.3048 20.7315 7.00274C20.556 6.70068 20.3037 6.45165 20 6.28L13 2.28C12.696 2.10742 12.3511 2.01672 12 2.01672C11.6489 2.01672 11.304 2.10742 11 2.28L4 6.28C3.69626 6.45165 3.44398 6.70068 3.26846 7.00274C3.09294 7.3048 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9973C3.44398 17.2993 3.69626 17.5484 4 17.72L11 21.72C11.304 21.8926 11.6489 21.9833 12 21.9833C12.3511 21.9833 12.696 21.8926 13 21.72L20 17.72C20.3037 17.5484 20.556 17.2993 20.7315 16.9973C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09494 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4136 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function DlyaBiznesa() {
  const { setQuestionModalData } = useContext(ModalContext)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOrderClick = () => {
    setQuestionModalData({ status: true, blockFrom: Blocks.WELCOME })
  }

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

  const popularRoutes = [
    { from: 'Москва', to: 'Санкт-Петербург', price: 'от 12 000 ₽' },
    { from: 'Ростов-на-Дону', to: 'Краснодар', price: 'от 4 500 ₽' },
    { from: 'Москва', to: 'Казань', price: 'от 15 000 ₽' },
    { from: 'Санкт-Петербург', to: 'Великий Новгород', price: 'от 5 000 ₽' },
    { from: 'Краснодар', to: 'Сочи', price: 'от 5 500 ₽' },
    { from: 'Москва', to: 'Нижний Новгород', price: 'от 8 000 ₽' },
  ]

  const reviews = [
    {
      name: 'Алексей Петров',
      company: 'ООО "ТехноСервис"',
      text: 'Работаем с City2City уже 2 года. Отличный сервис для корпоративных перевозок. Водители всегда пунктуальны, документы оформляются быстро.',
      rating: 5
    },
    {
      name: 'Елена Смирнова',
      company: 'HR-директор "Альфа Групп"',
      text: 'Используем для доставки сотрудников на вахту. Очень удобно работать по договору, все прозрачно. Рекомендую для крупных компаний.',
      rating: 5
    },
    {
      name: 'Дмитрий Козлов',
      company: 'Логист "СтройМастер"',
      text: 'Заказывали трансфер для делегации партнеров из аэропорта. Встретили с табличкой, довезли с комфортом. Партнеры остались довольны.',
      rating: 5
    },
  ]

  const steps = [
    { number: '01', title: 'Заявка', description: 'Оставьте заявку на сайте или позвоните нам. Менеджер свяжется в течение 15 минут.' },
    { number: '02', title: 'Договор', description: 'Заключаем договор. Работаем по ЭДО Диадок или классическим документооборотом.' },
    { number: '03', title: 'Заказ', description: 'Оформляете заказы через личный кабинет, мессенджер или звонком менеджеру.' },
    { number: '04', title: 'Поездка', description: 'Водитель прибывает вовремя. После поездки — электронный чек и закрывающие документы.' },
  ]

  const faqItems = [
    {
      question: 'Какие документы нужны для заключения договора?',
      answer: 'Для заключения договора понадобятся: реквизиты компании, карточка организации, доверенность на подписанта (если подписывает не генеральный директор). Мы работаем с ООО, ИП и самозанятыми.'
    },
    {
      question: 'Как происходит оплата корпоративных поездок?',
      answer: 'Мы предлагаем несколько вариантов оплаты: безналичный расчет по счету, оплата банковской картой с электронным чеком. Для постоянных клиентов возможна постоплата.'
    },
    {
      question: 'Можно ли заказать регулярные поездки для сотрудников?',
      answer: 'Да, мы организуем регулярные корпоративные маршруты: доставка сотрудников на работу и домой, трансфер на вахту, ежедневные поездки руководства. Фиксируем маршруты и график в договоре.'
    },
    {
      question: 'Какие автомобили используются для корпоративных перевозок?',
      answer: 'Класс Комфорт: Kia Cerato, Kia Ceed, Toyota Corolla, Skoda Octavia. Класс Комфорт+: Toyota Camry, Kia K5. Все автомобили не старше 5 лет, застрахованы по КАСКО и проходят регулярное техническое обслуживание.'
    },
  ]

  const industries = [
    { icon: <IconBuilding />, title: 'Корпоративный транспорт', description: 'Доставка сотрудников на работу, деловые встречи и конференции' },
    { icon: <IconParty />, title: 'Корпоративы и мероприятия', description: 'Трансфер гостей и сотрудников после корпоративных вечеринок' },
    { icon: <IconHelmet />, title: 'Вахтовые перевозки', description: 'Доставка персонала на объекты и производственные площадки' },
    { icon: <IconPlane />, title: 'Аэропортовые трансферы', description: 'Встреча партнеров и гостей, VIP-трансферы' },
  ]

  const documents = [
    'Договор на оказание транспортных услуг',
    'Акт выполненных работ',
    'Счет-фактура для НДС',
    'Электронный чек с QR-кодом',
    'Путевой лист по требованию',
  ]

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Для корпоративных клиентов</div>
          <h1>
            <span className={styles.white}>CITY</span>
            <span className={styles.orange}>2</span>
            <span className={styles.white}>CITY</span>
            <span className={styles.orangeText}> для бизнеса</span>
          </h1>
          <p className={styles.subtitle}>
            Корпоративный трансфер сотрудников, вахтовые перевозки и обслуживание мероприятий.
            Работаем по договору с юридическими лицами по всей России.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>8 лет</span>
              <span className={styles.statLabel}>на рынке</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>9 000+</span>
              <span className={styles.statLabel}>трансферов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>79</span>
              <span className={styles.statLabel}>регионов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>60+</span>
              <span className={styles.statLabel}>партнёров</span>
            </div>
          </div>

          {/* Hero Form */}
          <div className={styles.heroForm}>
            <h3>Получить расчёт для юрлиц</h3>
            <Form
              form={form}
              name="heroForm"
              layout="vertical"
              onFinish={handleHeroFormSubmit}
              requiredMark={false}
            >
              <div className={styles.heroFormFields}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Введите имя' }]}
                >
                  <Input
                    prefix={<IconUser />}
                    placeholder="Ваше имя"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: 'Введите телефон' },
                    { pattern: /^[0-9+() -]+$/, message: 'Некорректный номер' }
                  ]}
                >
                  <Input
                    prefix={<IconPhone />}
                    placeholder="+7 (___) ___-__-__"
                    size="large"
                  />
                </Form.Item>
                <Button
                  type={ButtonTypes.PRIMARY}
                  text="Получить расчёт"
                  loading={isSubmitting}
                />
              </div>
            </Form>
            <p className={styles.heroFormNote}>Перезвоним в течение 15 минут</p>
          </div>

          <div className={styles.partners}>
            <span className={styles.partnerLabel}>Постоянные партнёры:</span>
            <span className={styles.partnerText}>Фестиваль Signal Никола-Ленивец • Сборная РФ по биатлону</span>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Documents Section */}
        <section className={styles.documents}>
          <div className={styles.documentsGrid}>
            <div className={styles.documentsContent}>
              <h2>Работа по договору</h2>
              <p className={styles.documentsSubtitle}>
                Полный пакет закрывающих документов для вашей бухгалтерии
              </p>
              <ul className={styles.documentsList}>
                {documents.map((doc, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}><IconCheck /></span>
                    {doc}
                  </li>
                ))}
              </ul>
              <div className={styles.documentsFeatures}>
                <div className={styles.docFeature}>
                  <IconDocument />
                  <div>
                    <strong>Работа по ЭДО</strong>
                    <span>Диадок, СБИС, Контур</span>
                  </div>
                </div>
                <div className={styles.docFeature}>
                  <IconClock />
                  <div>
                    <strong>Постоплата</strong>
                    <span>Для постоянных клиентов</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.documentsImage}>
              <div className={styles.docCard}>
                <div className={styles.docCardHeader}>
                  <span>Способы оплаты</span>
                </div>
                <div className={styles.paymentMethods}>
                  <div className={styles.paymentMethod}>
                    <span className={styles.paymentIcon}>💳</span>
                    <span>Банковская карта</span>
                  </div>
                  <div className={styles.paymentMethod}>
                    <span className={styles.paymentIcon}>🏦</span>
                    <span>Безналичный расчёт</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className={styles.industries}>
          <h2>Сферы применения</h2>
          <p className={styles.sectionSubtitle}>Корпоративные перевозки для любых задач вашего бизнеса</p>
          <div className={styles.industriesGrid}>
            {industries.map((industry, index) => (
              <div key={index} className={styles.industryCard}>
                <div className={styles.industryIcon}>{industry.icon}</div>
                <h3>{industry.title}</h3>
                <p>{industry.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Routes */}
        <section className={styles.routes}>
          <h2>Популярные маршруты</h2>
          <p className={styles.sectionSubtitle}>Фиксированные цены без скрытых доплат</p>
          <div className={styles.routesGrid}>
            {popularRoutes.map((route, index) => (
              <div key={index} className={styles.routeCard} onClick={handleOrderClick}>
                <div className={styles.routeCities}>
                  <span className={styles.routeFrom}>{route.from}</span>
                  <span className={styles.routeArrow}><IconArrowRight /></span>
                  <span className={styles.routeTo}>{route.to}</span>
                </div>
                <div className={styles.routePrice}>{route.price}</div>
              </div>
            ))}
          </div>
          <div className={styles.routesNote}>
            <Button type={ButtonTypes.SECONDARY} text="Рассчитать свой маршрут" handleClick={handleOrderClick} />
          </div>
        </section>

        {/* How it Works */}
        <section className={styles.howItWorks}>
          <h2>Как это работает</h2>
          <p className={styles.sectionSubtitle}>Простой и прозрачный процесс сотрудничества</p>
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className={styles.benefits}>
          <h2>Почему выбирают нас</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IconClock /></div>
              <h3>Пунктуальность</h3>
              <p>Водитель прибывает в назначенное время. Отслеживание рейсов при встрече в аэропорту.</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IconUsers /></div>
              <h3>Опытные водители</h3>
              <p>Проверенные водители со стажем от 5 лет. Знание деловой этики и дресс-код.</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IconShield /></div>
              <h3>Безопасность</h3>
              <p>Все автомобили застрахованы по КАСКО. Регулярный техосмотр и обслуживание.</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IconCar /></div>
              <h3>Комфортный автопарк</h3>
              <p>Автомобили не старше 5 лет. Кондиционер, зарядные устройства для гаджетов.</p>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={styles.reviews}>
          <h2>Отзывы клиентов</h2>
          <div className={styles.reviewsGrid}>
            {reviews.map((review, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewStars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className={styles.star}><IconStar /></span>
                  ))}
                </div>
                <p className={styles.reviewText}>«{review.text}»</p>
                <div className={styles.reviewAuthor}>
                  <strong>{review.name}</strong>
                  <span>{review.company}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faq}>
          <h2>Частые вопросы</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className={styles.faqQuestion}>
                  <span>{item.question}</span>
                  <span className={styles.faqChevron}><IconChevronDown /></span>
                </div>
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2>Готовы начать сотрудничество?</h2>
          <p>Оставьте заявку — менеджер свяжется с вами в течение 15 минут и подготовит индивидуальное предложение</p>
          <div className={styles.ctaButtons}>
            <Button type={ButtonTypes.PRIMARY} text="Получить предложение" handleClick={handleOrderClick} />
            <a href="tel:+78006007775" className={styles.ctaPhone}>8 800 600-77-75</a>
          </div>
        </section>

        {/* SEO Text */}
        <section className={styles.seoText}>
          <h2>Корпоративные трансферы City2City — надежный партнер для вашего бизнеса</h2>
          <p>
            Компания City2City предоставляет полный спектр услуг корпоративных перевозок для бизнеса любого масштаба.
            За 8 лет работы мы выполнили более 9000 трансферов и заслужили доверие сотен компаний по всей России.
            Наша география охватывает 79 регионов страны, что позволяет организовывать перевозки практически в любую точку.
          </p>
          <p>
            Мы понимаем, что для бизнеса важна каждая деталь. Поэтому предлагаем фиксированные цены без скрытых доплат,
            электронные чеки с QR-кодом для бухгалтерии, а также полный пакет закрывающих документов: акты выполненных работ
            и счета-фактуры. Работаем по безналичному расчету с юридическими лицами и принимаем оплату банковскими картами.
          </p>
          <p>
            Корпоративный трансфер сотрудников — это не просто перевозка из точки А в точку Б. Это забота о комфорте вашей команды,
            экономия рабочего времени и оптимизация транспортных расходов компании. Наши водители проходят тщательный отбор,
            имеют большой опыт работы и соблюдают деловой дресс-код. Автомобили классов Комфорт и Комфорт+ оснащены кондиционером,
            зарядными устройствами и всем необходимым для продуктивной поездки.
          </p>
          <p>
            Особое внимание уделяем аэропортовым трансферам. Встречаем гостей и партнеров с табличкой в зоне прилета,
            отслеживаем статус рейса и корректируем время подачи автомобиля при задержках. Помогаем с багажом и обеспечиваем
            максимально комфортный трансфер до отеля или офиса. Для постоянных клиентов предлагаем специальные условия и персонального менеджера.
          </p>
          <p>
            Заключите корпоративный договор с City2City и получите: приоритетную подачу автомобиля, гибкую систему оплаты,
            ежемесячные акты сверки и персональное обслуживание. Наша служба поддержки работает круглосуточно,
            7 дней в неделю, чтобы оперативно решать любые вопросы. Доверьте корпоративные перевозки профессионалам —
            сосредоточьтесь на развитии вашего бизнеса, а логистику оставьте нам.
          </p>
        </section>
      </div>
    </div>
  )
}
