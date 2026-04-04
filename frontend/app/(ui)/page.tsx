import styles from './page.module.scss';
import AppTopBar from './components/AppTopBar/index';

export default function Home() {
  return (
    <div className={styles.page}>
      <AppTopBar />
    </div>
  );
}
