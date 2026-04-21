'use client'

const ROWS = [
  { label: 'Подача к подъезду', values: ['✓ Да', '— Только свой гараж', '— Автовокзал', '— Встреча на трассе'] },
  { label: 'Время выезда', values: ['Любое, 24/7', 'Любое', 'По расписанию', 'По расписанию водителя'] },
  { label: 'Без попутчиков', values: ['✓ Да', '✓ Да', '— 40+ человек', '— 2-4 попутчика'] },
  { label: 'Багаж любого размера', values: ['✓ Да', '✓ Да', '~ Лимит на багаж', '~ По договорённости'] },
  { label: 'Остановки в пути', values: ['✓ Любые', '✓ Любые', '— Только на АЗС', '— По договорённости'] },
  { label: 'Стоимость на 500 км', values: ['от 15 000₽', '~14 000₽ бензин+износ', '2 500 — 4 500₽', '2 500 — 3 500₽'] },
  { label: 'Время на 500 км', values: ['~ 7 часов', '~ 7 часов + отдых', '~ 10 часов', '~ 7 часов + стыковки'] },
  { label: 'Документы для бизнеса', values: ['✓ НДС + ЭДО', '— Авансовый отчёт', '— Электронный билет', '— Чек водителя'] },
]

const COLS = [
  { name: 'Такси межгород', subtitle: 'City2City', highlight: true },
  { name: 'Свой автомобиль', subtitle: 'аренда / личный' },
  { name: 'Автобус', subtitle: 'межгород' },
  { name: 'BlaBlaCar', subtitle: 'попутка' },
]

export default function ComparisonTable() {
  return (
    <div style={{ overflowX: 'auto', margin: '0 -4px' }}>
      <table style={{
        width: '100%',
        minWidth: 720,
        borderCollapse: 'separate',
        borderSpacing: 0,
        fontSize: 14,
      }}>
        <thead>
          <tr>
            <th style={{ width: '22%', textAlign: 'left', padding: 12, background: '#fafafa', borderBottom: '2px solid #eee', position: 'sticky', left: 0 }}></th>
            {COLS.map((c, i) => (
              <th key={i} style={{
                padding: 12,
                textAlign: 'left',
                background: c.highlight ? '#fff7ed' : '#fafafa',
                borderBottom: '2px solid',
                borderBottomColor: c.highlight ? '#ff6b00' : '#eee',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.highlight ? '#ff6b00' : '#222' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{c.subtitle}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, rIdx) => (
            <tr key={rIdx}>
              <td style={{ padding: 12, fontWeight: 500, color: '#555', background: rIdx % 2 === 0 ? '#fafafa' : '#fff', position: 'sticky', left: 0 }}>{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} style={{
                  padding: 12,
                  background: COLS[i].highlight ? (rIdx % 2 === 0 ? '#fff7ed' : '#fffaf4') : (rIdx % 2 === 0 ? '#fafafa' : '#fff'),
                  fontWeight: COLS[i].highlight ? 500 : 400,
                  color: v.startsWith('✓') ? '#16a34a' : v.startsWith('—') ? '#888' : v.startsWith('~') ? '#ca8a04' : '#333',
                }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: '#888', marginTop: 12, marginBottom: 0 }}>
        Цены указаны для поездки на ~500 км (например, Воронеж → Москва). Реальная стоимость вашего маршрута — в калькуляторе выше.
      </p>
    </div>
  )
}
