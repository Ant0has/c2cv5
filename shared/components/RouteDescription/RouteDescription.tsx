import { FC } from "react";
interface IProps {
  title?: string
  text: string
}

const RouteDescription: FC<IProps> = ({ title, text }) => {

  return (
    <div className="container-40">
      <div className="title title-m-32">
        Маршрут <span>{title}</span>
      </div>
      <div className='default-tag' dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
}

export default RouteDescription;
