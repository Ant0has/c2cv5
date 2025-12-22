'use client';

import { RegionsContext } from "@/app/providers";
import { getPaginatedList } from "@/shared/services/get-paginated-list";
import { IRoute, IRouteData } from "@/shared/types/route.interface";
import { IRegion } from "@/shared/types/types";
import { Pagination } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useContext, useState } from "react";
import s from './Cities.module.scss';
import FilialAddressBlock from "@/shared/components/FilialAddressBlock/FilialAddressBlock";

interface IProps {
  routes?: IRoute[]
  routeData?: IRouteData  
}

const Cities: FC<IProps> = ({ routes, routeData }) => {
  const [page, setPage] = useState<number>(0);
  const regions = useContext(RegionsContext)
  const router = useRouter()

  const handleRegionClick = (region: IRegion | IRoute) => {
    router.push(`/${region.url}.html`)
  }

  if( routes?.length === 0 ) {
    return null;
  }



  return (
    <div className={clsx('container', s.container)}>
      <div className="title title-m-48">Другие города</div>

      <div className={s.slide}>
        {
          routes ? getPaginatedList(routes, page, 20).map((region) => (
            <Link
              href={`${region.url || ''}.html`}
              key={region.ID}
              className={clsx(s.region, 'font-16-medium')}
              onClick={() => handleRegionClick(region)}
              style={{ cursor: 'pointer' }}
            >
              {region?.title}
            </Link>
          )) : getPaginatedList(regions, page, 20).map((region) => (
            <Link
              href={`${region.url || ''}.html`}
              key={region.ID}
              className={clsx(s.region, 'font-16-medium')}
              onClick={() => handleRegionClick(region)}
              style={{ cursor: 'pointer' }}
            >
              {`Такси ${region?.meta_value}`}
            </Link>
          ))
        }

      </div>

      <Pagination
        align="center"
        pageSize={20}
        current={page + 1}
        defaultPageSize={20}
        defaultCurrent={1}
        total={routes ? routes.length : regions.length}
        onChange={(qqq) => setPage(qqq - 1)}
        hideOnSinglePage={true}
        showTitle={false}
      />

      <FilialAddressBlock routeData={routeData} />
    </div>
  )
}

export default Cities;