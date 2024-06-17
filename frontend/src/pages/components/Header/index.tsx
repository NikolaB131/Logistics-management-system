import styles from './Header.module.css';

type Props = {
  text: string;
  className?: HTMLDivElement['className'];
};

const Header = ({ text, className = '' }: Props) => (
  <div className={`${styles.container} ${className}`}>
    <h1>{text}</h1>
  </div>
);

export default Header;
