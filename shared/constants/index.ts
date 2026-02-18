import { Prices } from "../types/enums"

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://city2city.ru'
export const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API || 'https://city2city.ru/api'

export const SPEED = 80

export const COEFFICIENT_100 = 1.5
export const COEFFICIENT_100_150 = 1.2
export const COEFFICIENT_150_200 = 1.1
export const COEFFICIENT_200 = 1

export const DEFAULT_PRICE = 2000
export const DEFAULT_DISTANCE = 10

export const prices = {
  [Prices.STANDARD]: 25,
  [Prices.COMFORT]: 30,
  [Prices.COMFORT_PLUS]: 40,
  [Prices.BUSINESS]: 70,
  [Prices.MINIVAN]: 55,
  [Prices.DELIVERY]: 25,
}

export const weightOptions = [
  { label: 'До 100 кг', value: "До 100 кг" },
  { label: 'От 100 кг до 500 кг', value: "От 100 кг до 500 кг" },
]
