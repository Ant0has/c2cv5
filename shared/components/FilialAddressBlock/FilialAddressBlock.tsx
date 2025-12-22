import { FC } from "react";
import { filialAddressesData } from "@/shared/data/filial-addresses.data";
import { IRouteData } from "@/shared/types/route.interface";
import clsx from "clsx";
import s from "./FilialAddressBlock.module.scss";

interface IProps {
  routeData?: IRouteData;
  className?: string;
}

const FilialAddressBlock: FC<IProps> = ({ routeData, className }) => {
    const regionId = routeData?.regions_data?.ID;

    if( !routeData || regionId !== routeData?.regions_data?.ID ) {
        return null;
    }

    const addressData = filialAddressesData.find(item => item.regionId === regionId);

    if( !addressData ) {
        return null;
    }

  return (
    <section className={`${className || ''}`}>
      <div className={clsx('container', s.container)}>
        <h2 className={clsx('sub-title',s.title)}>
          Наш филиал: {addressData?.address}
        </h2>
      </div>
    </section>
  );
};

export default FilialAddressBlock;