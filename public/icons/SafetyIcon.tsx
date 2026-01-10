import { FC } from 'react';
import { IconProps } from '@/shared/types/types';


const SafetyIcon: FC<IconProps> = ({ fill = '#FEFEFE' , className }) => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M11.2969 0C11.4844 0 11.7188 0.09375 11.9062 0.140625L20.7188 3.89062C21.75 4.35938 22.5469 5.34375 22.5469 6.5625C22.5 11.25 20.5781 19.7344 12.5156 23.625C11.7188 24 10.8281 24 10.0312 23.625C1.96875 19.7344 0.046875 11.25 0 6.5625C0 5.34375 0.796875 4.35938 1.82812 3.89062L10.6406 0.140625C10.8281 0.09375 11.0625 0 11.2969 0Z" fill={fill} />
        </svg>

    )
}

export default SafetyIcon;