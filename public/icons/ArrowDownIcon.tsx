import { FC } from "react";
import { IconProps } from "@/shared/types/types";

const ArrowDownIcon: FC<IconProps> = ({ fill = '#FEFEFE',width = 19, height = 21, className }) => {   
    return (
        <svg width={width} height={height} viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M17.7014 12.375L9.8264 20.625C9.59203 20.8594 9.31078 20.9531 9.02953 20.9531C8.7014 20.9531 8.42015 20.8594 8.18578 20.625L0.310778 12.375C-0.111097 11.9062 -0.111097 11.2031 0.357653 10.7812C0.779528 10.3594 1.52953 10.3594 1.9514 10.8281L7.90453 17.0625V1.125C7.90453 0.46875 8.37328 0 8.98265 0C9.54515 0 10.1545 0.46875 10.1545 1.125V17.0625L16.0608 10.8281C16.4827 10.3594 17.2327 10.3594 17.6545 10.7812C18.1233 11.2031 18.1233 11.9062 17.7014 12.375Z" fill={fill || '#FF9C00'}/>
</svg>
    )
}

export default ArrowDownIcon;
