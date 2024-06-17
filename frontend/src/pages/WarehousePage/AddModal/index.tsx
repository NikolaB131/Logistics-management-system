import { useState } from 'react';

import { createItem } from '../../../redux/slices/warehouse/thunks';
import { useAppDispatch } from '../../../redux/utils';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import TextInput from '../../../shared/TextInput';
import styles from './AddModal.module.css';

type Props = {
  onClose?: () => void;
  onAdd?: () => void;
};

const AddModal = ({ onClose, onAdd }: Props) => {
  const dispatch = useAppDispatch();

  const [nameValue, setNameValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [costValue, setCostValue] = useState('');
  const [lastSupplyDateValue, setLastSupplyDateValue] = useState('');

  const onButtonClick = () => {
    dispatch(
      createItem({
        name: nameValue,
        quantity: +quantityValue,
        cost: +costValue,
        last_supply_date: lastSupplyDateValue || undefined,
      }),
    );
    onAdd?.();
    onClose?.();
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <TextInput
          containerClassName={styles.input}
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
          placeholder="Наименование"
        />
        <TextInput
          containerClassName={styles.input}
          value={quantityValue}
          onChange={e => setQuantityValue(e.target.value)}
          placeholder="Количество"
        />
        <TextInput
          containerClassName={styles.input}
          value={costValue}
          onChange={e => setCostValue(e.target.value)}
          placeholder="Цена за единицу товара"
        />
        <TextInput
          containerClassName={styles.input}
          value={lastSupplyDateValue}
          onChange={e => setLastSupplyDateValue(e.target.value)}
          placeholder="Дата последней поставки (необязательно)"
        />
        <Button onClick={onButtonClick}>Добавить</Button>
      </div>
    </Modal>
  );
};

export default AddModal;
