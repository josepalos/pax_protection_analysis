import React from "react";
import SquaresTable from "./SquaresTable/SquaresTable";
import VerticalGroupedBarChart from "./VerticalBarChart/VerticalGroupedBarChart";

const tableData = [
    ["Government/territory",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n:  5, median: 5,},
        {n:  4, median: 4}],
    ["Government",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n:  5, median: 5,},
        {n:  4, median: 4}],
    ["Inter-group",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n:  5, median: 5,},
        {n:  4, median: 4}],
    ["Other",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n:  5, median: 5,},
        {n:  4, median: 4}],
    ["Territory",
        {n: 13, median: 2},
        {n: 20, median: 1},
        {n:  5, median: 5,},
        {n:  4, median: 4}]
];

const DistributionAccordingToProtectionLevelView = ({protectionLevels, agreementsGrouped}) => (
    <div>
        <SquaresTable
            title={"Quantitat d'acords que estableixen els diferents nivells de protecció pels nens cada any"}
            data={protectionLevels}
            rows={[1990, 1991, 1992]}
            rowsName="Any de signatura"
            columns={[
                "Retòrica",
                "Provisions",
                "Provisions substantives"
            ]}
            columnsName="Children/Youth"
        />
        <hr/>
        <VerticalGroupedBarChart
            title="Quantitat de grups protegits segons el nivell i acord"
            width="800"
            height="500"
            margin={{top: 50, right: 200, bottom: 80, left: 70}}
            data={agreementsGrouped}
            xValue={group => group.x}
            xLabel="Número de grups protegits"
            yValue={group => group.y}
            yLabel="Número d'acords"
            groupBy={group => group.g}
            groupByAbbreviation={{
                "Retòrica": "R",
                "Anti-discriminació": "D",
                "Substantiva": "S",
                "Altres": "O"
            }}
        />
        <hr/>
        <table>
            <thead>
            <tr>
                <td rowSpan={2}></td>
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
            {tableData.map( (row) => {
                const data = [...row];
                const rowName = data.shift();

                return (<tr key={rowName}>
                    <td>{rowName}</td>
                    {data.map( (d, i) => <td key={i}>{d.n} ({d.median})</td>)}
                </tr>)
            })}
            </tbody>
        </table>
    </div>
);

export default DistributionAccordingToProtectionLevelView;
