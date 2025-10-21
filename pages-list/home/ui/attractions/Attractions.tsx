import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton";
import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
import dynamic from "next/dynamic";

// Ленивая загрузка с помощью Next.js dynamic
const AttractionCardListLazy = dynamic(
	() => import('./AttractionCardList/AttractionCardList'),
	{
	  ssr: false,
	  loading: () => <LoadingSkeleton height="200px" />,
	}
  );

interface IAttractionsProps {
	title: string;
	titlePrimary?: string;
	isHorizontal?: boolean;
	cards:Array<{
		title:string
		subTitle:string
		description:string
		image:string
		tags?:Array<{
			name:string
			isPrimary?:boolean
		}>
	}>
}

const Attractions = ({ title, titlePrimary,cards, isHorizontal }: IAttractionsProps) => {
	return (
		<>
			<HomeLayout
				top={<HomeLayoutTitle title={title} titlePrimary={titlePrimary} 
				description="Комфорт, Бизнес и Минивэн - поездки на любой случай" />}
			>
				<AttractionCardListLazy cards={cards} isHorizontal={isHorizontal} />
			</HomeLayout>
		</>
	)
}

export default Attractions