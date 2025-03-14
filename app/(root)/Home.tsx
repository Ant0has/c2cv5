'use-clint'
import Welcome from "@/shared/components/Welcome/Welcome"
import Price from "@/shared/components/Price/Price"
import OrderSteps from "@/shared/components/OrderSteps/OrderSteps"
import Reviews from "@/shared/components/Reviews/Reviews"
// import { Catalog } from '@/components/ui/catalog/Catalog'





// import { PUBLIC_URL } from '@/config/url.config'

// import { IProduct } from '@/shared/types/product.interface'

// import { Hero } from './hero/Hero'

interface HomeProps {
	products: unknown
}


export function Home({  }: HomeProps) {

	return (
		<>
			<Welcome />
			<Price />
			<OrderSteps />
			<Reviews />
		</>
	)
}
