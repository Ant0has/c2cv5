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

  return (
    <div className="savingsCalc">
      <style>{`
        .savingsCalc { display: grid; gap: 20px; grid-template-columns: 1fr; }
        @media (min-width: 760px) {
          .savingsCalc { grid-template-columns: 340px 1fr; }
        }
        .savingsCalc .inputs { padding: 20px; background: #fafafa; border-radius: 12px; }
        .savingsCalc .inputRow { display: grid; grid-template-columns: 1fr 110px; gap: 12px; align-items: center; margin-bottom: 12px; }
        .savingsCalc .inputRow:last-child { margin-bottom: 0; }
        .savingsCalc .inputRow label { font-size: 13px; color: #555; }
        .savingsCalc .inputRow input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; text-align: right; }
        .savingsCalc .result { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; align-items: stretch; }
        .savingsCalc .col { padding: 18px; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; }
        .savingsCalc .col.car { background: #fef2f2; border: 1px solid #fecaca; }
        .savingsCalc .col.taxi { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .savingsCalc .col .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .savingsCalc .col .price { font-size: 30px; font-weight: 800; line-height: 1.1; margin-bottom: 6px; }
        .savingsCalc .col.car .price { color: #dc2626; }
        .savingsCalc .col.taxi .price { color: #16a34a; }
        .savingsCalc .col .detail { font-size: 12px; color: #555; line-height: 1.4; margin-top: auto; padding-top: 10px; }
        .savingsCalc .verdict { margin-top: 14px; padding: 14px 18px; border-radius: 10px; text-align: center; }
        .savingsCalc .verdict.save { background: #dcfce7; color: #166534; }
        .savingsCalc .verdict.lose { background: #fef3c7; color: #92400e; }
        .savingsCalc .verdict .big { font-size: 26px; font-weight: 700; margin: 4px 0; }
        .savingsCalc .verdict.save .big { color: #16a34a; }
      `}</style>

      {/* Inputs */}
      <div className="inputs">
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 14px', color: '#333' }}>Ваши параметры</h3>
        <div className="inputRow">
          <label>Расстояние, км</label>
          <input type="number" min={50} max={3000} value={distance} onChange={e => setDistance(Number(e.target.value))} />
        </div>
        <div className="inputRow">
          <label>Цена бензина, ₽/л</label>
          <input type="number" min={30} max={150} value={fuelPrice} onChange={e => setFuelPrice(Number(e.target.value))} />
        </div>
        <div className="inputRow">
          <label>Расход, л/100км</label>
          <input type="number" min={4} max={20} step={0.1} value={consumption} onChange={e => setConsumption(Number(e.target.value))} />
        </div>
        <div className="inputRow">
          <label>Ваш час, ₽</label>
          <input type="number" min={100} max={5000} step={50} value={hourValue} onChange={e => setHourValue(Number(e.target.value))} />
        </div>
      </div>

      {/* Result */}
      <div>
        <div className="result">
          <div className="col car">
            <div>
              <div className="label">Своя машина</div>
              <div className="price">{result.ownCar.toLocaleString('ru-RU')}₽</div>
            </div>
            <div className="detail">
              {result.fuelCost.toLocaleString('ru-RU')}₽ бензин<br />
              {result.depreciationCost.toLocaleString('ru-RU')}₽ износ<br />
              {result.timeCost.toLocaleString('ru-RU')}₽ ваше время ({result.tripHours}ч)
            </div>
          </div>
          <div className="col taxi">
            <div>
              <div className="label">Такси Комфорт</div>
              <div className="price">{result.taxi.toLocaleString('ru-RU')}₽</div>
            </div>
            <div className="detail">
              Водитель за рулём<br />
              Ваше время свободно<br />
              Фиксированная цена
            </div>
          </div>
        </div>

        {result.savings > 0 ? (
          <div className="verdict save">
            Экономия с такси
            <div className="big">{result.savings.toLocaleString('ru-RU')}₽ · −{result.savingsPercent}%</div>
          </div>
        ) : (
          <div className="verdict lose">
            На этом маршруте своя машина дешевле, но вы потратите {result.tripHours}ч за рулём
          </div>
        )}
      </div>
    </div>
  )
}
