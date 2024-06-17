import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import { isWarehouseLoadingSelector } from '../../redux/slices/warehouse/selectors';
import { deleteItem, fetchItems as fetchItemsThunk } from '../../redux/slices/warehouse/thunks';
import { ItemGet } from '../../redux/slices/warehouse/types';
import { useAppDispatch } from '../../redux/utils';
import Button from '../../shared/Button';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table, { TableHandle } from '../components/Table';
import AddModal from './AddModal';
import styles from './Warehouse.module.css';

const WarehousePage = () => {
  const dispatch = useAppDispatch();

  const isWarehouseLoading = useSelector(isWarehouseLoadingSelector);

  const tableRef = useRef<TableHandle>(null);
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [items, setItems] = useState<ItemGet[]>([]);
  const [visibleItems, setVisibleItems] = useState<ItemGet[]>([]);
  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const fetchItems = async () => {
    const items = await dispatch(fetchItemsThunk()).unwrap();
    setItems(items);
    setVisibleItems(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchFieldValue === '') {
      setVisibleItems(items);
    } else {
      const temp: ItemGet[] = [];
      for (const item of items) {
        let isContains = false;
        for (const value of Object.values(item)) {
          if (value && value.toString().includes(searchFieldValue)) {
            isContains = true;
            break;
          }
        }
        if (isContains) {
          temp.push(item);
        }
      }
      setVisibleItems(temp);
    }
  }, [searchFieldValue]);

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  const onDelete = () => {
    const selected = tableRef.current?.getSelectedIDs();
    selected?.forEach(id => dispatch(deleteItem(+id)));
    setTimeout(fetchItems, 300);
  };

  return (
    <>
      <Header text="Склад" />
      <div className={styles.container}>
        {' '}
        <section className={styles.top_section}>
          <Button onClick={() => setIsAddModalVisible(true)}>Добавить</Button>
          <Button className={styles.edit_button} onClick={() => {}} mode="mode2">
            <img src={penSvg} />
            Редактировать
          </Button>
          <Button onClick={onDelete} mode="mode3">
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
        {isWarehouseLoading ? (
          <p className={styles.loading_text}>Загрузка...</p>
        ) : (
          <Table
            ref={tableRef}
            headers={['ID', 'Наименование', 'Количество', 'Цена за единицу товара', 'Дата последней поставки']}
            data={visibleItems.map<string[]>(item => [
              item.id.toString(),
              item.name,
              item.quantity.toString(),
              item.cost.toString(),
              item.last_supply_date || '-',
            ])}
          />
        )}
      </div>
      {isAddModalVisible && (
        <AddModal onClose={() => setIsAddModalVisible(false)} onAdd={() => setTimeout(fetchItems, 300)} />
      )}
    </>
  );
};

export default WarehousePage;
