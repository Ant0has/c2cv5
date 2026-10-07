import { SERVICE_POLICY } from '@/shared/configs/service-policy'

export function generateCityDescription(
  cityName: string,
  cityGenitive: string,
  cityLocative: string,
  totalCount: number,
  minPrice: number,
): string {
  const priceStr = minPrice > 0 ? minPrice.toLocaleString('ru-RU') : '3 000'

  return `Служба City2City предлагает комфортное междугороднее такси ${cityGenitive}. ` +
    `В каталоге ${totalCount} направлений с предварительной стоимостью от ${priceStr}₽. Итоговую цену согласуем при заказе. ` +
    `Подача автомобиля ${cityLocative} — от 30 минут. ` +
    `Опытные водители, чистые автомобили классов Комфорт, Комфорт+, Бизнес и Минивэн. ` +
    `Оплата наличными, картой или безналичным расчётом.`
}

export const ADVANTAGES = [
  {
    title: 'Фиксированная цена',
    description: SERVICE_POLICY.price,
  },
  {
    title: 'Подача от 30 минут',
    description: SERVICE_POLICY.driver,
  },
  {
    title: 'Комфортные автомобили',
    description: 'Иномарки не старше 5 лет. Классы Комфорт, Комфорт+, Бизнес и Минивэн на выбор.',
  },
  {
    title: 'Условия согласованы заранее',
    description: 'Платные дороги, дополнительные остановки и ожидание обсуждаем до подтверждения заказа.',
  },
  {
    title: 'Поездки в любое время суток',
    description: SERVICE_POLICY.availability,
  },
  {
    title: 'Безопасность',
    description: 'Все водители проверены. Страхование пассажиров. Отслеживание поездки в реальном времени.',
  },
]
