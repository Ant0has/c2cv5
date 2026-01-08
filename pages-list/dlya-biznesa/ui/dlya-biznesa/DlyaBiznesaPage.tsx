import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaHero from '@/pages-list/dlya-biznesa/ui/dlya-biznesa-hero/DlyaBiznesaHero'
import DlyaBiznesaAnswers from './dlya-biznesa-answers/DlyaBiznesaAnswers'

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <DlyaBiznesaHero title="Для корпоративных клиентов" />
        <DlyaBiznesaAnswers />
    </div>
  );
};

export default DlyBiznesaPage;