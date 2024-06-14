import { useRef, useState } from 'react';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import Button from '../../shared/Button';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table from '../components/Table';
import styles from './Warehouse.module.css';

const WarehousePage = () => {
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [searchFieldValue, setSearchFieldValue] = useState('');

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  return (
    <>
      <Header text="Склад" />
      <div className={styles.container}>
        {' '}
        <section className={styles.top_section}>
          <Button onClick={() => {}}>Добавить</Button>
          <Button className={styles.edit_button} onClick={() => {}} mode="mode2">
            <img src={penSvg} />
            Редактировать
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
          headers={['ID', 'Наименование', 'Количество', 'Цена за единицу товара', 'Дата последней поставки']}
          data={[['1', 'Картошка', '34', '120р', '10/12/3054']]}
        />
      </div>
    </>
  );
};

export default WarehousePage;
