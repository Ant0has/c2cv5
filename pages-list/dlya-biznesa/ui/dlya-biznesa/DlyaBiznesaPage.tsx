import styles from './DlyaBiznesaPage.module.scss'
import BusinessFaq from '../../../../entities/buziness/ui/business-faq/BusinessFaq';
import BusinessCooperation from '../../../../entities/buziness/ui/business-cooperation/BusinessCooperation';
import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessPopularRoutes, BusinessServiceAreas, BusinessInstruction, BusinessChoise, BusinessReviews } from '@/entities/buziness';
import { pageData } from '../../utils/data';

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
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
        <BusinessCooperation {...pageData.cooperation} />
    </div>
  );
};

export default DlyBiznesaPage;