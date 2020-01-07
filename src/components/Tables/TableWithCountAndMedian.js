import React from "react";
import styles from "./Tables.module.css";

const TableWithCountAndMedian = (props) => {
    const {
        title,
        countData,
        medianData
    } = props;

    if (countData === undefined || Object.entries(countData).length === 0 ||
        medianData === undefined || Object.entries(medianData).length === 0) {
        return <p>Loading data</p>
    }

    const rows = Object.keys(countData);
    const columns = Object.keys(countData[rows[0]]);
    const dataPerCell = 2;

    const createCells = (row, col) => [
        <td key={col + "count"}>
            {countData[row][col]}
        </td>,
        <td key={col + "median"}>
            ({medianData[row][col]})
        </td>
    ];

    const createRow = (row, i) => (
        <tr key={row} className={i % 2 === 0 ? styles.even_row : styles.odd_row}>
            <td className={styles.row_label}>
                {row}
            </td>
            {columns.map(col => createCells(row, col))}
        </tr>
    );

    return (
        <div>
            <div className="chart-title">
                {title}
            </div>
            <table className={styles.content_table}>
                <thead>
                <tr>
                    <th colSpan={columns.length * dataPerCell + 1}># grups protegits (mediana)</th>
                </tr>
                <tr>
                    <th/>
                    {columns.map((d, i) => <th key={i} colSpan={dataPerCell}>{d}</th>)}
                </tr>
                </thead>
                <tbody>
                {rows.map(createRow)}
                </tbody>
            </table>
        </div>
    );
};

export default TableWithCountAndMedian;
