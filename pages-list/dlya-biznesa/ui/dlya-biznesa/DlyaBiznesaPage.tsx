import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaHero from '@/pages-list/dlya-biznesa/ui/dlya-biznesa-hero/DlyaBiznesaHero'
import DlyaBiznesaAnswers from './dlya-biznesa-answers/DlyaBiznesaAnswers'
import DlyaBiznesaCalculator from './dlya-biznesa-calculator/DlyaBiznesaCalculator';

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <DlyaBiznesaHero />
        <DlyaBiznesaAnswers />
        <DlyaBiznesaCalculator />
    </div>
  );
};

export default DlyBiznesaPage;