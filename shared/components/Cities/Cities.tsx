'use client';

import { FC, useContext, useState } from "react";
import s from './Cities.module.scss'
import { IRegion } from "@/shared/types/types";
import { Pagination } from "antd";
import { getPaginatedList } from "@/shared/services/get-paginated-list";
import clsx from "clsx";
import { RegionsContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { IRoute } from "@/shared/types/route.interface";

interface IProps {
  routes?: IRoute[]
}

const Cities: FC<IProps> = ({ routes }) => {
  const [page, setPage] = useState<number>(0);
  const regions = useContext(RegionsContext)
  const router = useRouter()

  const handleRegionClick = (region: IRegion | IRoute) => {
    router.push(`/${region.url}`)
  }

  return (
    <div className="container-40">
      <div className="title title-m-48">Другие города</div>

      <div className={s.slide}>
        {
          routes ? getPaginatedList(routes, page, 10).map((region) => (
            <div
              key={region.ID}
              className={clsx(s.region, 'font-16-medium')}
              onClick={() => handleRegionClick(region)}
              style={{ cursor: 'pointer' }}
            >
              {region?.title}
            </div>
          )) : getPaginatedList(regions, page, 10).map((region) => (
            <div
              key={region.ID}
              className={clsx(s.region, 'font-16-medium')}
              onClick={() => handleRegionClick(region)}
              style={{ cursor: 'pointer' }}
            >
              {`Такси ${region?.meta_value}`}
            </div>
          ))
        }

      </div>

      <Pagination
        align="center"
        pageSize={10}
        current={page + 1}
        defaultPageSize={10}
        defaultCurrent={1}
        total={routes ? routes.length : regions.length}
        onChange={(qqq) => setPage(qqq - 1)}
        hideOnSinglePage={true}
        showTitle={false}
      />
    </div>
  )
}

export default Cities;