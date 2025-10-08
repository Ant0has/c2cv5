"use client"

import { ModalContext } from "@/app/providers";
import RoadIcon from "@/public/icons/RoadIcon";
import SwapIcon from "@/public/icons/SwapIcon";
import TimeIcon from "@/public/icons/TimeIcon";
import WalletIcon from "@/public/icons/WalletIcon";
import { COEFFICIENT_100, COEFFICIENT_100_150, COEFFICIENT_150_200, COEFFICIENT_200, prices, SPEED } from "@/shared/constants";
import { getCurrentKey } from "@/shared/services/get-current-key";
import { yandexMapsService } from "@/shared/services/yandex-maps.service";
import { Blocks, ButtonTypes, Prices } from "@/shared/types/enums";
import { Map, RoutePanel, YMaps } from "@pbe/react-yandex-maps";
import { message } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { FC, useContext, useRef, useState } from "react";
import Button from "../../ui/Button/Button";
import SearchInput from "../../ui/SearchInput/SearchInput";
import s from './AddressSelect.module.scss';
import { checkString } from "./utils";

interface IProps {
  selectedPlan: Prices
  isMilitary?: boolean
  cityData?: string
}

const AddressSelect: FC<IProps> = ({ selectedPlan, isMilitary, cityData }) => {
  const routePanelRef = useRef<any>()

  const initialPoints = ( () => {
    const pointsArray = cityData?.split(',')
    return  {
      departurePoint: (pointsArray?.[0] || '').replace(/^Из\s+/i, '').trim(),
      // departurePoint: await findBestMatchPoint(pointsArray?.[0] || ''),
      arrivalPoint: checkString(pointsArray?.[1] || '')
    }
  })()
  

  const [departurePoint, setDeparturePoint] = useState<string>(initialPoints.departurePoint)
  const [departurePointData, setDeparturePointData] = useState<string[]>([])
  const [arrivalPoint, setArrivalPoint] = useState<string>('')
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([])
  const [distance, setDistance] = useState<string>('от 10 км')
  const [time, setTime] = useState<string>('1 ч')
  const [price, setPrice] = useState<string>('от — руб.')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setOrderModalData } = useContext(ModalContext)

  const handleClickSwapAddress = () => {
    setDeparturePoint(arrivalPoint)
    setArrivalPoint(departurePoint)
    setDeparturePointData(arrivalPointData)
    setArrivalPointData(departurePointData)
  }

  const handleChangeDeparturePoint = (value: string) => {
    setDeparturePoint(value)
  }

  const handleSearchDeparturePoint = async (value: string) => {
    console.log("Searching departure:", value);
    const response = await yandexMapsService.getSuggestions(value)
    console.log("Response:", response);
    const uniqueData = [...new Set(response)];
    setDeparturePointData(uniqueData)
  }

  const handleChangeArrivalPoint = (value: string) => {
    setArrivalPoint(value)
  }

  const handleSearchArrivalPoint = async (value: string) => {
    console.log("Searching arrival:", value);
    const response = await yandexMapsService.getSuggestions(value)
    console.log("Response:", response);
    const uniqueData = [...new Set(response)];
    setArrivalPointData(uniqueData)
  }

  const handleCalculate = async () => {
    if (!departurePoint || !arrivalPoint) {
      console.log("Missing departure or arrival point");
      message.error("Нет активной точки отправления или прибытия");
      return;
    }

    setIsLoading(true);

    try {
      if (routePanelRef.current) {
        routePanelRef.current.routePanel.state.set({
          from: departurePoint,
          to: arrivalPoint,
        });
      }

      setTimeout(async () => {
        try {
          if (routePanelRef.current) {
            const control = await routePanelRef.current.routePanel.getRouteAsync();
            if (control) {
              const activeRoute = control.getActiveRoute();
              if (activeRoute) {
                const distance = activeRoute.properties.get("distance");
                if (distance?.value) {
                  const distanceValue = Math.ceil((distance.value / 1000) / 10) * 10;
                  const convertHoursToRoundedTime = (hours: number): string => {
                    let totalMinutes = Math.ceil(hours * 60 / 30) * 30;
                    let totalHours = Math.floor(totalMinutes / 60);
                    let weeks = Math.floor(totalHours / (24 * 7));
                    let remainingHoursAfterWeeks = totalHours % (24 * 7);
                    let days = Math.floor(remainingHoursAfterWeeks / 24);
                    let roundedHours = remainingHoursAfterWeeks % 24;
                    let roundedMinutes = totalMinutes % 60;

                    let result = [];
                    if (weeks > 0) result.push(`${weeks} нед`);
                    if (days > 0) result.push(`${days} дн`);
                    if (roundedHours > 0) result.push(`${roundedHours} ч`);
                    if (roundedMinutes > 0) result.push(`${roundedMinutes} мин`);
                    return result.join(" ");
                  };

                  const getCoefficient = (distance: number) => {
                    if (distance < 100) return COEFFICIENT_100;
                    if (distance >= 100 && distance < 150) return COEFFICIENT_100_150;
                    if (distance >= 150 && distance < 200) return COEFFICIENT_150_200;
                    return COEFFICIENT_200;
                  };

                  const getPrice = () => {
                    const initialPrice = distanceValue * prices[selectedPlan] * getCoefficient(distanceValue);
                    return Math.ceil(initialPrice / 500) * 500;
                  };

                  const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);

                  setDistance(`${distanceValue} км`);
                  setTime(timeValue);
                  setPrice(`от ${getPrice()}р`);
                } else {
                  console.log("No distance data in activeRoute");
                  message.error("Нет активной точки отправления или прибытия");
                }
              } else {
                console.log("No active route available");
                message.error("Нет активной точки отправления или прибытия");
              }
            } else {
              console.log("Control is undefined");
              message.error("Нет активной точки отправления или прибытия");
            }
          } else {
            console.log("routePanelRef.current is undefined");
            message.error("Нет активной точки отправления или прибытия");
          }
        } catch (error) {
          console.error("Error calculating route:", error);
          message.error("Нет активной точки отправления или прибытия");
        } finally {
          setIsLoading(false);
        }
      }, 2000);

    } catch (error) {
      console.error("Error setting route:", error);
      message.error("Нет активной точки отправления или прибытия");
      setIsLoading(false);
    }
  };

  const infoData = [
    {
      id: 1,
      icon: <RoadIcon />,
      value: distance,
      description: 'Протяженность'
    },
    {
      id: 2,
      icon: <TimeIcon />,
      value: time,
      description: 'Время в пути'
    },
    {
      id: 3,
      icon: <WalletIcon />,
      value: price,
      description: 'Стоимость'
    }
  ]

  return (
    <div id="order" className={clsx(s.wrapper, { [s.military]: isMilitary })}>
      <div className={clsx(s.title, 'font-24-medium white-color')}>Укажите куда вам надо?</div>

      <div className={s.selection}>
        <div className={s.part}>
          <div className={clsx(s.label, 'font-16-normal white-color')}>Точка отправления<span className="orange-color">*</span></div>
          <SearchInput
            className='departure-select address-select'
            value={departurePoint}
            placeholder="Санкт-Петербург"
            data={departurePointData}
            handleChange={handleChangeDeparturePoint}
            handleSearch={handleSearchDeparturePoint}
          />
        </div>

        <div className={s.swapButtonWrapper}>
          <div
            onClick={handleClickSwapAddress}
            className={s.swapButton}>
            <SwapIcon />
          </div>
        </div>

        <div className={s.part}>
          <div className={clsx(s.label, 'font-16-normal white-color')}>Точка прибытия<span className="orange-color">*</span></div>
          <SearchInput
            className='arrival-select address-select'
            value={arrivalPoint}
            placeholder="Пенза"
            data={arrivalPointData}
            handleChange={handleChangeArrivalPoint}
            handleSearch={handleSearchArrivalPoint}
          />
        </div>
      </div>

      <div className={s.info}>
        {infoData.map(info => (
          <div key={info.id} className={s.card}>
            <div className={s.icon}>{info.icon}</div>
            <div className={s.content}>
              <div className={clsx(s.top, 'font-24-medium white-color')}>{info.value}</div>
              <div className={clsx(s.bottom, 'font-14-normal gray-color')}>{info.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.order}>
        <div className={s.buttons}>
          <Button
            disabled={!departurePoint || !arrivalPoint || isLoading}
            type={ButtonTypes.PRIMARY}
            text={isLoading ? "Рассчитывается..." : "Рассчитать поездку"}
            handleClick={handleCalculate} />
          <Button type={ButtonTypes.SECONDARY} text="Заказать поездку" handleClick={() => setOrderModalData({
            status: true,
            auto_class: selectedPlan,
            order_from: departurePoint,
            order_to: arrivalPoint,
            trip_price_from: price,
            block: Blocks.CALCULATOR
          })} />
        </div>

        <div className={clsx(s.warning, 'font-14-normal white-color')}>
          Расчеты носят информационно-справочный характер, нажмите Заказать, чтобы узнать точную стоимость. Нажимая на кнопку, вы соглашаетесь на <Link href='privacy-policy' className={clsx(s.policy, 'font-14-normal orange-color')}>обработку персональных данных</Link>.
        </div>
      </div>

      <YMaps query={{ apikey: getCurrentKey() }}>
        <Map
          style={{ display: 'none', height: 0 }}
          width={0}
          height={0}
          defaultState={{
            center: [55.751574, 37.573856],
            zoom: 9,
            controls: [],
          }}>
          <RoutePanel
            instanceRef={(ref: any) => {
              routePanelRef.current = ref;
              if (ref) {
                ref.routePanel.options.set({
                  visible: false,
                  float: 'none',
                  showHeader: false,
                  autoSelect: false,
                });
              }
            }}
            options={{
              visible: false,
              float: 'none',
              showHeader: false,
            }}
          />
        </Map>
      </YMaps>
    </div>
  )
}

export default AddressSelect;