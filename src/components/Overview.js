import React from "react";
import VerticalBarChart from "./VerticalBarChart/VerticalBarChart";
import WorldMap from "./WorldMap/WorldMap";

const Overview = ({yearlyCount, countriesCount, countriesFeatures}) => {
    return (
        <div className="div-table">
            <div className="div-table-row">
                <div className="div-table-cell">
                    <VerticalBarChart
                        title="Quantitat d'acords signats cada any"
                        width="800"
                        height="500"
                        data={yearlyCount}
                        xValue={d => d.key}
                        xLabel="Any"
                        yValue={d => d.value}
                        yLabel="Nombre d'acords"
                        xAxisTickRotation="-55"
                    />
                </div>
                <div className="div-table-cell">
                    <WorldMap
                        width="960"
                        height="500"
                        countriesCount={countriesCount}
                        countriesFeatures={countriesFeatures}
                    />
                </div>
            </div>
        </div>
    )
};

export default Overview;
