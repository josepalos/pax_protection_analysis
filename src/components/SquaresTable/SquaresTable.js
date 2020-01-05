import React from 'react';
import { max, scaleSqrt } from 'd3';

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
