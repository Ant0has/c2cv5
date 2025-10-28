'use client'

import ForBusiness from "@/pages-list/home/ui/ForBusiness/ForBusiness";
import TeamWork from "@/shared/components/TeamWork/TeamWork";
import Breadcrumbs from "@/shared/components/Breadcrumbs/Breadcrumbs";
import { FC } from "react";

interface IProps {
  title?: unknown;
}

const Team: FC<IProps> = () => {

  return (
    <>
      <div className="container">
        <Breadcrumbs />
        <div className="title title-m-32">Работа команды</div>
        <TeamWork />
      </div>
      <ForBusiness />
    </>
  )
}

export default Team;