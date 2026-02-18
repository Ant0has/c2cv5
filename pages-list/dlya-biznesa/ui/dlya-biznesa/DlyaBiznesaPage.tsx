import styles from './DlyaBiznesaPage.module.scss'
import BusinessFaq from '../../../../entities/buziness/ui/business-faq/BusinessFaq';
import BusinessCooperation from '../../../../entities/buziness/ui/business-cooperation/BusinessCooperation';
import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessPopularRoutes, BusinessServiceAreas, BusinessInstruction, BusinessChoise, BusinessReviews } from '@/entities/buziness';
import { choiseList, companyAdvantagesList, companyExperienceList, contractDocumentsList, faqItems, instructionList, popularRoutesList, problemSolutionsList, reviewsList, serviceAreasList } from '../../utils/data';

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
  },
  contract: {
    title: [{text: 'Работа', isPrimary: false}, {text: 'по договору', isPrimary: true}],
    documentsList: contractDocumentsList,
  },
  serviceAreas: {
    title: [{text: 'Сферы', isPrimary: false}, {text: 'применения', isPrimary: true}],
    list: serviceAreasList, 
  },
  popularRoutes: {
    title: [{text: 'Популярные', isPrimary: false}, {text: ' маршруты', isPrimary: true}],
    description: 'Фиксированные цены без скрытых доплат',
    list: popularRoutesList,
  },
  instruction: {
    list: instructionList,
  },
  choise: {
    list: choiseList,
  },
  reviews: {
    list: reviewsList,
  },
  faq: {
    list: faqItems,
  },
  cooperation: {
    title: [{text: 'Готовы начать', isPrimary: false}, {text: 'сотрудничество?', isPrimary: true}],
    description: 'Оставьте заявку — менеджер свяжется в течение 15 минут и подготовит индивидуальное предложение',
    image: '/images/dlya-biznesa/businessman-lg.png',
    buttonText: 'Получить предложение',
  },
}

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