import styles from './DlyaBiznesaPage.module.scss'
import BusinessFaq from '../../../../entities/buziness/ui/business-faq/BusinessFaq';
import BusinessCooperation from '../../../../entities/buziness/ui/business-cooperation/BusinessCooperation';
import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessPopularRoutes, BusinessServiceAreas, BusinessInstruction, BusinessChoise, BusinessReviews, BusinessCrossLinks, BusinessRegionLinks } from '@/entities/buziness';
import { pageData } from '../../utils/data';
import { REGIONS } from '../../../city-hub/config/registry';

const regionLinksData = REGIONS.map(r => ({
  name: r.name,
  shortName: r.shortName,
  href: `/dlya-biznesa/${r.slug}`,
  cities: r.cities.map(c => ({
    name: c.name,
    href: `/dlya-biznesa/${r.slug}/${c.slug}`,
  })),
}));

const DlyaBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <BusinessHero {...pageData.hero} />
        <BusinessAnswers {...pageData.answers} />
        <BusinessB2bCalculator {...pageData.calculator} />
        <BusinessContract {...pageData.contract} />
        <BusinessServiceAreas {...pageData.serviceAreas} />
        <BusinessCrossLinks currentSlug="dlya-biznesa" />
        <BusinessRegionLinks regions={regionLinksData} />
        <BusinessPopularRoutes {...pageData.popularRoutes} />
        <BusinessInstruction {...pageData.instruction} />
        <BusinessChoise {...pageData.choise} />
        <BusinessReviews {...pageData.reviews} />
        <BusinessFaq {...pageData.faq} />
        <BusinessCooperation {...pageData.cooperation} />
    </div>
  );
};

export default DlyaBiznesaPage;