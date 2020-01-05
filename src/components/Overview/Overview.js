import React from "react";
import VerticalBarChart from "../VerticalBarChart/VerticalBarChart";
import WorldMap from "./WorldMap/WorldMap";

const Overview = ({years, countries}) => {
    const innerDivStyle = {
        display: "table-cell",
        verticalAlign: "top",
    };

    return (
        <div style={{display: "table"}}>
            <div style={{display: "table-row"}}>
                <div style={innerDivStyle}>
                    <VerticalBarChart
                        title="Quantitat d'acords signats cada any"
                        width="800"
                        height="500"
                        data={years}
                        xValue={d => d.key}
                        xLabel="Any"
                        yValue={d => d.value}
                        yLabel="Nombre d'acords"
                        xAxisTickRotation="-55"
                    />
                </div>
                <div style={innerDivStyle}>
                    <WorldMap width="960" height="500" countries={countries}/>
                </div>
            </div>
        </div>
    )
};

export default Overview;
