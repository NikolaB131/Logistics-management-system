import { useState } from 'react';

import { createClient } from '../../../redux/slices/clients/thunks';
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

  const [nameInputValue, setNameInputValue] = useState('');
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState('');
  const [notesInputValue, setNotesInputValue] = useState('');

  const onButtonClick = () => {
    dispatch(createClient({ name: nameInputValue, phone_number: phoneNumberInputValue, notes: notesInputValue }));
    onAdd?.();
    onClose?.();
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <TextInput
          containerClassName={styles.input}
          value={nameInputValue}
          onChange={e => setNameInputValue(e.target.value)}
          placeholder="ФИО"
        />
        <TextInput
          containerClassName={styles.input}
          value={phoneNumberInputValue}
          onChange={e => setPhoneNumberInputValue(e.target.value)}
          placeholder="Номер телефона (необязательно)"
        />
        <TextInput
          containerClassName={styles.input}
          value={notesInputValue}
          onChange={e => setNotesInputValue(e.target.value)}
          placeholder="Примечания (необязательно)"
        />
        <Button onClick={onButtonClick}>Добавить</Button>
      </div>
    </Modal>
  );
};

export default AddModal;
