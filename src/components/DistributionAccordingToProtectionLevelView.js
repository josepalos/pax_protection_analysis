import React from "react";
import {max} from 'd3';

import SquaresTable from "./SquaresTable/SquaresTable";
import VerticalGroupedBarChart from "./VerticalBarChart/VerticalGroupedBarChart";
import {countAgreementsBy} from "./DataLoadAndTransform";

const tableData = [
    ["Government/territory",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n: 5, median: 5,},
        {n: 4, median: 4}],
    ["Government",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n: 5, median: 5,},
        {n: 4, median: 4}],
    ["Inter-group",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n: 5, median: 5,},
        {n: 4, median: 4}],
    ["Other",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n: 5, median: 5,},
        {n: 4, median: 4}],
    ["Territory",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n: 5, median: 5,},
        {n: 4, median: 4}]
];

function aggregateAgreementsProtections(agreements, attribute) {
    const attributesIf = {
        "Rhetorical": d => d[attribute] === 1,
        "Provisions": d => d[attribute] === 2,
        "Substantive provisions": d => d[attribute] === 3
    };

    const p = countAgreementsBy(agreements, d => d.Year, attributesIf);
    const data = {};
    p.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });

    const columns = Object.keys(attributesIf);
    const rows = Object.keys(data);
    return {data, columns, rows};
}

const DistributionAccordingToProtectionLevelView = ({agreements}) => {
    const {data, columns, rows} = aggregateAgreementsProtections(agreements, "GCh");

    const attrs = ["rhetoricalCount", "antiDiscriminationCount",
        "substantiveCount", "otherProtectionsCount"];

    const count = attrs.map(
        (attr) => {
            const count = countAgreementsBy(agreements, d => d[attr])
                .filter((d) => d.key !== 0);
            count.forEach((d) => d.attr = attr);
            return count;
        })
        .flat();
    console.log(count);

    const innerDivStyle = {
        display: "table-cell",
        verticalAlign: "top",
    };
    return (
        <div style={{display: "table"}}>
            <div style={{display: "table-row"}}>
                <div style={innerDivStyle}>
                    <SquaresTable
                        title={"Quantitat d'acords que estableixen els diferents nivells de protecció pels nens cada any"}
                        data={data}
                        rows={rows}
                        rowsName="Any de signatura"
                        columns={columns}
                        columnsName="Children/Youth"
                        minArea={0}
                        maxArea={20}
                    />
                </div>

                <div style={innerDivStyle}>
                    <VerticalGroupedBarChart
                        title="Quantitat de grups protegits segons el nivell i acord"
                        width="800"
                        height="500"
                        margin={{top: 50, right: 200, bottom: 80, left: 70}}
                        data={count}
                        xValue={group => group.key}
                        xLabel="Número de grups protegits"
                        yValue={group => group.count}
                        yLabel="Número d'acords"
                        groupBy={group => group.attr}
                        groupByAbbreviation={{
                            "rhetoricalCount": "R",
                            "antiDiscriminationCount": "D",
                            "substantiveCount": "S",
                            "otherProtectionCount": "O"
                        }}
                    />
                </div>

                <div style={innerDivStyle}>
                    <table>
                        <thead>
                        <tr>
                            <td/>
                            <td colSpan={4}># grups protegits (mediana)</td>
                        </tr>
                        <tr>
                            <td>retòricament</td>
                            <td>discriminació</td>
                            <td>substancialment</td>
                            <td>altres</td>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((row) => {
                            const data = [...row];
                            const rowName = data.shift();

                            return (<tr key={rowName}>
                                <td>{rowName}</td>
                                {data.map((d, i) => <td key={i}>{d.n} ({d.median})</td>)}
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>)
};

export default DistributionAccordingToProtectionLevelView;
