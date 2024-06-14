import { NavLink, NavLinkProps } from 'react-router-dom';

import styles from './Navbar.module.css';

const Navbar = () => {
  const navLinkClassName: NavLinkProps['className'] = ({ isActive }) => (isActive ? styles.active : '');

  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        <li>
          <NavLink className={navLinkClassName} to="/orders">
            Заказы
          </NavLink>
        </li>
        <li>
          <NavLink className={navLinkClassName} to="/clients">
            Клиенты
          </NavLink>
        </li>
        <li>
          <NavLink className={navLinkClassName} to="/couriers">
            Курьеры
          </NavLink>
        </li>
        <li>
          <NavLink className={navLinkClassName} to="/warehouse">
            Склад
          </NavLink>
        </li>
        <li>
          <NavLink className={navLinkClassName} to="/statistics">
            Статистика
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
