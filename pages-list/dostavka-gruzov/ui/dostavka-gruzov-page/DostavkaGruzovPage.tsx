import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessServiceAreas, BusinessPopularRoutes, BusinessChoise, BusinessInstruction, BusinessReviews, BusinessFaq, BusinessCooperation, BusinessComprasion } from '@/entities/buziness'
import s from './DostavkaGruzovPage.module.scss'
import { pageData } from '../../utils/data'

const DostavkaGruzovPage = () => {
  return <div className={s.page}>
    <BusinessHero {...pageData.hero} />
    <BusinessAnswers {...pageData.answers} />
    <BusinessB2bCalculator {...pageData.calculator} />
    <BusinessContract {...pageData.contract} />
    <BusinessComprasion {...pageData.comprasion} />
    <BusinessServiceAreas {...pageData.serviceAreas} />
    <BusinessPopularRoutes {...pageData.popularRoutes} />
    <BusinessInstruction {...pageData.instruction} />
    <BusinessChoise {...pageData.choise} />
    <BusinessReviews {...pageData.reviews} />
    <BusinessFaq {...pageData.faq} />
    <BusinessCooperation {...pageData.cooperation} />
  </div>
}

export default DostavkaGruzovPage