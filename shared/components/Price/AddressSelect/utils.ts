  export const checkString = (str: string) => {
    const trimmed = String(str).trim();
    return trimmed === '-' ? '' : trimmed;
  }

  export const getDeparturePoint = (point: string) => {
    if(point === 'из Белгорода') return 'Белгород'
    if(point === 'из Москвы') return 'Москва'
    if(point === 'из Краснодара') return 'Краснодар'
    if(point === 'из Екатеринбурга') return 'Екатеринбург'
    if(point === 'из Тюменя') return 'Тюмень'
    if(point === 'из Ростова-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казани') return 'Казань'
    if(point === 'из Челябинска') return 'Челябинск'
    if(point === 'из Уфы') return 'Уфа'
    if(point === 'из Самары') return 'Самара'
    if(point === 'из Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань') return 'Казань'
    if(point === 'из Челябинск') return 'Челябинск'
    if(point === 'из Уфы') return 'Уфа'
    if(point === 'из Самары') return 'Самара'
    if(point === 'из Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань') return 'Казань'
    if(point === 'из Челябинск') return 'Челябинск'
    if(point === 'из Уфы') return 'Уфа'
    if(point === 'из Самары') return 'Самара'
    if(point === 'из Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань') return 'Казань'
    if(point === 'из Челябинск') return 'Челябинск'

    return point.replace(/^Из\s+/i, '').trim()
  }