import Header from '../components/Header';
import Table from '../components/Table';
import Pie from './Pie';
import styles from './StatisticsPage.module.css';

const style = getComputedStyle(document.body);

const StatisticsPage = () => {
  return (
    <>
      <Header text="Статистика за сегодня" />
      <section className={styles.today_container}>
        <div>
          <p className={styles.info_title}>Прибыль: 3450 руб.</p>
          <p className={styles.info_title}>Доставлено заказов: 4</p>
          <p className={styles.info_title}>Средний чек: 1203</p>
          <div className={styles.charts}>
            <Pie
              title="Количество курьеров на смене"
              data={[
                { label: 'на смене', value: 33, backgroundColor: style.getPropertyValue('--color-primary') },
                { label: 'не на смене', value: 2, backgroundColor: style.getPropertyValue('--color-error') },
              ]}
            />
            <Pie
              title="Доставки в срок"
              data={[
                { label: 'в срок', value: 105, backgroundColor: style.getPropertyValue('--color-primary') },
                { label: 'с опозданием', value: 31, backgroundColor: style.getPropertyValue('--color-error') },
              ]}
            />
          </div>
        </div>
        <div className={styles.table_container}>
          <h3>Топ курьеров по количеству выполненных заказов</h3>
          <Table
            withoutSelect
            headers={['ID', 'ФИО', 'Номер телефона', 'Количество заказов']}
            data={[['4', 'Попов Арсений Иванович', '+71234567890', '42']]}
          />
        </div>
      </section>
      <Header text="Статистика за текущий месяц (июнь)" />
      <section className={styles.month_container}>
        <p className={styles.info_title}>Прибыль: 51234 руб.</p>
        <p className={styles.info_title}>Доставлено заказов: 46</p>
        <p className={styles.info_title}>Средний чек: 2503</p>
      </section>
    </>
  );
};

export default StatisticsPage;
