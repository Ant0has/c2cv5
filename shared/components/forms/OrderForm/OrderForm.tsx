import { ButtonTypes } from "@/shared/types/enums";
import { DatePicker, Form, Input, Radio } from "antd";
import ru_RU from 'antd/es/date-picker/locale/ru_RU';
import TextArea from "antd/es/input/TextArea";
import 'dayjs/locale/ru';
import { FC } from "react";
import Button from "../../ui/Button/Button";
import s from './OrderForm.module.scss';

interface IProps {
 title?:unknown;
}

interface IProps {
  buttonText?: string
  className?: string
  type?: string
}

const OrderForm: FC<IProps> = () => {
  return (
    <Form
      name="orrdeForm"
      layout="vertical"
      onFinish={() => undefined}
      onFinishFailed={() => undefined}
      // style={{ maxWidth: 485 }}
      requiredMark={false}
    // className={className}
    >
      <Form.Item
        label={<span className="font-14-normal">Введите ваше ФИО<span className="font-14-normal orange-color" >*</span></span>}
        name="fullName1"
        rules={[
          {
            required: true,
            message: <span className="font-14-normal orange-color">Пожалуйста, введите ваше полное имя</span>
          },
        ]}
      >
        <Input placeholder="Ваше имя" />
      </Form.Item>

      <Form.Item
        label={<span className="font-14-normal">Ваш номер телефона<span className="font-14-normal orange-color" >*</span></span>}
        name="phoneNumber1"
        rules={[
          {
            required: true,
            message: <span className="font-14-normal orange-color">Пожалуйста, введите ваш номер телефона</span>
          },
          {
            pattern: /^[0-9+()]+$/,
            message: <span className="font-14-normal orange-color">Введите корректный номер телефона</span>
          },
        ]}
      >
        <Input
          placeholder="Номер телефона" />
      </Form.Item>

      <Form.Item
        label={<span className="font-14-normal">Тип поездки<span className="font-14-normal orange-color" >*</span></span>}
        name="type1"
        rules={[
          {
            required: true,
            message: <span className="font-14-normal orange-color">Пожалуйста, введите тип поездки</span>
          }
        ]}
      >
        <Radio.Group
          options={[
            { value: 'now', label: 'Сейчас' },
            { value: 'preOrder', label: 'Предзаказ' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-14-normal">Дата поездки<span className="font-14-normal orange-color" >*</span></span>}
        name="date1"
        rules={[
          {
            required: true,
            message: <span className="font-14-normal orange-color">Пожалуйста, введите дату поездки</span>
          }
        ]}
      >
        <DatePicker
          format={'DD.MM.YYYY : HH.mm'}
          locale={ru_RU}
          showTime={{
            showSecond: false
          }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-14-normal">Дополнительная информация</span>}
        name="info1"
      >
        <TextArea
          placeholder="Укажите дополнительную информацию - Адресс выезда, Количество пассажиров, Номер рейса, Дети до 7 лет и другие особенности поездки"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <div className={s.bottom}>
        <Button type={ButtonTypes.PRIMARY} text={'Заказать поездку'} />
        <p className="font-14-normal">Нажимая на кнопку, вы соглашаетесь на обработку <a className="font-14-normal orange-color" href="orange-color">персональных данных</a></p>
      </div>
    </Form>
  )
}

export default OrderForm;