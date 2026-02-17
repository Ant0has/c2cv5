import { BusinessHero, BusinessAnswers, BusinessCalculator } from '@/entities/buziness'
import s from './DostavkaGruzovPage.module.scss'

const pageData = {
  hero:{
    title: [{text: 'Доставка', isPrimary: false}, {text: 'грузов', isPrimary: true}, {text: 'между городами в тот же день', isPrimary: false}],
    description: 'Забираем за 1 час. Везём напрямую. Быстрее любой ТК.',
    image: '/images/dostavka-gruzov/hero-phone.png',
    bullets: [
      'Прямая доставка точка-точка без сортировок',
      'Груз до 50 кг — помещается в легковой авто',
      'Документы для юрлиц: договор, акт, счёт-фактура',
    ],
    staticsList: [
      {id: 1, label: '< 1 часа', value: 'Время подачи'},
      {id: 2, label: '2-6 ч', value: 'Доставка до 500км'},
      {id: 3, label: '79', value: 'регионов'},
      {id: 4, label: 'до 50 кг', value: 'вес груза'},

    ]
  },
  answers: {
    title: [{text: 'Почему транспортные компании', isPrimary: false}, {text: 'не подходят для срочных грузов', isPrimary: true}],
    list: [
      {id: 1, problem: {title: 'Груз едет через сортировочный центр', description: 'Клиент ждёт груз 3 дня, а не 1'}, solution: {title: 'Прямая доставка', description: 'Водитель забирает груз и везёт напрямую к получателю. Без перегрузов и складов'}},
      {id: 2, problem: {title: 'Нельзя отследить в реальном времени', description: 'Клиент не знает, где груз и когда он будет доставлен'}, solution: {title: 'GPS-отслеживание', description: 'Видите машину на карте в реальном времени. Знаете точное время доставки'}},
      {id: 3, problem: {title: 'Невозможно забрать в выходной или после 18:00', description: 'Клиент не может забрать груз'}, solution: {title: 'Работаем 24/7', description: 'Забираем груз в любое время, включая выходные и праздники'}},
    ],
  },
  calculator: {
    image: '/images/dostavka-gruzov/calculator-phone.png',
  }
}

const DostavkaGruzovPage = () => {
  return <div className={s.page}>
    <BusinessHero {...pageData.hero} />
    <BusinessAnswers {...pageData.answers} />
    <BusinessCalculator {...pageData.calculator} />
  </div>
}

export default DostavkaGruzovPage