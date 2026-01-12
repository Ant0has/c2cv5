'use client'
import { useIsMobile } from "@/shared/hooks/useResize";
import clsx from "clsx";
import Image from "next/image";
import DlyaBiznesaHeroContent from "./dlya-binznesa-hero-content/DlyaBiznesaHeroContent";
import DlyaBiznesaHeroForm from "./dlya-biznesa-hero-form/DlyaBiznesaHeroForm";
import s from './DlyBiznesaHero.module.scss';

const DlyaBiznesaHero = () => {
  const isMobile = useIsMobile();

  return (
    <div className={clsx('relative', {'padding-b-104': !isMobile}, {'padding-b-40': isMobile})}>
      <div className={clsx("container", 'relative z-3')}>
        <div className={clsx(s.content, "max-width-696")}>
          <DlyaBiznesaHeroContent />

          <DlyaBiznesaHeroForm /> 

        </div>
      </div>
      <div className={clsx(s.phones)}>
        <Image className={s.blockImage}
          src="/images/dlya-biznesa/businessman-lg.png"
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

export default DlyaBiznesaHero;