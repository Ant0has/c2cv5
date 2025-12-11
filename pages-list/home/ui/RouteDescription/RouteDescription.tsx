import { FC } from "react";
import s from './RouteDescription.module.scss';
import { YandexShare } from "@/feature/YandexShare";

interface IProps {
  title?: string
  text: string
}

const RouteDescription: FC<IProps> = ({ title, text }) => {

  return (
    <div className="container-40">
      <div className="title title-m-32">
        Маршрут <span>{ title?.replace(',', ' в ')}</span>
      </div>
        <div className={s.description} dangerouslySetInnerHTML={{ __html: text }} />
      <YandexShare url={window.location.href} title={title} description={text} />
    </div>
  )
}

export default RouteDescription;
