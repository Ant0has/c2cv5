import Link from 'next/link'
import s from './BusinessRegionLinks.module.scss'

interface CityLink {
  name: string
  href: string
}

interface RegionGroup {
  name: string
  shortName: string
  href: string
  cities: CityLink[]
}

interface Props {
  regions: RegionGroup[]
}

const BusinessRegionLinks = ({ regions }: Props) => {
  if (regions.length === 0) return null

  return (
    <div className={s.wrapper}>
      <div className="container">
        <h2 className="title text-white text-center">
          Работаем в <span className="text-primary">30 городах</span> России
        </h2>
        <p className={s.subtitle}>
          Корпоративный междугородний трансфер с выделенным менеджером
        </p>
        <div className={s.regions}>
          {regions.map((region) => (
            <div key={region.href} className={s.region}>
              <Link href={region.href} className={s.regionHeader}>
                <span className={s.regionName}>{region.name}</span>
                <span className={s.regionBadge}>{region.cities.length} {getCityWord(region.cities.length)}</span>
                <span className={s.regionArrow}>&rarr;</span>
              </Link>
              <div className={s.cities}>
                {region.cities.map((city) => (
                  <Link key={city.href} href={city.href} className={s.cityChip}>
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getCityWord(count: number): string {
  if (count === 1) return 'город'
  if (count >= 2 && count <= 4) return 'города'
  return 'городов'
}

export default BusinessRegionLinks
