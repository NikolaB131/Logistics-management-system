import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import { isOrdersLoadingSelector } from '../../redux/slices/orders/selectors';
import { deleteOrder, fetchOrders as fetchOrdersThunk } from '../../redux/slices/orders/thunks';
import { OrderGet, OrderItem } from '../../redux/slices/orders/types';
import { useAppDispatch } from '../../redux/utils';
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table, { TableHandle } from '../components/Table';
import CreateModal from './CreateModal';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
  const dispatch = useAppDispatch();

  const isOrdersLoading = useSelector(isOrdersLoadingSelector);

  const tableRef = useRef<TableHandle>(null);
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [orders, setOrders] = useState<OrderGet[]>([]);
  const [visibleOrders, setVisibleOrders] = useState<OrderGet[]>([]);
  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchOrders = async () => {
    const orders = await dispatch(fetchOrdersThunk()).unwrap();
    setOrders(orders);
    setVisibleOrders(orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchFieldValue === '') {
      setVisibleOrders(orders);
    } else {
      const temp: OrderGet[] = [];
      for (const order of orders) {
        let isContains = false;
        for (const value of Object.values(order)) {
          if (value.toString().includes(searchFieldValue)) {
            isContains = true;
            break;
          }
        }
        if (isContains) {
          temp.push(order);
        }
      }
      setVisibleOrders(temp);
    }
  }, [searchFieldValue]);

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  const onDelete = () => {
    const selected = tableRef.current?.getSelectedIDs();
    selected?.forEach(id => dispatch(deleteOrder(+id)));
    setTimeout(fetchOrders, 300);
  };

  const convertStatus = (status: string) => {
    switch (status) {
      case 'not_ready':
        return 'Не готов';
      case 'ready':
        return 'Готов к выдаче курьеру';
      case 'in_delivery':
        return 'В доставке';
      case 'done':
        return 'Завершен';
    }
    return '-';
  };

  const convertItems = (items: OrderItem[]) => {

  }

  return (
    <>
      <Header text="Заказы" />
      <div className={styles.container}>
        <section className={styles.top_section}>
          <Button onClick={() => setIsCreateModalVisible(true)}>Создать</Button>
          <Button className={styles.edit_button} onClick={() => setIsEditModalVisible(true)} mode="mode2">
            <img src={penSvg} />
            Редактировать
          </Button>
          <Button onClick={() => {}} mode="mode2">
            Назначить курьера
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
        {isOrdersLoading ? (
          <p className={styles.loading_text}>Загрузка...</p>
        ) : (
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
            data={visibleOrders.map<string[]>(order => [
              order.id.toString(),
              order.items.toString(),
              order.client_id.toString(),
              order.deliver_to,
              order.address_from,
              order.address_to,
              order.notes || '-',
              order.courier_id.toString(),
              convertStatus(order.status),
              order.created_at + '\n' + (order.delivered_at ?? ''),
              (order.total_cost - order.delivery_cost).toString(),
              order.total_cost.toString(),
            ])}
          />
        )}
      </div>
      {isEditModalVisible && (
        <Modal onClose={() => setIsEditModalVisible(false)}>
          <h1>lol</h1>
        </Modal>
      )}
      {isCreateModalVisible && (
        <CreateModal onClose={() => setIsCreateModalVisible(false)} onAdd={() => setTimeout(fetchOrders, 300)} />
      )}
    </>
  );
};

export default OrdersPage;
