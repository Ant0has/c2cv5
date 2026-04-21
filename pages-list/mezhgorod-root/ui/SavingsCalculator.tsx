'use client'

import { useState, useMemo } from 'react'

// Калькулятор экономии: такси-межгород vs собственная машина
// Формула своя машина: бензин + амортизация + стоимость времени водителя
// (40₽/час как средний час МРОТ-работы).

const DEFAULT_DIST = 500
const DEFAULT_FUEL_PRICE = 60 // ₽/литр АИ-95
const DEFAULT_CONSUMPTION = 8 // л/100км
const DEFAULT_DEPRECIATION = 4 // ₽/км (амортизация + ТО + резина)
const DEFAULT_HOUR_VALUE = 400 // ₽/час стоимость вашего времени за рулём
const AVG_SPEED = 80 // км/ч

// Тариф межгорода — эмпирическая формула: base + distance × rate
const TAXI_BASE = 1500
const TAXI_RATE = 28 // ₽/км для комфорт-класса

export default function SavingsCalculator() {
  const [distance, setDistance] = useState(DEFAULT_DIST)
  const [fuelPrice, setFuelPrice] = useState(DEFAULT_FUEL_PRICE)
  const [consumption, setConsumption] = useState(DEFAULT_CONSUMPTION)
  const [hourValue, setHourValue] = useState(DEFAULT_HOUR_VALUE)

  const result = useMemo(() => {
    const fuelCost = (distance * consumption / 100) * fuelPrice
    const depreciationCost = distance * DEFAULT_DEPRECIATION
    const timeCost = (distance / AVG_SPEED) * hourValue
    const ownCar = Math.round(fuelCost + depreciationCost + timeCost)

    const taxi = Math.round(TAXI_BASE + distance * TAXI_RATE)
    const savings = ownCar - taxi
    const savingsPercent = ownCar > 0 ? Math.round((savings / ownCar) * 100) : 0

    return {
      fuelCost: Math.round(fuelCost),
      depreciationCost: Math.round(depreciationCost),
      timeCost: Math.round(timeCost),
      ownCar,
      taxi,
      savings,
      savingsPercent,
      tripHours: Math.round(distance / AVG_SPEED * 10) / 10,
    }
  }, [distance, fuelPrice, consumption, hourValue])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    marginTop: 4,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(260px, 1fr)', gap: 24, alignItems: 'start' }}>
      {/* Inputs */}
      <div style={{ padding: 20, background: '#fafafa', borderRadius: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Ваши параметры</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Расстояние поездки (км)</label>
            <input type="number" min={50} max={3000} value={distance} onChange={e => setDistance(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Цена бензина (₽/л)</label>
            <input type="number" min={30} max={150} value={fuelPrice} onChange={e => setFuelPrice(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Расход топлива (л/100км)</label>
            <input type="number" min={4} max={20} step={0.1} value={consumption} onChange={e => setConsumption(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Стоимость вашего часа (₽)</label>
            <input type="number" min={100} max={5000} step={50} value={hourValue} onChange={e => setHourValue(Number(e.target.value))} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Result */}
      <div style={{ padding: 20, background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Сравнение</h3>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Своя машина на {distance} км ({result.tripHours} ч)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{result.ownCar.toLocaleString('ru-RU')}₽</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            {result.fuelCost.toLocaleString('ru-RU')}₽ бензин · {result.depreciationCost.toLocaleString('ru-RU')}₽ амортизация · {result.timeCost.toLocaleString('ru-RU')}₽ ваше время
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Такси межгород Комфорт</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{result.taxi.toLocaleString('ru-RU')}₽</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Водитель за рулём — ваше время свободно</div>
        </div>

        {result.savings > 0 ? (
          <div style={{ padding: 14, background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#166534', marginBottom: 4 }}>Вы сэкономите с такси</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#16a34a' }}>{result.savings.toLocaleString('ru-RU')}₽</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>{result.savingsPercent}% от поездки на своей машине</div>
          </div>
        ) : (
          <div style={{ padding: 14, background: '#fef3c7', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#92400e' }}>На этом маршруте своя машина выходит дешевле</div>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>Но вы всё равно тратите {result.tripHours} ч за рулём</div>
          </div>
        )}
      </div>
    </div>
  )
}
