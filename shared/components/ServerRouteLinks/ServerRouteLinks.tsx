import s from './ServerRouteLinks.module.scss'
import { uniqueRouteLinks } from '@/shared/lib/route-url'

interface RouteLink {
  url: string
  title: string
}

interface Props {
  routes: RouteLink[]
  heading: string
  maxLinks?: number
  currentPath?: string
}

export default function ServerRouteLinks({ routes, heading, maxLinks = 15, currentPath }: Props) {
  if (!routes || routes.length === 0) return null

  const displayRoutes = uniqueRouteLinks(routes, currentPath).slice(0, maxLinks)
  if (displayRoutes.length === 0) return null

  return (
    <section className={s.section}>
      <div className="container">
        <h3 className={s.heading}>{heading}</h3>
        <nav className={s.grid}>
          {displayRoutes.map((route) => (
            <a
              key={route.href}
              href={route.href}
              className={s.link}
            >
              {route.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
