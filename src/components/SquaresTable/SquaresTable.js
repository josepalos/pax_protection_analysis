import React from 'react';
import { max, scaleSqrt } from 'd3';

const SquaresTable = (props) => {
    const {
        title,
        data,
        rows,
        rowsName,
        columns,
        columnsName,
        minWidth = 10,
        maxWidth = 20
    } = props;

    const maxForRow = (row) => max(Object.values(row));

    var cellsScale = scaleSqrt()
        .domain([0, max(Object.values(data), maxForRow)])
        .range([minWidth, maxWidth]);

    const createCell = (row, col, i) => {
        const value = data[row][col];
        if(value === 0){
            return <td key={i}></td>
        }
        const size = cellsScale(value);
        return (
            <td key={i}>
                <svg width={size} height={size}>
                    <rect width={size} height={size}></rect>
                    <title>{value}</title>
                </svg>
            </td>
        );
    };

    const createRow = (row, i) => {
        return (
            <tr key={i}>
                <td key="row">
                    {row}
                </td>
                {columns.map( (col, i) => createCell(row, col, i) )}
            </tr>
        )
    };

    // TODO remove the border of the table and style
    return (
        <div>
            <h3>{title}</h3>
            <table border="1">
                <thead>
                    <tr>
                       <td></td> 
                       <td colSpan={columns.length}>{columnsName}</td>
                    </tr>
                    <tr>
                        <td>
                            {rowsName}
                        </td>
                        {columns.map( (header) => {
                            return <td key={header}>{header}</td>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(createRow)}
                </tbody>
            </table>
        </div>
    )
}

export default SquaresTable;