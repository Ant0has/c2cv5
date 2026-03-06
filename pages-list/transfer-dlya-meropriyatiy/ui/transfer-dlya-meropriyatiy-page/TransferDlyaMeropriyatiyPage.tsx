import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessServiceAreas, BusinessPopularRoutes, BusinessChoise, BusinessInstruction, BusinessReviews, BusinessFaq, BusinessCooperation, BusinessCrossLinks, BusinessRegionLinks, BusinessBlogArticles, BusinessCaseStudies } from '@/entities/buziness'
import s from './TransferDlyaMeropriyatiyPage.module.scss'
import { pageData } from '../../utils/data'
import { REGIONS } from '../../../city-hub/config/registry'

const regionLinksData = REGIONS.map(r => ({
  name: r.name,
  shortName: r.shortName,
  href: `/dlya-biznesa/${r.slug}`,
  cities: r.cities.map(c => ({
    name: c.name,
    href: `/dlya-biznesa/${r.slug}/${c.slug}`,
  })),
}))

const TransferDlyaMeropriyatiyPage = () => {
  return <div className={s.page}>
    <BusinessHero {...pageData.hero} />
    <BusinessAnswers {...pageData.answers} />
    <BusinessB2bCalculator {...pageData.calculator} />
    <BusinessContract {...pageData.contract} />
    <BusinessServiceAreas {...pageData.serviceAreas} />
    <BusinessPopularRoutes {...pageData.popularRoutes} />
    <BusinessInstruction {...pageData.instruction} />
    <BusinessChoise {...pageData.choise} />
    <BusinessReviews {...pageData.reviews} />
    <BusinessFaq {...pageData.faq} />
    <BusinessBlogArticles segment="transfer-meropriyatiy" title="Полезные статьи о трансфере для мероприятий" />
    <BusinessCaseStudies segment="transfer-meropriyatiy" title="Кейсы наших клиентов" />
    <BusinessCrossLinks currentSlug="transfer-dlya-meropriyatiy" />
    <BusinessRegionLinks regions={regionLinksData} />
    <BusinessCooperation {...pageData.cooperation} />
  </div>
}

export default TransferDlyaMeropriyatiyPage
