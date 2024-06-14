import Header from '../components/Header';
import styles from './Profile.module.css';

const ProfilePage = () => (
  <>
    <Header text="Профиль" />
    <section className={styles.container}>
      <p>Почта:</p>
      <p>Роль в системе:</p>
    </section>
  </>
);

export default ProfilePage;
