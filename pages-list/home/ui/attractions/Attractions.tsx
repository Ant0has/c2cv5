import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton";
import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { IAttraction } from "@/shared/types/route.interface";

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
	cards:IAttraction[]	
}

const Attractions = ({ title, titlePrimary,cards, isHorizontal }: IAttractionsProps) => {
	return (
		<div className={clsx(isHorizontal ? 'bg-gray' : '')}>
			<HomeLayout
				top={<HomeLayoutTitle title={title} titlePrimary={titlePrimary} 
				description="Комфорт, Бизнес и Минивэн - поездки на любой случай" />}
			>
				<AttractionCardListLazy cards={cards} isHorizontal={isHorizontal} />
			</HomeLayout>
		</div>
	)
}

export default Attractions