import { FC, ReactNode } from 'react';
import { useCalculator, ICalculatorProps, ICalculatorState, ICalculatorActions, IInfoDataItem } from '../hooks/use-calculator';
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";

interface CalculatorBaseProps extends ICalculatorProps {
    children: (props: {
        state: ICalculatorState;
        actions: ICalculatorActions;
        infoData: IInfoDataItem[];
        selectedPlan: Prices;
        routeData?: IRouteData;
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
    } = useCalculator({ selectedPlan, cityData, routeData });

    return (
        <>
            {children({
                state,
                actions,
                infoData,
                selectedPlan: plan,
                routeData: route,
            })}
        </>
    );
};

export default CalculatorBase;
