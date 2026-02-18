'use client'
import { ModalContext } from "@/app/providers";
import ArrowRightIcon from '@/public/icons/ArrowRightIcon';
import CheckIcon from '@/public/icons/CheckIcon';
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput";
import { useIsMobile } from "@/shared/hooks/useResize";
import { b2bGoals } from '@/shared/services/analytics.service';
import { Blocks } from "@/shared/types/enums";
import { Button, Input, Select } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FC, useContext, useState } from 'react';
import CalculatorBase from '../CalculatorBase';
import s from './BuzinessCalculator.module.scss';
import { weightOptions } from "@/shared/constants";



const inputStyle = {
  height: '56px',
  backgroundColor: '#383838',
  borderColor: '#383838',
  borderRadius: '16px',
  color: '#fff',
  caretColor: '#fff',
}

const autoCompleteStyle = { height: '56px', }

interface BuzinessCalculatorProps {
  selectedPlan: any;
  cityData?: string;
  routeData?: any;
  description?: string;
  buttonText?: string;
}

const BuzinessCalculator: FC<BuzinessCalculatorProps> = (props) => {
  const { setQuestionModalData } = useContext(ModalContext);
  const [isShowResult, setIsShowResult] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [weight, setWeight] = useState<string>(weightOptions[0].value);
  const isDostavkaGruzov = pathname.includes('dostavka-gruzov');

  const handleCalculate = (actions: any, state: any) => {
    b2bGoals.calcUsed(state.departurePoint, state.arrivalPoint);
    actions.handleCalculate();
    setIsShowResult(true);
  }

  const handleOrderClick = (state: any) => {
    setQuestionModalData({
      status: true,
      order_from: state.departurePoint,
      order_to: state.arrivalPoint,
      blockFrom: isDostavkaGruzov ? Blocks.DOSTAVKA_GRUZOV_CALCULATOR : Blocks.DLYA_BIZNESA_CALCULATOR,
      deliveryWeight: isDostavkaGruzov ? weight : undefined,
      price: state.price,
    });
  }

  return (
    <CalculatorBase {...props}>
      {({ state, actions, infoData }) => {
        console.log(state,'-----state-----');
        const gridTemplateColumns = isDostavkaGruzov ? '1fr 1fr 1fr 220px !important' : '1fr 1fr 190px !important';
        return (
          <div id="order" className={clsx(s.wrapper)} style={
            { maxWidth: isDostavkaGruzov ? '996px' : '792px' }}>
            <div className={s.top}>
              <h5 className={clsx('font-24-medium text-white')}>
                {props.description || 'Укажите куда вам надо?'}
              </h5>
              <div className={s.parts} style={{ gridTemplateColumns: gridTemplateColumns }}>
                <div className={s.part}>
                  <div className={clsx(s.label, 'font-16-normal text-white margin-b-8 ')}>
                    Точка отправления<span className="text-error"> *</span>
                  </div>
                  <SearchInput
                    value={state.departurePoint}
                    placeholder="Москва"
                    inputStyle={inputStyle}
                    autoCompleteStyle={autoCompleteStyle}
                    data={state.departurePointData}
                    isGrayPlaceholder={true}
                    handleChange={actions.handleChangeDeparturePoint}
                    handleSearch={actions.handleSearchDeparturePoint}
                  />
                </div>
                <div className={s.part}>
                  <div className={clsx(s.label, 'font-16-normal text-white margin-b-8 ')}>
                    Точка прибытия<span className="text-error"> *</span>
                  </div>
                  <SearchInput
                    value={state.arrivalPoint}
                    placeholder="Нижний Новгород"
                    inputStyle={inputStyle}
                    autoCompleteStyle={autoCompleteStyle}
                    data={state.arrivalPointData}
                    isGrayPlaceholder={true}
                    handleChange={actions.handleChangeArrivalPoint}
                    handleSearch={actions.handleSearchArrivalPoint}
                  />
                </div>
                {isDostavkaGruzov && (
                  <div className={s.part}>
                    <div className={clsx(s.label, 'font-16-normal text-white margin-b-8 ')}>
                      Вес груза
                    </div>
                    <Select 
                      options={weightOptions}
                      value={weight}
                      className={clsx(s.select)}
                      onChange={(value: string) => setWeight(value)}
                    />
                  </div>
                )}
                <Button
                  type="primary"
                  className={'h-56 bg-primary-important border-none border-transparent'}

                  disabled={state.isLoading || !state.departurePoint || !state.arrivalPoint}
                  onClick={() => handleCalculate(actions, state)}
                >
                  <div className='flex items-center gap-16 items-center'>
                    {state.isLoading && <><span className='font-18-medium text-white'>Рассчитывается...</span></>}
                    {!state.isLoading && <><span className='font-18-medium text-white'>{props.buttonText || 'Рассчитать'} <ArrowRightIcon /></span></>}
                  </div>
                </Button>
              </div>
              {
                isShowResult && (
                  <>
                    <div className={s.divider} />

                    <div className={clsx('flex', { 'flex-col': isMobile, 'flex-row': !isMobile })}>
                      <div className={s.infoItem}>
                        <div className={clsx(s.infoTitle, 'font-18-medium text-white flex items-center gap-8')}>
                          <span className='font-18-medium text-white'> {infoData[3]?.value || ''} </span>
                          <ArrowRightIcon fill='var(--white)' />
                          <span className='font-18-medium text-white'> {infoData[4]?.value || ''} </span>
                        </div>
                        <ul className={clsx(s.infoDescription, 'font-14-normal text-gray', s.infoDescriptionList)}>
                          <li className='font-14-normal text-gray'>{infoData[0]?.valueLabel || ''}</li>
                          <li className='font-14-normal text-gray'>{infoData[1]?.valueLabel || ''}</li>
                        </ul>
                      </div>
                      <div className={s.verticalDivider} />
                      <div className={s.infoItem}>
                        <div className={clsx(s.infoTitle, 'font-18-medium text-white')}>
                          <span className='font-18-medium text-white'> Автопарк: </span>
                        </div>
                        <div className={clsx(s.infoDescription, 'font-14-normal text-gray')}>
                          Ford Focus | Kia Cerato | Skoda Octavia
                        </div>
                      </div>
                    </div>
                  </>
                )
              }

            </div>
            {
              isShowResult && (
                <div className={s.result}>
                  <div className='flex flex-col gap-8'>
                    <div className='font-40-medium text-white'>
                      {infoData[2]?.valueLabel || 0}
                    </div>
                    <div className='font-14-normal flex flex-row gap-4 items-center'>
                      <Image src="/icons/PriceCheckIcon.svg" alt="price-check" width={14} height={12} />
                      <span className='font-14-normal text-white'>
                        Цена фиксированная
                      </span>
                    </div>
                  </div>
                  <div className={clsx('flex', { 'width-full flex-col-reverse gap-16': isMobile, 'flex-row items-center gap-8': !isMobile })}>
                    <Button className='width-full h-56'
                      onClick={() => handleOrderClick(state)}
                    >
                      <CheckIcon fill='var(--dark)' />
                      <span className='font-18-normal'>Забронировать</span>
                    </Button>
                  </div>
                </div>
              )
            }

          </div>
        )
      }}
    </CalculatorBase>
  );
};

export default BuzinessCalculator;