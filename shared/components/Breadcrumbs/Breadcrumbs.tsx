import Link from "antd/es/typography/Link"
import s from './Breadcrumbs.module.scss'
import Script from "next/script"
import { generateBreadcrumbSchemaOrg } from "@/shared/services/seo-utils"
import clsx from "clsx"

interface Props {
  items?: { label: string, href: string | null }[]
  textColor?: string
  className?: string
}

const Breadcrumbs = ({ items = [{ label: 'Главная', href: '/' }], textColor = '#000000', className }: Props) => {
  return (
    <>
    <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchemaOrg()) }}
      />
    <nav className={clsx(s.breadcrumbs, className)}>
      {items.map((item, index: number) => (
        <span key={index} className={s.item}>
          {item.href ? (
            <Link href={item.href} className={s.link} style={{ color: textColor }}>
              {item.label}
            </Link>
          ) : (
            <span className={s.current} style={{ color: textColor }}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className={s.separator} style={{ color: textColor }}>/</span>
          )}
        </span>
      ))}
    </nav>
    </>
  )
}

export default Breadcrumbs