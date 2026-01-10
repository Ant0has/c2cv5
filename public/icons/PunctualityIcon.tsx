import { FC } from "react";
import { IconProps } from "@/shared/types/types";

const PunctualityIcon: FC<IconProps> = ({ fill = '#FEFEFE' , className }) => {
    return (
        <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M21 10.5C21 16.3125 16.2656 21 10.5 21C4.6875 21 0 16.3125 0 10.5C0 4.73438 4.6875 0 10.5 0C16.2656 0 21 4.73438 21 10.5ZM9.375 5.625V10.5C9.375 10.8281 9.46875 11.1094 9.70312 11.2969L11.9531 13.5469C12.375 14.0156 13.0781 14.0156 13.5 13.5469C13.9688 13.125 13.9688 12.4219 13.5 11.9531L11.625 10.0781V5.625C11.625 5.01562 11.1094 4.5 10.5 4.5C9.84375 4.5 9.375 5.01562 9.375 5.625ZM10.5 22.5C15 22.5 18.9375 20.0156 21 16.3125V21.75C21 23.0156 19.9688 24 18.75 24H2.25C0.984375 24 0 23.0156 0 21.75V16.3125C2.01562 20.0156 5.95312 22.5 10.5 22.5Z" fill={fill} />
        </svg>
    )
}

export default PunctualityIcon;