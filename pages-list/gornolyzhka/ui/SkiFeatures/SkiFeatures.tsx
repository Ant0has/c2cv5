'use client'

import s from './SkiFeatures.module.scss'

const SkiFeatures = () => {
  const features = [
    {
      icon: '🛡️',
      title: 'Каждая поездка застрахована',
      description: 'Полная страховка пассажиров и багажа на всё время трансфера'
    },
    {
      icon: '🏔️',
      title: 'Горное вождение',
      description: 'Все водители прошли специальный курс горного вождения'
    },
    {
      icon: '🎿',
      title: 'Перевозка снаряжения',
      description: 'Бесплатная перевозка лыж, сноубордов и горнолыжного оборудования'
    },
    {
      icon: '❄️',
      title: 'Зимняя резина',
      description: 'Все автомобили оснащены качественной зимней резиной'
    }
  ]

  return (
    <section className={s.section}>
      <div className="container">
        <div className={s.grid}>
          {features.map((feature, idx) => (
            <div key={idx} className={s.card}>
              <span className={s.icon}>{feature.icon}</span>
              <div className={s.content}>
                <h3 className={s.title}>{feature.title}</h3>
                <p className={s.description}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkiFeatures
