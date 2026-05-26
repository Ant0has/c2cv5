'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import { Prices } from '@/shared/types/enums'
import { CAPACITY_DATA } from './capacity-data'
import s from './CapacityBlock.module.scss'

interface IProps {
  type: Prices
}

// Иконка пассажиров (силуэт человека)
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="currentColor"
    />
  </svg>
)

// Иконка чемодана
const LuggageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 4h6c.55 0 1 .45 1 1v1h3c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-1v1h-2v-1H8v1H6v-1H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h3V5c0-.55.45-1 1-1zm5 2V5h-4v1h4zM5 8v11h14V8H5zm2 1h2v9H7V9zm4 0h2v9h-2V9zm4 0h2v9h-2V9z"
      fill="currentColor"
    />
  </svg>
)

const CapacityBlock: FC<IProps> = ({ type }) => {
  const data = CAPACITY_DATA[type]
  // При смене тарифа компонент перемонтируется (key=type извне) и активный сбросится на 0
  const [activeIdx, setActiveIdx] = useState(0)

  if (!data) return null

  const activeScenario = data.scenarios[activeIdx] ?? data.scenarios[0]

  return (
    <div className={s.wrapper}>
      {/* === Бейджи: пассажиры + багаж === */}
      <div className={s.badges}>
        {data.passengers !== null && (
          <div className={s.badge}>
            <div className={clsx(s.badgeIcon, s.badgeIconBlue)}>
              <PersonIcon />
            </div>
            <div className={s.badgeText}>
              <span className={s.badgeNumber}>{data.passengers}</span>
              <span className={s.badgeLabel}>до {data.passengers} пассажиров</span>
            </div>
          </div>
        )}

        <div className={s.badge}>
          <div className={clsx(s.badgeIcon, s.badgeIconOrange)}>
            <LuggageIcon />
          </div>
          <div className={s.badgeText}>
            <span className={s.badgeNumber}>
              {/* Если в бейдже число — выделим его. Иначе как есть. */}
              {data.luggageBadge}
            </span>
            <span className={s.badgeLabel}>багаж</span>
          </div>
        </div>
      </div>

      {/* === Вместимость багажника === */}
      <div className={s.capacity}>
        <div className={s.capacityTitle}>Вместимость багажника</div>
        <div className={s.chips} role="tablist">
          {data.scenarios.map((sc, i) => (
            <button
              key={sc.id}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              className={clsx(s.chip, { [s.chipActive]: i === activeIdx })}
              onClick={() => setActiveIdx(i)}
            >
              {sc.label}
            </button>
          ))}
        </div>
        <div className={s.result}>{activeScenario.result}</div>
      </div>
    </div>
  )
}

export default CapacityBlock
