import type { CaseMetric } from '../../types'
import s from './CaseMetrics.module.scss'

interface Props {
  metrics: CaseMetric[]
}

const CaseMetrics = ({ metrics }: Props) => {
  return (
    <div className={s.metrics}>
      {metrics.map((metric, i) => (
        <div key={i} className={s.item}>
          <span className={s.value}>{metric.value}</span>
          <span className={s.label}>{metric.label}</span>
        </div>
      ))}
    </div>
  )
}

export default CaseMetrics
