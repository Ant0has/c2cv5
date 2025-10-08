  export const checkString = (str: string) => {
    const trimmed = String(str).trim();
    return trimmed === '-' ? '' : trimmed;
  }

  export const getDeparturePoint = (point: string) => {
    if(point === 'из Белгорода') return 'Белгород'
    if(point === 'из Москвы' || point === 'Москвы') return 'Москва'
    if(point === 'из Краснодара' || point === 'Краснодара') return 'Краснодар'
    if(point === 'из Екатеринбурга' || point === 'Екатеринбурга') return 'Екатеринбург'
    if(point === 'из Тюменя' || point === 'Тюменя') return 'Тюмень'
    if(point === 'из Ростова-на-Дону' || point === 'Ростова-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казани' || point === 'Казани') return 'Казань'
    if(point === 'из Челябинска' || point === 'Челябинск') return 'Челябинск'
    if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
    if(point === 'из Самары' || point === 'Самары') return 'Самара'
    if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань' || point === 'Казань') return 'Казань'
    if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'
    if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
    if(point === 'из Самары' || point === 'Самары') return 'Самара'
    if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань' || point === 'Казань') return 'Казань'
    if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'
    if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
    if(point === 'из Самары' || point === 'Самары') return 'Самара'
    if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
    if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
    if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
    if(point === 'из Казань' || point === 'Казань') return 'Казань'
    if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'

    return point.replace(/^Из\s+/i, '').trim()
  }