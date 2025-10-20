'use client'

import ForBusiness from "@/pages-list/home/ui/ForBusiness/ForBusiness";
import TeamWork from "@/shared/components/TeamWork/TeamWork";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  title?: unknown;
}

const Team: FC<IProps> = () => {

  return (
    <>
      <div className="container">
        <div className='breadcrumbs'>
          <Link href='/'>
            Главная
          </Link>
          <span>—</span>
          <span className="gray-color">Наша команда</span>
        </div>

        <div className="title title-m-32">Работа команды</div>

        <TeamWork />
      </div>
      <ForBusiness />
    </>
  )
}

export default Team;