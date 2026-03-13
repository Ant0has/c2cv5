'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import Price from "@/pages-list/home/ui/Price/Price"
import OrderSteps from "@/pages-list/home/ui/OrderSteps/OrderSteps"
import DestinationFeatures from "@/pages-list/destination/ui/DestinationFeatures/DestinationFeatures"
import DestinationDescription from "@/pages-list/destination/ui/DestinationDescription/DestinationDescription"
import DestinationWeather from "@/pages-list/destination/ui/DestinationWeather/DestinationWeather"
import SeoText from "@/shared/components/SeoText/SeoText"
import DestinationFaq from "@/pages-list/destination/ui/DestinationFaq/DestinationFaq"
import s from './DestinationPage.module.scss'
import HubHero from "@/pages-list/gornolyzhka/ui/HubHero/HubHero"
import { formatPrice } from "@/shared/services/seo-utils"

interface Props {
    destination: IHubDestination
}


const DestinationPage = ({ destination }: Props) => {
    //   const { setDeparturePoint, setArrivalPoint } = useContext(PointsContext)

    //   useEffect(() => {
    //     if (destination.fromCity) {
    //       setDeparturePoint(destination.fromCity)
    //     }
    //     if (destination.toCity) {
    //       setArrivalPoint(destination.toCity)
    //     }
    //   }, [destination])

    const breadcrumbItems = [
        { label: 'Главная', href: '/' },
        { label: destination.hub.name, href: `/${destination.hub.slug}` },
        { label: destination.name, href: null }
    ]

    const routeName = `${destination.fromCity || ''} — ${destination.toCity || ''}`
    const distanceText = destination.distance ? `${destination.distance} км` : ''
    const durationText = destination.duration || ''
    const priceText = destination.price ? `от ${new Intl.NumberFormat('ru-RU').format(Number(destination.price))} ₽` : ''

    const seoText = `
    <h2>Трансфер ${routeName}</h2>
    <p>Закажите комфортный трансфер по маршруту ${routeName} от службы City2City.
    ${distanceText ? `Расстояние маршрута — ${distanceText}.` : ''}
    ${durationText ? `Время в пути — ${durationText}.` : ''}
    ${priceText ? `Стоимость поездки — ${priceText}.` : ''}</p>
    <h3>Что входит в стоимость</h3>
    <ul>
      <li>Подача автомобиля по указанному адресу</li>
      <li>Ожидание до 15 минут бесплатно</li>
      <li>Помощь с багажом</li>
      <li>Комфортабельный автомобиль с кондиционером</li>
      <li>Детское кресло по запросу</li>
    </ul>
    <h3>Как заказать трансфер</h3>
    <p>Оставьте заявку на сайте или позвоните по телефону +7 (938) 156-87-57.
    Мы работаем круглосуточно и подберём оптимальный вариант для вашей поездки.</p>
  `

    const isSeaHub = destination.hub?.slug === 'morskoj-otdyh';
    const defaultIcon = isSeaHub ? '/icons/beach_ico.png' : '/icons/snowboard_ico.png';

    const getBenefits = () => {
        const result = [];

        if (destination.distance) {
            result.push({
                icon: isSeaHub ? '/icons/wave_ico.png' : defaultIcon,
                title: `${destination.distance} км`,
                description: 'расстояние',
            })
        }
        if (destination.duration) {
            result.push({
                icon: isSeaHub ? '/icons/sun_ico.png' : defaultIcon,
                title: `${destination.duration}`,
                description: 'в пути',
            })
        }
        if (destination.price) {
            result.push({
                icon: isSeaHub ? '/icons/beach_ico.png' : defaultIcon,
                title: `от ${formatPrice(Number(destination.price))} ₽`,
                description: destination.priceNote || 'стоимость',
            })
        }

        return result;

    }

    return (
        <div className={s.destinationPage}>

            <HubHero
                hub={destination.hub}
                destination={destination}
                benefits={getBenefits()}
                breadcrumbItems={breadcrumbItems} textColor="#000000"
            />

            <section className="container" id="order">
                <Price
                    title={routeName}
                //   isMilitary={destination.targetAudience === 'military'}
                />
            </section>

            <DestinationFeatures destination={destination} />

            {destination.weatherData && (
                <DestinationWeather weatherDataJson={JSON.stringify(destination.weatherData)} />
            )}

            <OrderSteps />

            {destination.description && (
                <DestinationDescription destination={destination} />
            )}

            {destination.faq && (
                <DestinationFaq destination={destination} />
            )}

            <SeoText content={seoText} />
        </div>
    )
}

export default DestinationPage
