import React from "react";
import DiscretePointPlot from "../ScatterPlot/DiscretePointPlot";
import Selector from "./Selector";

const RelationBetweenGroups = ({data, possibleOptions, selectedX, onXChange, selectedY, onYChange}) => {
    return (
        <>
            <div style={{display: "table", borderSpacing: "10px"}}>
                <div style={{display: "table-row"}}>
                    <div style={{display: "table-cell"}}>
                        Eix X:
                        <Selector
                            value={selectedX}
                            onChange={onXChange}
                            options={possibleOptions}
                        />
                    </div>
                    <div style={{display: "table-cell"}}>
                        Eix Y:
                        <Selector
                            value={selectedY}
                            onChange={onYChange}
                            options={possibleOptions}
                        />
                    </div>
                </div>
            </div>
            <DiscretePointPlot
                data={data}
                title={"Relació entre " + selectedX + " i " + selectedY}
                width="400"
                height="400"
                getXDim={(d) => d[selectedX]}
                xLabel={selectedX}
                getYDim={(d) => d[selectedY]}
                yLabel={selectedY}
            />
        </>
    )
};

export default RelationBetweenGroups;
