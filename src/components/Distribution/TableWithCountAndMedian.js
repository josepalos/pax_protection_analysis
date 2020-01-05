import React from "react";

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

    // TODO remove border
    return (
        <table border={1}>
            <thead>
            <tr>
                <td/>
                <td colSpan={columns.length * dataPerCell}># grups protegits (mediana)</td>
            </tr>
            <tr>
                <td/>
                {columns.map((d, i) => <td key={i} colSpan={dataPerCell}>{d}</td>)}
            </tr>
            </thead>
            <tbody>
            {rows.map((row) =>
                <tr key={row}>
                    <td>
                        {row}
                    </td>
                    {columns.map((col) => [
                        <td key={col + "count"}>
                            {countData[row][col]}
                        </td>,
                        <td key={col+"median"}>
                            ({medianData[row][col]})
                        </td>
                    ])}
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableWithCountAndMedian;
