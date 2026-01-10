import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaHero from '@/pages-list/dlya-biznesa/ui/dlya-biznesa-hero/DlyaBiznesaHero'
import DlyaBiznesaAnswers from '../dlya-biznesa-answers/DlyaBiznesaAnswers'
import DlyaBiznesaCalculator from '../dlya-biznesa-calculator/DlyaBiznesaCalculator';
import DlyaBiznesaContract from '../dlya-biznesa-contract/DlyaBiznesaContract';
import DlyaBiznesaServiceAreas from '../dlya-biznesa-service-areas/DlyaBiznesaServiceAreas';
import DlyaBiznesaPopularRoutes from '../dlya-biznesa-popular-routes/DlyaBiznesaPopularRoutes';

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <DlyaBiznesaHero />
        <DlyaBiznesaAnswers />
        <DlyaBiznesaCalculator />
        <DlyaBiznesaContract />
        <DlyaBiznesaServiceAreas />
        <DlyaBiznesaPopularRoutes />
    </div>
  );
};

export default DlyBiznesaPage;