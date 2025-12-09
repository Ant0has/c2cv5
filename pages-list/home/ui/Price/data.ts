import { Prices } from "@/shared/types/enums"

export const standardOptions = [
  {
    id: 1,
    label: 'Подача в Аэропорт',
    value: '500 руб.'
  },
  {
    id: 2,
    label: 'Обратная поезда в тот же день',
    value: 'скидка 50%'
  },
  {
    id: 3,
    label: 'Ожидание при подаче 15 минут',
    value: 'Бесплатно'
  },
  {
    id: 4,
    label: '1 час ожидание',
    value: '500 руб.'
  },
  {
    id: 5,
    label: 'Остановка в пути более 15 минут',
    value: '500 руб.'
  },
]

export const comfortOptions = [
  {
    id: 1,
    label: 'Обратная поезда в тот же день',
    value: 'скидка 50%'
  },
  {
    id: 2,
    label: 'Ожидание при подаче 15 минут',
    value: 'Бесплатно'
  },
  {
    id: 3,
    label: '1 час ожидание',
    value: '500 руб.'
  },
  {
    id: 4,
    label: 'Остановка в пути более 15 минут',
    value: '500 руб.'
  },
]

export const comfortPlusOptions = [
  {
    id: 1,
    label: 'Обратная поезда в тот же день',
    value: 'скидка 50%'
  },
  {
    id: 2,
    label: 'Ожидание при подаче 15 минут',
    value: 'Бесплатно'
  },
  {
    id: 3,
    label: '1 час ожидание',
    value: '800 руб.'
  },
  {
    id: 4,
    label: 'Остановка в пути более 15 минут',
    value: '500 руб.'
  },
]

export const businessOptions = [
  {
    id: 1,
    label: 'Стоимость 1 км',
    value: 'от 70 руб.'
  },
  {
    id: 2,
    label: 'Обратная поезда в тот же день',
    value: 'скидка 50%'
  },
  {
    id: 3,
    label: 'Ожидание при подаче 15 минут',
    value: 'Бесплатно'
  },
  {
    id: 4,
    label: '1 час ожидание',
    value: '1500 руб.'
  },
  {
    id: 5,
    label: 'Остановка в пути более 15 минут',
    value: '1000 руб.'
  },
]

export const minivanOptions = [
  {
    id: 1,
    label: 'Обратная поезда в тот же день',
    value: 'скидка 50%'
  },
  {
    id: 2,
    label: 'Ожидание при подаче 15 минут',
    value: 'Бесплатно'
  },
  {
    id: 3,
    label: '1 час ожидание',
    value: '1000 руб.'
  },
  {
    id: 4,
    label: 'Остановка в пути более 15 минут',
    value: '1000 руб.'
  },
]

export const deliveryOptions = [
  {
    id: 1,
    label: 'Любое расстояние в пределах РФ',
    value: ''
  },
  {
    id: 2,
    label: 'Забираем и везем груз в день заказа',
    value: ''
  },
]

export const additionalServices = [
  { id: 1, label: 'Детское кресло', value: '600 руб.' },
  { id: 2, label: 'Встреча с табличкой в Аэропорту', value: '800 руб.' },
  { id: 3, label: 'Встреча у вагона на ЖД вокзале', value: '800 руб.' },
  { id: 4, label: 'Помощь с багажом', value: '800 руб.' },
  { id: 5, label: 'Животное в переноске', value: 'бесплатно' },
  { id: 6, label: 'Собака до 10 кг', value: '2000 руб.' },
  { id: 7, label: 'Собака от 10 кг до 20 кг', value: '3000 руб.' },
  { id: 8, label: 'Собака от 20 кг', value: '4000 руб.' },
  { id: 9, label: 'Дополнительный адрес', value: '500 руб.' }
]

export const planLabel = {
  [Prices.COMFORT]: 'Комфорт',
  [Prices.COMFORT_PLUS]: 'Комфорт+',
  [Prices.BUSINESS]: 'Бизнес',
  [Prices.MINIVAN]: 'Минивэн',
  [Prices.DELIVERY]: 'Доставка',
}