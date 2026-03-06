import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessServiceAreas, BusinessPopularRoutes, BusinessChoise, BusinessInstruction, BusinessReviews, BusinessFaq, BusinessCooperation, BusinessComprasion, BusinessCrossLinks, BusinessRegionLinks, BusinessBlogArticles, BusinessCaseStudies } from '@/entities/buziness'
import s from './DostavkaGruzovPage.module.scss'
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
    <BusinessBlogArticles segment="dostavka-gruzov" title="Полезные статьи о доставке грузов" />
    <BusinessCaseStudies segment="dostavka-gruzov" title="Кейсы наших клиентов" />
    <BusinessCrossLinks currentSlug="dostavka-gruzov" />
    <BusinessRegionLinks regions={regionLinksData} />
    <BusinessCooperation {...pageData.cooperation} />
  </div>
}

export default DostavkaGruzovPage