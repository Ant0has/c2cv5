'use client'

import { IHubDestination, IHubWeatherData } from "@/shared/types/hub.interface"
import s from './ResortWeatherGrid.module.scss'
import clsx from "clsx"
import { useIsMobile } from "@/shared/hooks/useResize"

interface Props {
  destinations: IHubDestination[]
}

interface ResortWeather {
  resort: string
  weather: IHubWeatherData | null
  routesCount: number
}

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

const ResortWeatherGrid = ({ destinations }: Props) => {
  const resortsMap = new Map<string, ResortWeather>()
  const isMobile = useIsMobile()

  destinations.forEach(dest => {
    const resort = dest.toCity || 'Неизвестно'

    if (!resortsMap.has(resort)) {
      let weatherData: IHubWeatherData | null = null
      if (dest.weatherData) {
        try {
          weatherData = dest.weatherData
        } catch {}
      }

      resortsMap.set(resort, {
        resort,
        weather: weatherData,
        routesCount: 1
      })
    } else {
      const existing = resortsMap.get(resort)!
      existing.routesCount++
    }
  })

  const resorts = Array.from(resortsMap.values())

  return (
    <section className="padding-y-40">
      <div className={clsx("container",{'padding-t-0':isMobile})}>
        <h2 className={clsx('title', 'margin-b-8')}>Погода на курортах</h2>
        <p className="sub-title text-secondary margin-b-32">Актуальный прогноз для планирования поездки</p>

        <div className={s.grid}>
          {resorts.map((item, idx) => (
            <div key={idx} className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.resortName}>{item.resort}</h3>
                <span className={s.routesCount}>{item.routesCount} маршрут{item.routesCount > 1 ? (item.routesCount > 4 ? 'ов' : 'а') : ''}</span>
              </div>

              {item.weather && item.weather.forecast?.length > 0 ? (
                <div className={s.weatherInfo}>
                  <div className={s.today}>
                    <span className={s.todayIcon}>{getWeatherIcon(item.weather.forecast[0].icon)}</span>
                    <div className={s.todayData}>
                      <span className={s.temp}>
                        {item.weather.forecast[0].tempMax > 0 ? '+' : ''}{item.weather.forecast[0].tempMax}°
                      </span>
                      <span className={s.desc}>{item.weather.forecast[0].description}</span>
                    </div>
                  </div>

                  <div className={s.forecast}>
                    {item.weather.forecast.slice(1, 5).map((day, i) => (
                      <div key={i} className={s.forecastDay}>
                        <span className={s.dayName}>{day.dayOfWeek}</span>
                        <span className={s.dayIcon}>{getWeatherIcon(day.icon)}</span>
                        <span className={s.dayTemp}>
                          {day.tempMax > 0 ? '+' : ''}{day.tempMax}°
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={s.noWeather}>
                  <span className={s.noWeatherIcon}>🏔️</span>
                  <span>Данные загружаются</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResortWeatherGrid
