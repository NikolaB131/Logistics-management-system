import { useState } from 'react';

import { createCourier } from '../../../redux/slices/couriers/thunks';
import { useAppDispatch } from '../../../redux/utils';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import TextInput from '../../../shared/TextInput';
import styles from './AddModal.module.css';
import { addToMap } from '../../../redux/slices/couriers';

type Props = {
  onClose?: () => void;
  onAdd?: () => void;
};

const AddModal = ({ onClose, onAdd }: Props) => {
  const dispatch = useAppDispatch();

  const [nameValue, setNameValue] = useState('');
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [carNumberValue, setCarNumberValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  const getRandom = (max: number, min: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const onButtonClick = () => {
    dispatch(
      createCourier({
        name: nameValue,
        phone_number: phoneNumberValue,
        car_number: carNumberValue,
        notes: notesValue,
      }),
    );
    dispatch(addToMap({ name: nameValue, geo: [getRandom(55.8, 55.6), getRandom(37.8, 37.4)]}))
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
          placeholder="ФИО"
        />
        <TextInput
          containerClassName={styles.input}
          value={phoneNumberValue}
          onChange={e => setPhoneNumberValue(e.target.value)}
          placeholder="Номер телефона (необязательно)"
        />
        <TextInput
          containerClassName={styles.input}
          value={carNumberValue}
          onChange={e => setCarNumberValue(e.target.value)}
          placeholder="Номер автомобиля (необязательно)"
        />
        <TextInput
          containerClassName={styles.input}
          value={notesValue}
          onChange={e => setNotesValue(e.target.value)}
          placeholder="Примечания (необязательно)"
        />
        <Button onClick={onButtonClick}>Добавить</Button>
      </div>
    </Modal>
  );
};

export default AddModal;
