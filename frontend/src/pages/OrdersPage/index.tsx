import { useRef, useState } from 'react';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table, { TableHandle } from '../components/Table';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
  const tableRef = useRef<TableHandle>(null);
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  return (
    <>
      <Header text="Заказы" />
      <div className={styles.container}>
        <section className={styles.top_section}>
          <Button onClick={() => {}}>Создать</Button>
          <Button className={styles.edit_button} onClick={() => setIsEditModalVisible(true)} mode="mode2">
            <img src={penSvg} />
            Редактировать
          </Button>
          <Button onClick={() => {}} mode="mode2">
            Назначить курьера
          </Button>
          <Button onClick={() => {}} mode="mode3">
            Удалить выбранные
          </Button>
          <Button className={styles.filter_button} mode="mode2" onClick={() => {}}>
            <img src={triangleSvg} />
            Фильтры
          </Button>
          <TextInput
            ref={searchFieldRef}
            value={searchFieldValue}
            onChange={e => setSearchFieldValue(e.target.value)}
            placeholder="Поиск"
            containerClassName={styles.search_input}
          />
          <Button onClick={onSearchFieldClear} mode="mode2">
            Очистить
          </Button>
        </section>
        <Table
          ref={tableRef}
          headers={[
            'ID',
            'Состав заказа',
            'ID клиента',
            'Дата и время доставки',
            'Адрес отправки',
            'Адрес доставки',
            'Примечания',
            'ID курьера',
            'Статус',
            'Дата и время создания и завершения заказа',
            'Сумма заказа',
            'Стоимость доставки',
            'Итого',
          ]}
          data={[
            [
              '1',
              'Картошка\xa0-\xa01',
              '23',
              '10/12/2023 10:31',
              'lol',
              'lal',
              '-',
              '45',
              'Готов',
              '10/12/2023 10:33',
              '405',
              '407',
              '812',
            ],
            [
              '32',
              'Картошка\xa0-\xa01',
              '23',
              '10/12/2023 10:31',
              'lol',
              'lal',
              '-',
              '45',
              'Готов',
              '10/12/2023 10:33',
              '405',
              '407',
              '812',
            ],
          ]}
        />
      </div>
      {isEditModalVisible && (
        <Modal onClose={() => setIsEditModalVisible(false)}>
          <h1>lol</h1>
        </Modal>
      )}
    </>
  );
};

export default OrdersPage;
