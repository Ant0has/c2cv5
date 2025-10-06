import { UAParser } from "ua-parser-js";
import { IMailRequest } from "../types/types";


class MailService {
  private BASE_URL = 'https://city2city.ru/api'


  // Получаем информацию об устройстве
  private getDeviceInfo(req?: Request): string {
    let userAgent: string;

    if (typeof window !== 'undefined') {
      // Клиентский код (браузер)
      userAgent = window.navigator.userAgent;
    } else if (req?.headers) {
      // Серверный код (SSR) — получаем User-Agent из заголовков
      userAgent = req.headers.get('user-agent') || '';
    } else {
      // Если ничего не передано, возвращаем Unknown
      return 'Unknown OS, Unknown Browser';
    }

    const parser = new UAParser(userAgent);
    const { os, browser } = parser.getResult();

    return `${os.name} ${os.version}, ${browser.name} ${browser.version}`;
  }

  async sendMail(payload: IMailRequest) {
    const requestBody = {
      ...payload,
      device_info: this.getDeviceInfo(),
    };

    try {
      const response = await fetch(`${this.BASE_URL}/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        next: { revalidate: 0 } // Не кэшируем POST-запросы
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send mail');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const mailService = new MailService()