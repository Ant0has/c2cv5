import s from './BusinessInfoBlock.module.scss'

interface Props {
  content: string
}

const BusinessInfoBlock = ({ content }: Props) => {
  return (
    <div className={s.wrapper}>
      <div className="container">
        <div
          className={s.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export default BusinessInfoBlock
