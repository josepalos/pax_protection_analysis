import React from "react";
import SquaresTable from "./SquaresTable/SquaresTable";
import VerticalGroupedBarChart from "./VerticalBarChart/VerticalGroupedBarChart";

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
    </div>
);

export default DistributionAccordingToProtectionLevelView;
