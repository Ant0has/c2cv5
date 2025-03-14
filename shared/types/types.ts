import { ReactElement } from "react"

export interface IconProps {
  fill?: string
  className?: string
  onClick?: () => void
}

export interface IPriceOptions {
  id: number
  label: string
  value: string
}

export interface IReviewData {
  id: number
  avatar: string
  username: string
  city: string
  rate: number,
  date: number
  review: string
}