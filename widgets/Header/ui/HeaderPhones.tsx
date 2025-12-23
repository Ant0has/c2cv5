import PhoneIcon from '@/public/icons/PhoneIcon';
import Link from 'next/link';
import s from '../Header.module.scss';
import { requisitsData } from '@/shared/data/requisits.data';

const HeaderPhones = () => {
    return (
        <div className={s.phones}>
            <Link target='_blank' href={`tel:+${requisitsData.PHONE}`}>
                <PhoneIcon />
            </Link>
        </div>
    );
}

export default HeaderPhones;
