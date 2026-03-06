import type { CaseStudyData } from '../types'

const caseModules: Record<string, () => Promise<{ data: CaseStudyData }>> = {
  // Корпоративное такси
  'kejs-it-kompaniya-sokratila-raskhody-35': () => import('./cases/korporativnoe-taksi/kejs-it-kompaniya-sokratila-raskhody-35'),
  'kejs-stroitelnaya-kompaniya-optimizirovala-logistiku': () => import('./cases/korporativnoe-taksi/kejs-stroitelnaya-kompaniya-optimizirovala-logistiku'),

  // Трансфер для мероприятий
  'kejs-korporativ-500-chelovek-podmoskove': () => import('./cases/transfer-meropriyatiy/kejs-korporativ-500-chelovek-podmoskove'),
  'kejs-logistika-foruma-v-sochi': () => import('./cases/transfer-meropriyatiy/kejs-logistika-foruma-v-sochi'),

  // Перевозка вахтовых рабочих
  'kejs-burovye-brigady-mestorozhdeniya-yugry': () => import('./cases/vakhtovye-perevozki/kejs-burovye-brigady-mestorozhdeniya-yugry'),
  'kejs-stroitelnye-brigady-obekty-arktiki': () => import('./cases/vakhtovye-perevozki/kejs-stroitelnye-brigady-obekty-arktiki'),

  // Медицинский трансфер
  'kejs-onkopacient-na-lechenie-v-moskvu': () => import('./cases/medicinskij-transfer/kejs-onkopacient-na-lechenie-v-moskvu'),
  'kejs-reabilitacionnye-pacienty-v-sanatorij': () => import('./cases/medicinskij-transfer/kejs-reabilitacionnye-pacienty-v-sanatorij'),

  // Доставка грузов
  'kejs-dostavka-zapchastej-dlya-zavodskogo-prostoya': () => import('./cases/dostavka-gruzov/kejs-dostavka-zapchastej-dlya-zavodskogo-prostoya'),
  'kejs-ezhemesyachnaya-dostavka-obrazcov-laboratorii': () => import('./cases/dostavka-gruzov/kejs-ezhemesyachnaya-dostavka-obrazcov-laboratorii'),
}

export async function getCaseData(slug: string): Promise<CaseStudyData | null> {
  const loader = caseModules[slug]
  if (!loader) return null
  try {
    const module = await loader()
    return module.data
  } catch {
    return null
  }
}
