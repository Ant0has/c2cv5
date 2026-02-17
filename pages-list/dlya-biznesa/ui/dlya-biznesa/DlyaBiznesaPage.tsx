import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaAnswers from '../dlya-biznesa-answers/DlyaBiznesaAnswers'
import DlyaBiznesaCalculator from '../dlya-biznesa-calculator/DlyaBiznesaCalculator';
import DlyaBiznesaContract from '../dlya-biznesa-contract/DlyaBiznesaContract';
import DlyaBiznesaServiceAreas from '../dlya-biznesa-service-areas/DlyaBiznesaServiceAreas';
import DlyaBiznesaPopularRoutes from '../dlya-biznesa-popular-routes/DlyaBiznesaPopularRoutes';
import DlyaBiznesaInstruction from '../dlya-biznesa-instruction/DlyaBiznesaInstruction';
import DlyaBiznesaChoise from '../dlya-biznesa-choise/DlyaBiznesaChoise';
import DlyaBiznesaReviews from '../dlya-biznesa-reviews/DlyaBiznesaReviews';
import DlyaBiznesaFaq from '../dlya-biznesa-faq/DlyaBiznesaFaq';
import DlyaBiznesaCooperation from '../dlya-biznesa-cooperation/DlyaBiznesaCooperation';
import BusinessHero from '@/entities/buziness/ui/business-hero/BusinessHero';
import { companyAdvantagesList, companyExperienceList } from '../../utils/data';

const pageData = {
  hero:{
    title: [{text: 'Трансфер', isPrimary: false}, {text: 'для бизнеса', isPrimary: true}],
    description: 'Бронируйте заранее — машина гарантированно будет',
    image: '/images/dlya-biznesa/businessman-lg.png',
    bullets: companyAdvantagesList,
    staticsList: companyExperienceList,
  }
}

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <BusinessHero {...pageData.hero} />
        <DlyaBiznesaAnswers />
        <DlyaBiznesaCalculator />
        <DlyaBiznesaContract />
        <DlyaBiznesaServiceAreas />
        <DlyaBiznesaPopularRoutes />
        <DlyaBiznesaInstruction />
        <DlyaBiznesaChoise />
        <DlyaBiznesaReviews />
        <DlyaBiznesaFaq />
        <DlyaBiznesaCooperation />
    </div>
  );
};

export default DlyBiznesaPage;