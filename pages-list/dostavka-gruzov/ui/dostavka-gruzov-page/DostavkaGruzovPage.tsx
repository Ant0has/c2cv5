import BusinessHero from '@/entities/buziness/ui/business-hero/BusinessHero'
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
  }
}

const DostavkaGruzovPage = () => {
  return <div className={s.page}>
    <BusinessHero {...pageData.hero} />
  </div>
}

export default DostavkaGruzovPage