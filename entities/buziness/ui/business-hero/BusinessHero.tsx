'use client'
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import Image from "next/image";
import BusinessHeroContent from "./business-hero-content/BusinessHeroContent";
import BusinessHeroForm from "./business-hero-form/BusinessHeroForm";
import s from './BusinessHero.module.scss';
import { usePathname } from "next/navigation";
import BusinessDeliveryHeroForm from "../business-delivery-hero-form/BusinessDeliveryHeroForm";

interface Props {
  title: {text: string, isPrimary: boolean}[];
  description: string;
  image: string;
  bullets: string[];
  staticsList: {id: number, label: string, value: string}[];
}

const BusinessHero = ({ image, ...props }: Props) => {
  const isMobile = useIsMobile();
  const contentImage = image;
  const pathname = usePathname();
  const isDostavkaGruzov = pathname.includes('dostavka-gruzov');
  console.log('isDostavkaGruzov', isDostavkaGruzov);
  return (
    <div className={clsx('relative', {'padding-b-104': !isMobile}, {'padding-b-40': isMobile})}>
      <div className={clsx("container", 'relative z-3')}>
        <div className={clsx(s.content, "max-width-696")}>
          <BusinessHeroContent {...props} />
          {isDostavkaGruzov ? <BusinessDeliveryHeroForm /> : <BusinessHeroForm />}  

        </div>
      </div>
      <div className={clsx(s.phones)}>
        <Image className={s.blockImage}
          src={contentImage}
          alt="Businessman Image"
          width={750} height={740}
        />
        <Image
          className={s.logoImage}
          src="/images/dlya-biznesa/businessman-logo.png"
          alt="Businessman Logo Image"
          width={1100} height={700}
        />
        <div className={s.glowEffect} />
      </div>
    </div>
  )
}

export default BusinessHero;