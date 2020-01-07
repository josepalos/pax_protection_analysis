import React from 'react';
import { max, scaleSqrt } from 'd3';
import styles from "./Tables.module.css";

const SquaresTable = (props) => {
    const {
        title,
        data,
        rowsName,
        columnsName,
        minArea,
        maxArea
    } = props;

    if(data === undefined || Object.entries(data).length === 0){
        return <p>Loading data</p>
    }

    const rows = Object.keys(data);
    const columns = Object.keys(data[rows[0]]);

    const maxForRow = (row) => max(Object.values(row));

    var cellsScale = scaleSqrt()
        .domain([0, max(Object.values(data), maxForRow)])
        .range([minArea, maxArea]);

    const createCell = (row, col, i) => {
        const value = data[row][col];
        if(value === 0){
            return <td key={i}/>
        }
        const size = cellsScale(value);
        return (
            <td key={i}>
                <svg width={size} height={size}>
                    <rect width={size} height={size}/>
                    <title>{value}</title>
                </svg>
            </td>
        );
    };

    const createRow = (row, i) => {
        return (
            <tr key={i} className={i % 2 === 0 ? styles.even_row : styles.odd_row}>
                <td className={styles.row_label}>
                    {row}
                </td>
                {columns.map( (col, i) => createCell(row, col, i) )}
            </tr>
        )
    };

    return (
        <div>
            <span className="chart-title">{title}</span>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-cell">
                        <table className={styles.content_table}>
                            <thead>
                            <tr>
                                <th colSpan={columns.length + 1}>{columnsName}</th>
                            </tr>
                            <tr>
                                <th>
                                    {rowsName}
                                </th>
                                {columns.map( (header) => {
                                    return <th key={header}>{header}</th>;
                                })}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map(createRow)}
                            </tbody>
                        </table>
                    </div>
                    <div className="div-table-cell">
                        LEGEND
                    </div>
                </div>
            </div>

        </div>
    )
};

export default SquaresTable;
