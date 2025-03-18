import clsx from "clsx";
import { FC } from "react";
import s from './ForBusinessContent.module.scss'

interface IProps {
 title?:unknown;
}

const ForBusinessContent: FC<IProps> = () => {

  const advancements = [
    {
      id: 1,
      label: '8 лет',
      value: 'работы'
    },
    {
      id: 2,
      label: 'Более 9000',
      value: 'трансферов'
    },
    {
      id: 3,
      label: '79 регионов',
      value: 'присутствия'
    },
    {
      id: 4,
      label: 'Более 60',
      value: 'партнеров юрлиц'
    }
  ]

  return (
    <>
      <h2 className="white-color title title-m-32"> CITY 2 CITY <span>для бизнеса</span></h2>

      <p className={clsx(s.description, 'font-16-normal white-color')}> Корпоративный трансфер сотрудников до дома с корпоративов и работы. Для корпоративных клиентов доступна доставка сотрудников на вахту, обслуживание в командировках, встречи.</p >

      <ul className={s.advancements}>
        {
          advancements.map(advancement => (
            <li key={advancement.id} className={s.advancement}>
              <div className={s.left}>{advancement.label}</div>
              <div className={s.right}>{advancement.value}</div>
            </li>
          ))
        }
      </ul>
      <p className={clsx(s.partner, 'white-color font-18-semibold')}>
        Постоянный <span className="orange-color font-18-semibold">партнер:</span><br />
        Фестиваля Signal Никола-Ленивец<br />
        Сборная РФ по Биатлону и Лыжным гонкам
      </p>
    </>
  )
}

export default ForBusinessContent;