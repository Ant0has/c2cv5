import type { ArticleData } from '../types'

const articleModules: Record<string, () => Promise<{ data: ArticleData }>> = {
  // Корпоративное такси
  'kak-organizovat-korporativnye-mezhgorodnie-poezdki': () => import('./articles/korporativnoe-taksi/kak-organizovat-korporativnye-mezhgorodnie-poezdki'),
  'chek-list-vybora-transportnoj-kompanii-dlya-biznesa': () => import('./articles/korporativnoe-taksi/chek-list-vybora-transportnoj-kompanii-dlya-biznesa'),
  'sravnenie-korporativnogo-taksi-i-agregatorov': () => import('./articles/korporativnoe-taksi/sravnenie-korporativnogo-taksi-i-agregatorov'),
  'kejs-kak-it-kompaniya-sokratila-raskhody-na-komandirovki': () => import('./articles/korporativnoe-taksi/kejs-kak-it-kompaniya-sokratila-raskhody-na-komandirovki'),
  'stoimost-korporativnogo-taksi-mezhgorod-obzor-cen': () => import('./articles/korporativnoe-taksi/stoimost-korporativnogo-taksi-mezhgorod-obzor-cen'),
  'kak-nastroit-edo-dlya-korporativnyh-poezdok': () => import('./articles/korporativnoe-taksi/kak-nastroit-edo-dlya-korporativnyh-poezdok'),
  'chek-list-dokumentov-dlya-dogovora-na-korporativnye-perevozki': () => import('./articles/korporativnoe-taksi/chek-list-dokumentov-dlya-dogovora-na-korporativnye-perevozki'),
  'korporativnoe-taksi-vs-arenda-avto-s-voditelem': () => import('./articles/korporativnoe-taksi/korporativnoe-taksi-vs-arenda-avto-s-voditelem'),
  'kejs-logistika-komandirovok-stroitelnoj-kompanii': () => import('./articles/korporativnoe-taksi/kejs-logistika-komandirovok-stroitelnoj-kompanii'),
  'skolko-stoit-korporativnyj-transfer-moskva-spb': () => import('./articles/korporativnoe-taksi/skolko-stoit-korporativnyj-transfer-moskva-spb'),

  // Трансфер для мероприятий
  'kak-organizovat-transfer-dlya-konferencii': () => import('./articles/transfer-meropriyatiy/kak-organizovat-transfer-dlya-konferencii'),
  'chek-list-transportnoj-logistiki-meropriyatiya': () => import('./articles/transfer-meropriyatiy/chek-list-transportnoj-logistiki-meropriyatiya'),
  'sravnenie-transfer-servisy-dlya-meropriyatiy': () => import('./articles/transfer-meropriyatiy/sravnenie-transfer-servisy-dlya-meropriyatiy'),
  'kejs-transfer-dlya-korporativa-na-500-chelovek': () => import('./articles/transfer-meropriyatiy/kejs-transfer-dlya-korporativa-na-500-chelovek'),
  'stoimost-transfera-dlya-meropriyatij-obzor-cen': () => import('./articles/transfer-meropriyatiy/stoimost-transfera-dlya-meropriyatij-obzor-cen'),
  'kak-organizovat-transfer-gostej-na-svadbu-za-gorodom': () => import('./articles/transfer-meropriyatiy/kak-organizovat-transfer-gostej-na-svadbu-za-gorodom'),
  'chek-list-transfera-dlya-delovogo-foruma': () => import('./articles/transfer-meropriyatiy/chek-list-transfera-dlya-delovogo-foruma'),
  'miniveny-vs-avtobusy-dlya-korporativnyh-meropriyatij': () => import('./articles/transfer-meropriyatiy/miniveny-vs-avtobusy-dlya-korporativnyh-meropriyatij'),
  'kejs-logistika-mezhdunarodnogo-foruma-v-sochi': () => import('./articles/transfer-meropriyatiy/kejs-logistika-mezhdunarodnogo-foruma-v-sochi'),
  'byudzhet-transfera-dlya-konferencii-skolko-zakladyvat': () => import('./articles/transfer-meropriyatiy/byudzhet-transfera-dlya-konferencii-skolko-zakladyvat'),

  // Перевозка вахтовых рабочих
  'kak-organizovat-vakhtovuyu-perevozku-rabochih': () => import('./articles/vakhtovye-perevozki/kak-organizovat-vakhtovuyu-perevozku-rabochih'),
  'chek-list-bezopasnosti-perevozki-vakhtovyh-brigad': () => import('./articles/vakhtovye-perevozki/chek-list-bezopasnosti-perevozki-vakhtovyh-brigad'),
  'vakhtovyj-avtobus-vs-taksi-mezhgorod-sravnenie': () => import('./articles/vakhtovye-perevozki/vakhtovyj-avtobus-vs-taksi-mezhgorod-sravnenie'),
  'kejs-perevozka-burovyh-brigad-na-mestorozhdeniya-yugry': () => import('./articles/vakhtovye-perevozki/kejs-perevozka-burovyh-brigad-na-mestorozhdeniya-yugry'),
  'stoimost-perevozki-vakhtovyh-rabochih-obzor-cen': () => import('./articles/vakhtovye-perevozki/stoimost-perevozki-vakhtovyh-rabochih-obzor-cen'),
  'kak-sokratit-prostoi-pri-smene-vakhtovyh-brigad': () => import('./articles/vakhtovye-perevozki/kak-sokratit-prostoi-pri-smene-vakhtovyh-brigad'),
  'chek-list-dokumentov-dlya-perevozki-vakhtovyh-rabochih': () => import('./articles/vakhtovye-perevozki/chek-list-dokumentov-dlya-perevozki-vakhtovyh-rabochih'),
  'lichnoe-taksi-vs-gruppovoj-transfer-dlya-vakhtovikov': () => import('./articles/vakhtovye-perevozki/lichnoe-taksi-vs-gruppovoj-transfer-dlya-vakhtovikov'),
  'kejs-dostavka-stroitelnyh-brigad-na-obekty-v-arktike': () => import('./articles/vakhtovye-perevozki/kejs-dostavka-stroitelnyh-brigad-na-obekty-v-arktike'),
  'tarify-na-perevozku-brigad-kak-rasschitat-byudzhet': () => import('./articles/vakhtovye-perevozki/tarify-na-perevozku-brigad-kak-rasschitat-byudzhet'),

  // Медицинский трансфер
  'kak-organizovat-medicinskij-transfer-pacientov': () => import('./articles/medicinskij-transfer/kak-organizovat-medicinskij-transfer-pacientov'),
  'chek-list-perevozki-pacienta-mezhgorod': () => import('./articles/medicinskij-transfer/chek-list-perevozki-pacienta-mezhgorod'),
  'sanitarnyj-transport-vs-komfortnoe-taksi-dlya-pacientov': () => import('./articles/medicinskij-transfer/sanitarnyj-transport-vs-komfortnoe-taksi-dlya-pacientov'),
  'kejs-perevozka-onkopacientov-na-lechenie-v-moskvu': () => import('./articles/medicinskij-transfer/kejs-perevozka-onkopacientov-na-lechenie-v-moskvu'),
  'stoimost-medicinskogo-transfera-mezhgorod-obzor-cen': () => import('./articles/medicinskij-transfer/stoimost-medicinskogo-transfera-mezhgorod-obzor-cen'),
  'kak-organizovat-perevozku-medpersonala-mezhdu-klinikami': () => import('./articles/medicinskij-transfer/kak-organizovat-perevozku-medpersonala-mezhdu-klinikami'),
  'chek-list-transfera-posle-operacii': () => import('./articles/medicinskij-transfer/chek-list-transfera-posle-operacii'),
  'perevozka-biomaterialov-vs-kurerskaya-dostavka': () => import('./articles/medicinskij-transfer/perevozka-biomaterialov-vs-kurerskaya-dostavka'),
  'kejs-transfer-reabilitacionnyh-pacientov-v-sanatorij': () => import('./articles/medicinskij-transfer/kejs-transfer-reabilitacionnyh-pacientov-v-sanatorij'),
  'skolko-stoit-medicinskij-transfer-po-rossii': () => import('./articles/medicinskij-transfer/skolko-stoit-medicinskij-transfer-po-rossii'),

  // Доставка грузов
  'kak-organizovat-srochnuyu-dostavku-gruzov-mezhgorod': () => import('./articles/dostavka-gruzov/kak-organizovat-srochnuyu-dostavku-gruzov-mezhgorod'),
  'chek-list-otpravki-gruza-mezhgorod-taksi': () => import('./articles/dostavka-gruzov/chek-list-otpravki-gruza-mezhgorod-taksi'),
  'dostavka-taksi-vs-transportnye-kompanii-sravnenie': () => import('./articles/dostavka-gruzov/dostavka-taksi-vs-transportnye-kompanii-sravnenie'),
  'kejs-dostavka-zapchastej-dlya-zavodskogo-prostoja': () => import('./articles/dostavka-gruzov/kejs-dostavka-zapchastej-dlya-zavodskogo-prostoja'),
  'stoimost-dostavki-gruzov-mezhgorod-obzor-cen': () => import('./articles/dostavka-gruzov/stoimost-dostavki-gruzov-mezhgorod-obzor-cen'),
  'kak-dostavit-dokumenty-mezhdu-gorodami-za-neskolko-chasov': () => import('./articles/dostavka-gruzov/kak-dostavit-dokumenty-mezhdu-gorodami-za-neskolko-chasov'),
  'chek-list-priemki-gruza-pri-dostavke-mezhgorod': () => import('./articles/dostavka-gruzov/chek-list-priemki-gruza-pri-dostavke-mezhgorod'),
  'kurerskaya-dostavka-vs-gruzovoe-taksi-chto-bystree': () => import('./articles/dostavka-gruzov/kurerskaya-dostavka-vs-gruzovoe-taksi-chto-bystree'),
  'kejs-ezhegodnaya-dostavka-obrazcov-dlya-laboratorii': () => import('./articles/dostavka-gruzov/kejs-ezhegodnaya-dostavka-obrazcov-dlya-laboratorii'),
  'tarify-na-srochnuyu-dostavku-kak-sekonomit': () => import('./articles/dostavka-gruzov/tarify-na-srochnuyu-dostavku-kak-sekonomit'),
}

export async function getArticleData(slug: string): Promise<ArticleData | null> {
  const loader = articleModules[slug]
  if (!loader) return null
  try {
    const module = await loader()
    return module.data
  } catch {
    return null
  }
}
