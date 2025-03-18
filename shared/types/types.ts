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

export interface IRegion {
  ID: number;
  post_id: number;
  meta_key: string;
  meta_id: number;
  meta_value: string;
  region_value: string;
  url: string | null;
  address: string | null;
  phone_number: string | null;
}