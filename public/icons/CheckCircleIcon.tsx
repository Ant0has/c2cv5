import { IconProps } from "@/shared/types/types";

interface Props extends IconProps{
    circleFill?: string;
    rectFill?: string;
}

const CheckCircleIcon = ({ circleFill = '#FF9C00', rectFill = '#FEFEFE', className }: Props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="12" cy="12" r="12" fill={circleFill} />
            <rect width="1.8184" height="10.9104" rx="0.909201" transform="matrix(-0.707156 -0.707057 0.707156 -0.707057 10.2852 16)" fill={rectFill} />
            <rect width="1.8184" height="6.06134" rx="0.909201" transform="matrix(0.707156 -0.707057 0.707156 0.707057 6 11.7144)" fill={rectFill} />
        </svg>

    )
}

export default CheckCircleIcon;