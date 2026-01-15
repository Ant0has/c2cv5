// components/AddressSelect/AddressSelectBase.tsx
import { FC, ReactNode } from 'react';
import { useCalculator, ICalculatorProps } from '../hooks/use-calculator';
import { getCurrentKey } from "@/shared/services/get-current-key";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";

interface CalculatorBaseProps extends ICalculatorProps {
    children: (props: {
        state: any;
        actions: any;
        infoData: any;
        selectedPlan: any;
        routeData: any;
        routePanelRef: any;
    }) => ReactNode;
}

const CalculatorBase: FC<CalculatorBaseProps> = ({
    children,
    selectedPlan,
    cityData,
    routeData,
}) => {
    const {
        state,
        actions,
        infoData,
        selectedPlan: plan,
        routeData: route,
        routePanelRef,
    } = useCalculator({ selectedPlan, cityData, routeData });

    return (
        <>
            {children({
                state,
                actions,
                infoData,
                selectedPlan: plan,
                routeData: route,
                routePanelRef,
            })}

            {/* Карта остается здесь, так как она нужна для логики */}
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
                            if (ref) {
                                routePanelRef.current = ref;
                            }
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
        </>
    );
};

export default CalculatorBase;