import crossSvg from '../../assets/cross.svg';
import styles from './Modal.module.css';

type Props = {
  children: React.ReactNode;
  className?: HTMLElement['className'];
  onClose?: () => void;
};

const Modal = ({ children, className = '', onClose }: Props) => (
  <div className={styles.container} onClick={onClose}>
    <section className={`${styles.modal} ${className}`} onClick={e => e.stopPropagation()}>
      <div className={styles.close_button_container}>
        <button className={styles.close_button} onClick={onClose}>
          <img src={crossSvg} />
        </button>
      </div>
      {children}
    </section>
  </div>
);

export default Modal;
