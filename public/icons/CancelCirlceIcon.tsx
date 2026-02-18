import { IconProps } from "@/shared/types/types";

interface Props extends IconProps{
    circleFill?: string;
    rectFill?: string;

}

const CancelCirlceIcon = ({ circleFill = '#383838', rectFill = '#999999', className }: Props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="12" fill={circleFill}/>
        <rect width="2.02016" height="12.121" rx="1.01008" transform="matrix(-0.707156 -0.707057 0.707156 -0.707057 8.42969 16.9985)" fill={rectFill}/>
        <rect width="2.02016" height="12.121" rx="1.01008" transform="matrix(-0.707107 0.707107 -0.707007 -0.707206 16.9961 15.5718)" fill={rectFill}/>
        </svg>
        
    )
}

export default CancelCirlceIcon;