import { Prices } from "../types/enums"

export const TELEGRAM_LINK = 'https://t.me/taxi_city2city'
export const WHATS_UP_LINK = 'https://wa.me/79381568757'
export const MAX_LINK = 'https://max.ru/id616606322786_bot'
export const PHONE_NUMBER_FIRST = '79381568757'
export const PHONE_NUMBER_SECOND = '88006007775'
export const EMAIL_ADDRESS = 'zakaz@city2city.ru'

export const BASE_URL = 'https://city2city.ru'
export const BASE_URL_API = 'https://city2city.ru/api'

export const SPEED = 80

export const COEFFICIENT_100 = 1.5
export const COEFFICIENT_100_150 = 1.2
export const COEFFICIENT_150_200 = 1.1
export const COEFFICIENT_200 = 1

export const DEFAULT_PRICE = 2000
export const DEFAULT_DISTANCE = 10

export const prices = {
  [Prices.COMFORT]: 30,
  [Prices.COMFORT_PLUS]: 40,
  [Prices.BUSINESS]: 70,
  [Prices.MINIVAN]: 55,
  [Prices.DELIVERY]: 25,
}
