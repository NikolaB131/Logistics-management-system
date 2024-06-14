import { Outlet } from 'react-router-dom';

import Header from './Header';
import Navbar from './Navbar';
import styles from './RootPage.module.css';

const RootPage = () => (
  <div className={styles.wrapper}>
    <Navbar />
    <div className={styles.content}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default RootPage;
