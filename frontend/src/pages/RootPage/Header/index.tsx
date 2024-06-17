import { NavLink } from 'react-router-dom';

import exitSvg from '../../../assets/exit.svg';
import gearSvg from '../../../assets/gear.svg';
import profileSvg from '../../../assets/profile.svg';
import { logout } from '../../../redux/slices/auth';
import { useAppDispatch } from '../../../redux/utils';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useAppDispatch();

  return (
    <header className={styles.container}>
      <NavLink className={styles.button} to={'/profile'}>
        <img src={profileSvg} />
        <span>Профиль</span>
      </NavLink>
      <button className={styles.button}>
        <img src={gearSvg} />
        <span>Настройки</span>
      </button>
      <button className={styles.button} onClick={() => dispatch(logout())}>
        <img src={exitSvg} />
        <span>Выйти</span>
      </button>
    </header>
  );
};

export default Header;
