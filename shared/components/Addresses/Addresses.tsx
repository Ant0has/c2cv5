import { FC } from "react";
import s from "./Addresses.module.scss";

import { filialAddressesData } from "@/shared/data/filial-addresses.data";
import Image from "next/image";

interface IProps {
  title?: unknown;
}

const Addresses: FC<IProps> = () => {

  return (
    <div className={s.grid}>
      {filialAddressesData.map((address) => (
        <div key={address.id} className={s.cell}>
          <h4 className="font-24-medium">{address.address}</h4>
          <div className={s.image}>
            <Image
              width={528}
              height={358}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 528px"
              src={address.map}
              alt={address.address}
              layout="responsive"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Addresses;
