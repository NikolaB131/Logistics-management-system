import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import penSvg from '../../assets/pen_with_black_box.svg';
import triangleSvg from '../../assets/triangle.svg';
import { isClientsLoadingSelector } from '../../redux/slices/clients/selectors';
import { deleteClient, fetchClients as fetchClientsThunk } from '../../redux/slices/clients/thunks';
import { ClientGet } from '../../redux/slices/clients/types';
import { useAppDispatch } from '../../redux/utils';
import Button from '../../shared/Button';
import TextInput, { TextInputHandle } from '../../shared/TextInput';
import Header from '../components/Header';
import Table, { TableHandle } from '../components/Table';
import AddModal from './AddModal';
import styles from './ClientsPage.module.css';

const ClientsPage = () => {
  const dispatch = useAppDispatch();

  const isClientsLoading = useSelector(isClientsLoadingSelector);

  const tableRef = useRef<TableHandle>(null);
  const searchFieldRef = useRef<TextInputHandle>(null);

  const [clients, setClients] = useState<ClientGet[]>([]);
  const [visibleClients, setVisibleClients] = useState<ClientGet[]>([]);
  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const fetchClients = async () => {
    const clients = await dispatch(fetchClientsThunk()).unwrap();
    setClients(clients);
    setVisibleClients(clients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchFieldValue === '') {
      setVisibleClients(clients);
    } else {
      const temp: ClientGet[] = [];
      for (const client of clients) {
        let isContains = false;
        for (const value of Object.values(client)) {
          if (value.toString().includes(searchFieldValue)) {
            isContains = true;
            break;
          }
        }
        if (isContains) {
          temp.push(client);
        }
      }
      setVisibleClients(temp);
    }
  }, [searchFieldValue]);

  const onSearchFieldClear = () => {
    setSearchFieldValue('');
    searchFieldRef.current?.focus();
  };

  const onDelete = () => {
    const selected = tableRef.current?.getSelectedIDs();
    selected?.forEach(id => dispatch(deleteClient(+id)));
    setTimeout(fetchClients, 300);
  };

  return (
    <>
      <Header text="Клиенты" />
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
        {isClientsLoading ? (
          <p className={styles.loading_text}>Загрузка...</p>
        ) : (
          <Table
            ref={tableRef}
            headers={['ID', 'ФИО', 'Номер телефона', 'Примечания']}
            data={visibleClients.map<string[]>(client => [
              client.id.toString(),
              client.name,
              client.phone_number || '-',
              client.notes || '-',
            ])}
          />
        )}
      </div>
      {isAddModalVisible && (
        <AddModal onClose={() => setIsAddModalVisible(false)} onAdd={() => setTimeout(fetchClients, 300)} />
      )}
    </>
  );
};

export default ClientsPage;
