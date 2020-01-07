import React from "react";

import SquaresTable from "./Tables/SquaresTable";
import VerticalGroupedBarChart from "./VerticalBarChart/VerticalGroupedBarChart";
import TableWithCountAndMedian from "./Tables/TableWithCountAndMedian";


const Distribution = (props) => {
    const {
        protectionsForGroupByYearAndLevel,
        countByProtectionLevel,
        conflictTypeCount,
        conflictTypeMedian,
    } = props;

    return (
        <div className="div-table tab-content">
            <div className="div-table-row">
                <div className="div-table-cell">
                    <SquaresTable
                        title={"Quantitat d'acords que estableixen els diferents nivells de protecció pels nens cada any"}
                        data={protectionsForGroupByYearAndLevel}
                        rowsName="Any de signatura"
                        columnsName="Children/Youth"
                        minArea={0}
                        maxArea={20}
                    />
                </div>

                <div className="div-table-cell">
                    <VerticalGroupedBarChart
                        title="Quantitat de grups protegits segons el nivell i acord"
                        width="800"
                        height="500"
                        margin={{top: 50, right: 250, bottom: 80, left: 70}}
                        data={countByProtectionLevel}
                        xValue={group => group.key}
                        xLabel="Número de grups protegits"
                        yValue={group => group.value}
                        yLabel="Número d'acords"
                        groupBy={group => group.attr}
                        groupByAbbreviation={{
                            "rhetoricalCount": "R",
                            "antiDiscriminationCount": "D",
                            "substantiveCount": "S",
                            "otherProtectionsCount": "O"
                        }}
                    />
                </div>
            </div>
            <div className="div-table-row">
                <div className="div-table-cell">
                    <TableWithCountAndMedian
                        title={"Protecció cap als grups segons el tipus de conflicte"}
                        countData={conflictTypeCount}
                        medianData={conflictTypeMedian}
                    />
                </div>
            </div>
        </div>)
};

export default Distribution;
