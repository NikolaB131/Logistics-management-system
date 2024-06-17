import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie as PieChart } from 'react-chartjs-2';

import styles from './Pie.module.css';

type Props = {
  title: string;
  data: {
    label: string;
    value: number;
    backgroundColor: string;
  }[];
  className?: HTMLDivElement['className'];
};

ChartJS.register(ChartDataLabels, ArcElement, Tooltip, Legend);

const Pie = ({ title, data, className = '' }: Props) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>{title}</h3>
      <PieChart
        options={{
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                const dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  if (typeof data === 'number') {
                    sum += data;
                  }
                });
                const percentage = ((value * 100) / sum).toFixed(2) + '%';
                return percentage;
              },
              font: { family: 'Inter', size: 16 },
              color: '#FFF',
            },
          },
        }}
        data={{
          datasets: [
            {
              data: data.map(el => el.value),
              backgroundColor: data.map(el => el.backgroundColor),
            },
          ],
        }}
      />
      {data.map((el, i) => (
        <div key={i} className={styles.label}>
          <div style={{ backgroundColor: el.backgroundColor }}></div>
          <span>
            {el.value}&nbsp;-&nbsp;{el.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Pie;
