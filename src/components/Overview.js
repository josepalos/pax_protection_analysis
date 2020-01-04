import React from "react";
import VerticalBarChart from "./VerticalBarChart/VerticalBarChart";
import WorldMap from "./WorldMap/WorldMap";

const Overview = ({years, countries}) => {
    return <div>
        <VerticalBarChart
            title="Quantitat d'acords signats cada any"
            width="800"
            height="500"
            data={years}
            xValue={d => d.any}
            xLabel="Any"
            yValue={d => d.n}
            yLabel="Nombre d'acords"
            xAxisTickRotation={-55}
        />

        <hr/>

        <WorldMap width="960" height="500" countries={countries}/>
    </div>
};

export default Overview;
