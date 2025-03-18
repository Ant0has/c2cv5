import type { Metadata } from 'next'
import { Home } from './Home'

// import { productService } from '@/services/product.service'

// import { Home } from './Home'

export const metadata: Metadata = {
  title: 'Такси'
}

export const revalidate = 60

// async function getProducts() {
// 	const data = (await productService.getMostPopular()).slice(0, 6)

// 	return data
// }

export default function Page() {
  // const data = await getProducts()

  return <Home />
}