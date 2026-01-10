import s from './DlyaBiznesaInstruction.module.scss';
import { instructionList } from '../../utils/data';

const DlyaBiznesaInstruction = () => {
    return (
        <div className={s.wrapper}>
            <div className={'container'}>
                <h2 className="title text-center text-white">Как это <span className="text-primary">работает</span></h2>
                <p className="font-18-medium text-dark-secondary margin-t-16 text-center">Простой и прозрачный процесс сотрудничества</p>
                <ul className={s.instructionList}>
                    {instructionList.map((item, index) => (
                        <li className={s.instructionItem}>
                            <h3 className="font-24-medium text-white">{item.title}</h3>
                            <p className="font-18-medium text-dark-secondary margin-t-16">{item.description}</p>

                            <div className={s.instructionItemIcon}>{`0${index + 1}`}</div>
                            <div className={s.grillEffect}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DlyaBiznesaInstruction;