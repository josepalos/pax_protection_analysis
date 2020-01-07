import React, {createRef, useEffect} from 'react';
import { select, max, scaleSqrt } from 'd3';
import styles from "./Tables.module.css";

const sizeLegend = (selection, props) => {
    const {
        scale,
        spacing,
        numTicks,
        textOffset,
        legendWidth
    } = props;

    const ticks = scale.ticks(numTicks)
        .filter(d => d !== 0)
        .reverse();

    selection.append("rect")
        .attr("class", "background-rect")
        .attr("rx", 10)
        .attr("width", legendWidth)
        .attr("height", ticks.length * spacing + 10);

    const groups = selection.selectAll(".legend-items").data(ticks);
    const groupsEnter = groups
        .enter().append("g")
        .attr("class", "legend-items");
    groupsEnter
        .merge(groups)
        .attr("transform", (d, i) => `translate(10, ${(i+.5) * spacing })`);
    groups.exit().remove();

    groupsEnter.append("rect")
        .attr("class", styles.content_rect)
        .merge(groups.select(styles.content_rect))
        .attr("height", scale)
        .attr("width", scale);

    groupsEnter.append("text")
        .merge(groups.select("text"))
        .text(d => d)
        .attr("dy", ".32em")
        .attr("y", "10")
        .attr("x", d => scale(d) + textOffset);
};

const SquaresTable = (props) => {
    const {
        title,
        data,
        rowsName,
        columnsName,
        minArea,
        maxArea
    } = props;

    const legendRef = createRef();
    const maxForRow = (row) => max(Object.values(row));
    const cellsScale = scaleSqrt()
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
                    <rect width={size} height={size} className={styles.content_rect}/>
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

    useEffect( () => {
        if(legendRef.current !== null) {
            select(legendRef.current)
                .call(sizeLegend, {
                    scale: cellsScale,
                    spacing: 30,
                    numTicks: 5,
                    textOffset: 10,
                    legendWidth: 100
                });
        }
    });

    if(data === undefined || Object.entries(data).length === 0){
        return <p>Loading data</p>
    }

    const rows = Object.keys(data);
    const columns = Object.keys(data[rows[0]]);

    return (
        <div>
            <div className="chart-title">
                {title}
            </div>
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
                        <svg ref={legendRef}
                            className="legend"
                            width={150}
                            height={200}>
                        </svg>
                    </div>
                </div>
            </div>

        </div>
    )
};

export default SquaresTable;
