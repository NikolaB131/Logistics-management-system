import { forwardRef, useImperativeHandle, useRef } from 'react';

import styles from './Table.module.css';

type Props = {
  headers: string[];
  data: string[][];
  className?: HTMLTableElement['className'];
  withoutSelect?: boolean;
};

export type TableHandle = {
  getSelectedIDs: () => string[];
};

const Table = forwardRef<TableHandle, Props>(function Table(
  { headers, data, className = '', withoutSelect = false },
  ref,
) {
  useImperativeHandle(ref, () => ({
    getSelectedIDs() {
      const res: string[] = [];
      checksRefs.current.forEach(el => {
        const id = el?.getAttribute('data-id');
        if (el?.checked && id) {
          res.push(id);
        }
      });
      return res;
    },
  }));

  const checksRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <table className={`${styles.table} ${className}`}>
      <thead>
        <tr>
          {!withoutSelect && (
            <th>
              <input
                type="checkbox"
                onClick={e => checksRefs.current.forEach(el => el && (el.checked = e.currentTarget.checked))}
              />
            </th>
          )}
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row[0]}>
            {!withoutSelect && (
              <td>
                <input ref={el => (checksRefs.current[i] = el)} type="checkbox" data-id={row[0]} />
              </td>
            )}
            {row.map((value, j) => (
              <td key={j}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Table;
