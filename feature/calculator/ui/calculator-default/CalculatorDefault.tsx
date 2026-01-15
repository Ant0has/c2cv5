import { FC, useContext } from 'react';
import CalculatorBase from '../CalculatorBase';
import { ModalContext } from "@/app/providers";
import RoadIcon from "@/public/icons/RoadIcon";
import TimeIcon from "@/public/icons/TimeIcon";
import WalletIcon from "@/public/icons/WalletIcon";
import SwapIcon from "@/public/icons/SwapIcon";
import { ButtonTypes, Blocks } from "@/shared/types/enums";
import Button from "@/shared/components/ui/Button/Button";
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput";
import Link from "next/link";
import clsx from 'clsx';
import s from './CalculatorDefault.module.scss';

interface AddressSelectDefaultProps {
  selectedPlan: any;
  cityData?: string;
  routeData?: any;
}

const AddressSelectDefault: FC<AddressSelectDefaultProps> = (props) => {
  const { setOrderModalData } = useContext(ModalContext);

  return (
    <CalculatorBase {...props}>
      {({ state, actions, infoData, selectedPlan }) => (
        <div id="order" className={clsx(s.wrapper, { [s.military]: props.routeData?.is_svo === 1 })}>
          <div className={clsx(s.title, 'font-24-medium text-white')}>
            Укажите куда вам надо?
          </div>

          <div className={s.selection}>
            <div className={s.part}>
              <div className={clsx(s.label, 'font-16-normal text-white')}>
                Точка отправления<span className="text-primary">*</span>
              </div>
              <SearchInput
                className='departure-select address-select'
                value={state.departurePoint}
                placeholder="Санкт-Петербург"
                data={state.departurePointData}
                handleChange={actions.handleChangeDeparturePoint}
                handleSearch={actions.handleSearchDeparturePoint}
              />
            </div>

            <div className={s.swapButtonWrapper}>
              <div onClick={actions.handleClickSwapAddress} className={s.swapButton}>
                <SwapIcon />
              </div>
            </div>

            <div className={s.part}>
              <div className={clsx(s.label, 'font-16-normal text-white')}>
                Точка прибытия<span className="text-primary">*</span>
              </div>
              <SearchInput
                className='arrival-select address-select'
                value={state.arrivalPoint}
                placeholder="Пенза"
                data={state.arrivalPointData}
                handleChange={actions.handleChangeArrivalPoint}
                handleSearch={actions.handleSearchArrivalPoint}
              />
            </div>
          </div>

          <div className={s.info}>
            {infoData.slice(0, 3).map((info: any) => (
              <div key={info.id} className={s.card}>
                <div className={s.icon}>
                  {info.icon === 'road' && <RoadIcon />}
                  {info.icon === 'time' && <TimeIcon />}
                  {info.icon === 'wallet' && <WalletIcon />}
                </div>
                <div className={s.content}>
                  <div className={clsx(s.top, 'font-24-medium text-white')}>
                    {info.valueLabel}
                  </div>
                  <div className={clsx(s.bottom, 'font-14-normal text-gray')}>
                    {info.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.order}>
            <div className={s.buttons}>
              <Button
                disabled={!state.departurePoint || !state.arrivalPoint || state.isLoading}
                type={ButtonTypes.PRIMARY}
                text={state.isLoading ? "Рассчитывается..." : "Рассчитать поездку"}
                handleClick={actions.handleCalculate}
              />
              <Button
                type={ButtonTypes.SECONDARY}
                text="Заказать поездку"
                handleClick={() => setOrderModalData({
                  status: true,
                  auto_class: selectedPlan,
                  order_from: state.departurePoint,
                  order_to: state.arrivalPoint,
                  trip_price_from: state.price,
                  block: Blocks.CALCULATOR,
                })}
              />
            </div>

            <div className={clsx(s.warning, 'font-14-normal text-white')}>
              Расчеты носят информационно-справочный характер, нажмите Заказать, чтобы узнать точную стоимость. 
              Нажимая на кнопку, вы соглашаетесь на{' '}
              <Link href='privacy-policy' className={clsx(s.policy, 'font-14-normal text-primary')}>
                обработку персональных данных
              </Link>.
            </div>
          </div>
        </div>
      )}
    </CalculatorBase>
  );
};

export default AddressSelectDefault;