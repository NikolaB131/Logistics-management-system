import { useState } from 'react';

import { createOrder } from '../../../redux/slices/orders/thunks';
import { OrderItemPost } from '../../../redux/slices/orders/types';
import { useAppDispatch } from '../../../redux/utils';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import TextArea from '../../../shared/TextArea';
import TextInput from '../../../shared/TextInput';
import styles from './CreateModal.module.css';

type Props = {
  onClose?: () => void;
  onAdd?: () => void;
};

const AddModal = ({ onClose, onAdd }: Props) => {
  const dispatch = useAppDispatch();

  const [clientIDValue, setClientIDValue] = useState('');
  const [addressFromValue, setAddressFromValue] = useState('');
  const [addressToValue, setAddressToValue] = useState('');
  const [deliverToValue, setDeliverToValue] = useState('');
  const [itemsValue, setItemsValue] = useState('');
  const [deliveryCostValue, setDeliveryCostValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  const onButtonClick = () => {
    const rows = itemsValue.split('\n');
    const items: OrderItemPost[] = [];
    for (const row of rows) {
      const temp = row.split(':');
      items.push({ id: +temp[0], quantity: +temp[1] });
    }
    dispatch(
      createOrder({
        client_id: +clientIDValue,
        address_from: addressFromValue,
        address_to: addressToValue,
        deliver_to: deliverToValue,
        items,
        delivery_cost: +deliveryCostValue,
        notes: notesValue,
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
          value={clientIDValue}
          onChange={e => setClientIDValue(e.target.value)}
          placeholder="ID клиента"
        />
        <TextInput
          containerClassName={styles.input}
          value={addressFromValue}
          onChange={e => setAddressFromValue(e.target.value)}
          placeholder="Адрес отправки"
        />
        <TextInput
          containerClassName={styles.input}
          value={addressToValue}
          onChange={e => setAddressToValue(e.target.value)}
          placeholder="Адрес доставки"
        />
        <TextInput
          containerClassName={styles.input}
          value={deliverToValue}
          onChange={e => setDeliverToValue(e.target.value)}
          placeholder="Дата и время доставки"
        />
        <TextInput
          containerClassName={styles.input}
          value={deliveryCostValue}
          onChange={e => setDeliveryCostValue(e.target.value)}
          placeholder="Стоимость доставки"
        />
        <TextArea
          containerClassName={styles.input}
          value={itemsValue}
          onChange={e => setItemsValue(e.target.value)}
          placeholder="Товары"
        />
        <TextInput
          containerClassName={styles.input}
          value={notesValue}
          onChange={e => setNotesValue(e.target.value)}
          placeholder="Примечания (необязательно)"
        />
        <Button onClick={onButtonClick}>Создать заказ</Button>
      </div>
    </Modal>
  );
};

export default AddModal;
