import styles from './DlyaBiznesaPage.module.scss'
import DlyaBiznesaContract from '../dlya-biznesa-contract/DlyaBiznesaContract';
import DlyaBiznesaServiceAreas from '../dlya-biznesa-service-areas/DlyaBiznesaServiceAreas';
import DlyaBiznesaPopularRoutes from '../dlya-biznesa-popular-routes/DlyaBiznesaPopularRoutes';
import DlyaBiznesaInstruction from '../dlya-biznesa-instruction/DlyaBiznesaInstruction';
import DlyaBiznesaChoise from '../dlya-biznesa-choise/DlyaBiznesaChoise';
import DlyaBiznesaReviews from '../dlya-biznesa-reviews/DlyaBiznesaReviews';
import DlyaBiznesaFaq from '../dlya-biznesa-faq/DlyaBiznesaFaq';
import DlyaBiznesaCooperation from '../dlya-biznesa-cooperation/DlyaBiznesaCooperation';
import { BusinessHero, BusinessAnswers, BusinessCalculator } from '@/entities/buziness';
import { companyAdvantagesList, companyExperienceList, problemSolutionsList } from '../../utils/data';

const pageData = {
  hero:{
    title: [{text: 'Трансфер', isPrimary: false}, {text: 'для бизнеса', isPrimary: true}],
    description: 'Бронируйте заранее — машина гарантированно будет',
    image: '/images/dlya-biznesa/businessman-lg.png',
    bullets: companyAdvantagesList,
    staticsList: companyExperienceList,
  },
  answers: {
    title: [{text: 'Почему агрегаторы', isPrimary: false}, {text: 'не подходят для командировок', isPrimary: true}],
    description: 'Комфорт, Бизнес и Минивэн - поездки на любой случай',
    image: '/images/dlya-biznesa/map-bg.png',
    list: problemSolutionsList,
  },
  calculator: {
    title: [{text: 'Рассчитайте предварительную', isPrimary: false}, {text: 'стоимость за 30 секунд', isPrimary: true}],
    image: '/images/dlya-biznesa/calculator-phone.png',
    description: 'Укажите куда вам надо?',
    buttonText: 'Рассчитать',
  }
}

const DlyBiznesaPage = () => {
  return (
    <div className={styles.page}>
        <BusinessHero {...pageData.hero} />
        <BusinessAnswers {...pageData.answers} />
        <BusinessCalculator {...pageData.calculator} />
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