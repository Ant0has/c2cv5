// components/AddressSelect/AddressSelectBase.tsx
import { FC, ReactNode } from 'react';
import { useCalculator, ICalculatorProps, ICalculatorState, ICalculatorActions, IInfoDataItem } from '../hooks/use-calculator';
import { getCurrentKey } from "@/shared/services/get-current-key";
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";

interface CalculatorBaseProps extends ICalculatorProps {
    children: (props: {
        state: ICalculatorState;
        actions: ICalculatorActions;
        infoData: IInfoDataItem[];
        selectedPlan: Prices;
        routeData?: IRouteData;
        routePanelRef: React.MutableRefObject<unknown>;
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
                        instanceRef={(ref: unknown) => {
                            if (ref) {
                                routePanelRef.current = ref;
                                // Yandex Maps API не имеет типов — используем type assertion
                                const panel = ref as { routePanel: { options: { set: (opts: Record<string, unknown>) => void } } };
                                panel.routePanel.options.set({
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