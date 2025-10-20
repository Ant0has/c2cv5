import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
import s from './Attractions.module.scss';
import AttractionCard from "./AttractionCard";

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
				<div className={s.attractionsWrapper}>
					<ul className={s.attractionsContainer}>
						{cards.map((attraction, index) => (
							<li className={s.attractionsItem} key={index}>
								<AttractionCard isHorizontal={isHorizontal} {...attraction} />
							</li>
						))}
					</ul>
				</div>
			</HomeLayout>
		</>
	)
}

export default Attractions