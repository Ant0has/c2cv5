import { Button } from 'antd';
import Link from 'next/link';
import cn from 'classnames';
import styles from './NotFound.module.scss';
import Image from 'next/image';

export const NotFoundPage = () => {
  return (
    <div className={cn(styles.container)}>
      {/* Header */}
      {/* Main Content */}
      <main className={cn(styles.main, 'app-main container')}>
        <div className={styles.content}>

          <h1 className={cn(styles.title, 'font-56-medium')}>Страница не найдена</h1>

          <Image src={'/images/404.png'} alt="Страница не найдена" width={500} height={400} />

          {/* CTA Buttons */}
          <div className={cn(styles.buttons, 'margin-b-24-16')}>
            <Link href="/">
              <Button
                type="primary"
                size="large"
              >
                Вернуться на главную
              </Button>
            </Link>
          </div>

        </div>
      </main>


    </div>
  );
};

export default NotFoundPage;