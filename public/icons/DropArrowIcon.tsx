import { FC } from "react";
import { IconProps } from "@/shared/types/types";

const DropArrowIcon: FC<IconProps> = ({ fill = '#FF9C00', width = 14, height = 8, className }) => {   
    return (
        <svg width={width} height={height} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.01821 8C6.69051 8 6.39922 7.89274 6.18075 7.67821L0.355007 1.95754C-0.118336 1.52849 -0.118336 0.777654 0.355007 0.348603C0.791938 -0.116201 1.55657 -0.116201 1.9935 0.348603L7.01821 5.24693L12.0065 0.348603C12.4434 -0.116201 13.2081 -0.116201 13.645 0.348603C14.1183 0.777654 14.1183 1.52849 13.645 1.95754L7.81925 7.67821C7.60078 7.89274 7.30949 8 7.01821 8Z" fill={fill}/>
        </svg>
    )
}

export default DropArrowIcon;