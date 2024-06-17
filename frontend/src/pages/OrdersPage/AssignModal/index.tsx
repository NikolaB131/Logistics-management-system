import { useState } from 'react';

import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import TextInput from '../../../shared/TextInput';
import styles from './AssignModal.module.css';

type Props = {
  onClose?: () => void;
  onButtonClick?: (courierID: number) => void;
};

const AssignModal = ({ onClose, onButtonClick }: Props) => {
  const [courierIDValue, setCourierIDValue] = useState('');

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <TextInput
          containerClassName={styles.input}
          value={courierIDValue}
          onChange={e => setCourierIDValue(e.target.value)}
          placeholder="ID курьера"
        />
        <Button
          onClick={() => {
            onButtonClick?.(+courierIDValue);
            onClose?.();
          }}
        >
          Создать заказ
        </Button>
      </div>
    </Modal>
  );
};

export default AssignModal;
