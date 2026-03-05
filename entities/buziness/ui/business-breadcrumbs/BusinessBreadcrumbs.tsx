import Link from 'next/link'
import s from './BusinessBreadcrumbs.module.scss'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

const BusinessBreadcrumbs = ({ items }: Props) => {
  return (
    <nav className={s.wrapper} aria-label="Хлебные крошки">
      <div className="container">
        <ol className={s.list}>
          {items.map((item, index) => (
            <li key={index} className={s.item}>
              {index > 0 && <span className={s.separator}>→</span>}
              {item.href ? (
                <Link href={item.href} className={s.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={s.current}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default BusinessBreadcrumbs
