import { useSelector } from 'react-redux';

import { authEmailSelector, authRoleSelector } from '../../redux/slices/auth/selectors';
import Header from '../components/Header';
import styles from './Profile.module.css';

const ProfilePage = () => {
  const email = useSelector(authEmailSelector);
  const role = useSelector(authRoleSelector);

  return (
    <>
      <Header text="Профиль" />
      <section className={styles.container}>
        <p>Почта: {email}</p>
        <p>Роль в системе: {role}</p>
      </section>
    </>
  );
};

export default ProfilePage;
