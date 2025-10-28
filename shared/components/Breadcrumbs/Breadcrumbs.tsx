import Link from "antd/es/typography/Link"
import s from './Breadcrumbs.module.scss'

const Breadcrumbs = () => {
  return (
    <div className={s.breadcrumbs}>
      <Link href='/'>
        Главная
      </Link>
    </div>
  )
}

export default Breadcrumbs