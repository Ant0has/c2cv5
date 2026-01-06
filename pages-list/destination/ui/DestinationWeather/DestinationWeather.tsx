'use client'

import clsx from "clsx"
import { IHubWeatherData, IHubWeatherForecast } from "@/shared/types/hub.interface"
import s from './DestinationWeather.module.scss'

interface Props {
  weatherDataJson?: string
}

// Иконки погоды по типу
const getWeatherIcon = (icon: string): string => {
  const icons: Record<string, string> = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'fog': '🌫️',
    'drizzle': '🌦️',
    'rain': '🌧️',
    'rain-heavy': '🌧️',
    'sleet': '🌨️',
    'snow': '❄️',
    'snow-heavy': '❄️',
    'thunderstorm': '⛈️',
    'unknown': '🌡️'
  }
  return icons[icon] || icons['unknown']
}

const DestinationWeather = ({ weatherDataJson }: Props) => {
  if (!weatherDataJson) return null

  let weatherData: IHubWeatherData
  try {
    weatherData = JSON.parse(weatherDataJson)
  } catch {
    return null
  }

  if (!weatherData.forecast?.length) {
    return null
  }

  const today = weatherData.forecast[0]
  const nextDays = weatherData.forecast.slice(1, 5)

  return (
    <section id="weather" className={s.weather}>
      <div className="container">
        <h2 className={clsx('title', s.title)}>Погода в {weatherData.city}</h2>

        <div className={s.card}>
          <div className={s.today}>
            <div className={s.todayMain}>
              <span className={s.todayIcon}>{getWeatherIcon(today.icon)}</span>
              <div className={s.todayInfo}>
                <span className={s.todayTemp}>{today.tempMax > 0 ? '+' : ''}{today.tempMax}°</span>
                <span className={s.todayDesc}>{today.description}</span>
              </div>
            </div>
            <div className={s.todayMeta}>
              <span>Мин: {today.tempMin > 0 ? '+' : ''}{today.tempMin}°</span>
              <span>Осадки: {today.precipitationProbability}%</span>
            </div>
          </div>

          <div className={s.forecast}>
            {nextDays.map((day: IHubWeatherForecast, idx: number) => (
              <div key={idx} className={s.forecastDay}>
                <span className={s.dayName}>{day.dayOfWeek}</span>
                <span className={s.dayIcon}>{getWeatherIcon(day.icon)}</span>
                <span className={s.dayTemp}>
                  {day.tempMax > 0 ? '+' : ''}{day.tempMax}°
                </span>
              </div>
            ))}
          </div>
        </div>

        {weatherData.updatedAt && (
          <p className={s.updated}>
            Обновлено: {new Date(weatherData.updatedAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </section>
  )
}

export default DestinationWeather
