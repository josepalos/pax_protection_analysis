import React from "react";

import SquaresTable from "../SquaresTable/SquaresTable";
import VerticalGroupedBarChart from "../VerticalBarChart/VerticalGroupedBarChart";
import { aggregateElementsBy, countAggregator, medianAggregator } from "../DataLoadAndTransform";
import TableWithCountAndMedian from "./TableWithCountAndMedian";

function aggregateAgreementsProtectionsForGroupByLevel(agreements, group) {
    const attributesIf = {
        "Rhetorical": d => d[group] === 1,
        "Provisions": d => d[group] === 2,
        "Substantive provisions": d => d[group] === 3
    };

    const p = aggregateElementsBy(
        agreements,
        countAggregator,
        d => d.Year,
        null,
        attributesIf);
    const data = {};
    p.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
}

function aggregateByConflictType(agreements, aggregator) {
    const aggregateByType = aggregateElementsBy(
        agreements,
        aggregator,
        d => d.Contp,
        null,
        {
            "rhetoricalCount": d => d.rhetoricalCount > 0,
            "antiDiscriminationCount": d => d.antiDiscriminationCount > 0,
            "substantiveCount": d => d.substantiveCount > 0,
            "otherProtectionsCount": d => d.otherProtectionsCount > 0
        });
    const data = {};
    aggregateByType.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
}

const Distribution = ({agreements}) => {
    const protectionsForGroupByLevel =
        aggregateAgreementsProtectionsForGroupByLevel(agreements, "GCh");

    const levelsAttributes = ["rhetoricalCount", "antiDiscriminationCount",
        "substantiveCount", "otherProtectionsCount"];
    const aggregateCountByProtectionLevel = levelsAttributes.map(
        (attr) => {
            const count = aggregateElementsBy(agreements, countAggregator, d => d[attr])
                .filter((d) => d.key !== 0);
            count.forEach((d) => d.attr = attr);
            return count;
        })
        .flat();

    const countData = aggregateByConflictType(agreements, countAggregator);
    const medianData = aggregateByConflictType(agreements, medianAggregator);

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
                        data={protectionsForGroupByLevel}
                        rowsName="Any de signatura"
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
                        data={aggregateCountByProtectionLevel}
                        xValue={group => group.key}
                        xLabel="Número de grups protegits"
                        yValue={group => group.value}
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
                    <TableWithCountAndMedian
                        title={"a title"}
                        countData={countData}
                        medianData={medianData}
                    />
                </div>
            </div>
        </div>)
};

export default Distribution;
