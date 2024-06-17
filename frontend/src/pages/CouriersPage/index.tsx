import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import { isCouriersLoadingSelector } from '../../redux/slices/couriers/selectors';
import { deleteCourier, fetchCouriers as fetchCouriersThunk } from '../../redux/slices/couriers/thunks';
import { CourierGet } from '../../redux/slices/couriers/types';
import { useAppDispatch } from '../../redux/utils';
import Button from '../../shared/Button';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table, { TableHandle } from '../components/Table';
import AddModal from './AddModal';
import styles from './CouriersPage.module.css';
import Map from './Map';

const CouriersPage = () => {
  const dispatch = useAppDispatch();

  const isCouriersLoading = useSelector(isCouriersLoadingSelector);

  const tableRef = useRef<TableHandle>(null);
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [couriers, setCouriers] = useState<CourierGet[]>([]);
  const [visibleCouriers, setVisibleCouriers] = useState<CourierGet[]>([]);
  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const fetchCouriers = async () => {
    const orders = await dispatch(fetchCouriersThunk()).unwrap();
    setCouriers(orders);
    setVisibleCouriers(orders);
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  useEffect(() => {
    if (searchFieldValue === '') {
      setVisibleCouriers(couriers);
    } else {
      const temp: CourierGet[] = [];
      for (const order of couriers) {
        let isContains = false;
        for (const value of Object.values(order)) {
          if (value && value.toString().includes(searchFieldValue)) {
            isContains = true;
            break;
          }
        }
        if (isContains) {
          temp.push(order);
        }
      }
      setVisibleCouriers(temp);
    }
  }, [searchFieldValue]);

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  const onDelete = () => {
    const selected = tableRef.current?.getSelectedIDs();
    selected?.forEach(id => dispatch(deleteCourier(+id)));
    setTimeout(fetchCouriers, 300);
  };

  const convertStatus = (status: string) => {
    switch (status) {
      case 'free':
        return 'Свободен';
      case 'busy':
        return 'Занят';
    }
    return '-';
  };

  return (
    <>
      <Header text="Курьеры" />
      <div className={styles.container}>
        <section className={styles.top_section}>
          <Button onClick={() => setIsAddModalVisible(true)}>Добавить</Button>
          <Button className={styles.edit_button} onClick={() => {}} mode="mode2">
            <img src={penSvg} />
            Редактировать
          </Button>
          <Button onClick={onDelete} mode="mode3">
            Удалить выбранных
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
        <section className={styles.content}>
          {isCouriersLoading ? (
            <p className={styles.loading_text}>Загрузка...</p>
          ) : (
            <Table
              ref={tableRef}
              className={styles.table}
              headers={['ID', 'ФИО', 'Номер телефона', 'Номер автомобиля', 'Статус', 'Примечания']}
              data={visibleCouriers.map<string[]>(courier => [
                courier.id.toString(),
                courier.name,
                courier.phone_number || '-',
                courier.car_number || '-',
                convertStatus(courier.status),
                courier.notes || '-',
              ])}
            />
          )}
          <div className={styles.map}>
            <Map />
          </div>
        </section>
      </div>
      {isAddModalVisible && (
        <AddModal onClose={() => setIsAddModalVisible(false)} onAdd={() => setTimeout(fetchCouriers, 300)} />
      )}
    </>
  );
};

export default CouriersPage;
