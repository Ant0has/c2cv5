import { IAdvantage } from "@/shared/types/general"
import { IRouteData } from "@/shared/types/route.interface"
import { calcTripsCount } from "@/shared/services/seo-utils"

const defaultAdvantages: IAdvantage[] = [
    {
      id: 1,
      title: '24/7',
      description: 'Приём заказов',
    },
    {
      id: 2,
      title: '5 мин',
      description: 'Подтверждение',
    },
  ]


export const getAdvantages = (route?: IRouteData, city?: string): IAdvantage[] => {
    const result: IAdvantage[] = []

    if(route){
      if(route.distance_km){
        result.push({
          id: 1,
          title: `${route.distance_km} км`,
          description: 'Расстояние',
        })
      }
      if(route.duration_hours && route.duration_hours > 0){
        result.push({
          id: 2,
          title: `~${route.duration_hours} ч`,
          description: 'В пути'
        })
      }
      if(route.url){
        const trips = calcTripsCount(route.url, route.is_whitelist || false)
        result.push({
          id: 3,
          title: `${trips}+`,
          description: `Поездок из ${city}`
        })
      }

      if(result.length < 3){
        for(let i = 0; i < defaultAdvantages.length; i++){
          if(result.length < 3){
            result.push(defaultAdvantages[i])
          }
        }
      }


    }else{
      result.push(...defaultAdvantages)
    }
    
    return result;
}