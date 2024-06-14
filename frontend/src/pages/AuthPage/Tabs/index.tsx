import styles from './Tabs.module.css';

type Props = {
  leftText: string;
  rightText: string;
  isLeftTabSelected: boolean;
  onTabSelect: (isLeft: boolean) => void;
  className?: string;
};

const Tabs = ({ leftText, rightText, isLeftTabSelected, onTabSelect, className = '' }: Props) => (
  <section className={`${styles.container} ${className}`}>
    <div className={styles.buttons_container}>
      <button className={styles.button} onClick={() => onTabSelect(true)}>
        {leftText}
      </button>
      <button className={styles.button} onClick={() => onTabSelect(false)}>
        {rightText}
      </button>
    </div>
    <div className={`${styles.slider} ${!isLeftTabSelected ? styles.right : ''}`}></div>
  </section>
);

export default Tabs;
