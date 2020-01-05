import Selector from "./Selector";
import DiscretePointPlot from "../ScatterPlot/DiscretePointPlot";
import React from "react";

const RelationBetweenGroupAndHrNi = ({data, possibleOptions, selectedGroup, onGroupChange}) => {
    return (
        <>
            <div style={{display: "table", borderSpacing: "10px"}}>
                <div style={{display: "table-row"}}>
                    <div style={{display: "table-cell"}}>
                        Grup:
                        <Selector
                            value={selectedGroup}
                            onChange={onGroupChange}
                            options={possibleOptions}
                        />
                    </div>
                </div>
            </div>
            <DiscretePointPlot
                data={data}
                title={"Relació entre " + selectedGroup + " i NhRi"}
                width="400"
                height="400"
                getXDim={(d) => d[selectedGroup]}
                xLabel={selectedGroup}
                getYDim={(d) => d.HrNi}
                yLabel={"Menció HrNi"}
            />
        </>
    )
};

export default RelationBetweenGroupAndHrNi;
