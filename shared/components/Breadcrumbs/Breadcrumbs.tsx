import Link from "antd/es/typography/Link"
import s from './Breadcrumbs.module.scss'
import Script from "next/script"
import { generateBreadcrumbSchemaOrg } from "@/shared/services/seo-utils"

const Breadcrumbs = () => {
  return (
    <>
    <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchemaOrg()) }}
      />
    <div className={s.breadcrumbs}>
      <Link href='/'>
        Главная
      </Link>
    </div>
    </>
  )
}

export default Breadcrumbs