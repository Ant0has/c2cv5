import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaHero from '@/pages-list/dlya-biznesa/ui/dlya-biznesa-hero/DlyaBiznesaHero'
import DlyaBiznesaAnswers from '../dlya-biznesa-answers/DlyaBiznesaAnswers'
import DlyaBiznesaCalculator from '../dlya-biznesa-calculator/DlyaBiznesaCalculator';
import DlyaBiznesaContract from '../dlya-biznesa-contract/DlyaBiznesaContract';
import DlyaBiznesaServiceAreas from '../dlya-biznesa-service-areas/DlyaBiznesaServiceAreas';
import DlyaBiznesaPopularRoutes from '../dlya-biznesa-popular-routes/DlyaBiznesaPopularRoutes';
import DlyaBiznesaInstruction from '../dlya-biznesa-instruction/DlyaBiznesaInstruction';

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <DlyaBiznesaHero />
        <DlyaBiznesaAnswers />
        <DlyaBiznesaCalculator />
        <DlyaBiznesaContract />
        <DlyaBiznesaServiceAreas />
        <DlyaBiznesaPopularRoutes />
        <DlyaBiznesaInstruction />
    </div>
  );
};

export default DlyBiznesaPage;