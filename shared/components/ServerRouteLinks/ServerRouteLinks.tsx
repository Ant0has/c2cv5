import s from './ServerRouteLinks.module.scss'

interface RouteLink {
  url: string
  title: string
}

interface Props {
  routes: RouteLink[]
  heading: string
  maxLinks?: number
}

export default function ServerRouteLinks({ routes, heading, maxLinks = 15 }: Props) {
  if (!routes || routes.length === 0) return null

  const displayRoutes = routes.slice(0, maxLinks)

  return (
    <section className={s.section}>
      <div className="container">
        <h3 className={s.heading}>{heading}</h3>
        <nav className={s.grid}>
          {displayRoutes.map((route) => (
            <a
              key={route.url}
              href={`/${route.url}.html`}
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
