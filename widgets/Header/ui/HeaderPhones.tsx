import PhoneIcon from '@/public/icons/PhoneIcon';
import { PHONE_NUMBER_FIRST } from '@/shared/constants';
import Link from 'next/link';

const HeaderPhones = () => {
    return (
        <div>
            <Link target='_blank' href={`tel:+${PHONE_NUMBER_FIRST}`}>
                <PhoneIcon />
            </Link>
        </div>
    );
}

export default HeaderPhones;
