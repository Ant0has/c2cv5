'use client'
import { BusinessCooperation } from '@/entities/buziness'
import { CASES } from '../../config/registry'
import CaseCard from '../case-card/CaseCard'
import s from './CasesListPage.module.scss'

const cooperationData = {
  title: [
    { text: 'Готовы ', isPrimary: false },
    { text: 'к сотрудничеству?', isPrimary: true },
  ],
  description: 'Оставьте заявку — менеджер подготовит коммерческое предложение за 1 рабочий день',
  image: '/images/dlya-biznesa/businessman-lg.png',
  buttonText: 'Получить предложение',
}

const CasesListPage = () => {
  return (
    <div className={s.page}>
      <div className="container">
        <h1 className={s.title}>Кейсы клиентов</h1>
        <p className={s.subtitle}>
          Реальные истории компаний, которые оптимизировали транспортную логистику с City2City
        </p>
        <div className={s.grid}>
          {CASES.map(caseStudy => (
            <CaseCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>
      </div>
      <BusinessCooperation {...cooperationData} />
    </div>
  )
}

export default CasesListPage
