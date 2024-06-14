import styles from './Button.module.css';

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  className?: HTMLButtonElement['className'];
  mode?: 'mode1' | 'mode2' | 'mode3';
};

const Button = ({ onClick, children, className = '', mode = 'mode1' }: Props) => (
  <button className={`${styles.button} ${styles[mode]} ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
