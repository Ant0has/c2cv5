'use client'

import { IHub, IHubDestination } from "@/shared/types/hub.interface"
import s from './HubHero.module.scss'
import Breadcrumbs from "@/shared/components/Breadcrumbs/Breadcrumbs"
import Button from "@/shared/components/ui/Button/Button"
import { Blocks, ButtonTypes } from "@/shared/types/enums"
import { useContext } from "react"
import { ModalContext } from "@/app/providers"

interface Props {
  hub: IHub,
  destination?: IHubDestination,
  benefits: { icon: string, title: string, description: string }[]
  breadcrumbItems?: { label: string, href: string | null }[]
  textColor?: string
}

const HubHero = ({ hub, destination, benefits, breadcrumbItems, textColor = '#ffffff' }: Props) => {
  const { setOrderModalData } = useContext(ModalContext)

  const isSkiHub = hub.slug === 'gornolyzhka'
  const heroImage = isSkiHub ? '/images/gornolygka.png' : null

  return (
    <section
      className={s.hero}
      style={heroImage ? {
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right'
      } : undefined}
    >
      <div className={s.heroOverlay}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} textColor="#ffffff" />
          <div className={s.heroContent}>
            {/* {isSkiHub && (
              <div className={s.motto}>
                <span className={s.mottoIcon}>🎿</span>
                <span className={s.mottoText}>На Склон!</span>
              </div>
            )} */}
            <h1 className={s.heroTitle}>{hub.title}</h1>
            {hub.subtitle && (
              <p className={s.heroSubtitle}>{hub.subtitle}</p>
            )}
            {hub.description && (
              <p className={s.heroDescription}>{hub.description}</p>
            )}
            <div className={s.heroActions}>
              {/* <Button
                type={ButtonTypes.PRIMARY}
                text="Выбрать направление"
                // handleClick={() => goToBlock('destinations')}
              /> */}
              {/* <Button
                type={ButtonTypes.SECONDARY}
                text="Позвонить"
                link="tel:+79185875454"
              /> */}
              <Button type={ButtonTypes.PRIMARY} text="Заказать поездку" handleClick={() => setOrderModalData({
                status: true,
                block: Blocks.HUB_HERO,
                order_from: destination?.fromCity || '',
                order_to: destination?.toCity || '',

              })} />
            </div>

            <div className={s.stats}>
              {benefits.map((benefit) => (
                <div className={s.statItem}>
                  <span className={s.statValue}>{benefit.title}</span>
                  <span className={s.statLabel}>{benefit.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HubHero
