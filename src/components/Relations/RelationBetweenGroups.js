import React from "react";
import DiscretePointPlot from "../ScatterPlot/DiscretePointPlot";
import Selector from "./Selector";
import styles from "./Relations.module.css"

const RelationBetweenGroups = (props) => {
    const {
        data,
        possibleOptions,
        selectedX,
        onXChange,
        selectedY,
        onYChange,
        width,
        height
    } = props;
    return (
        <>
            <DiscretePointPlot
                data={data}
                title={"Relació entre " + selectedX + " i " + selectedY}
                width={width}
                height={height}
                getXDim={(d) => d[selectedX]}
                xLabel={selectedX}
                getYDim={(d) => d[selectedY]}
                yLabel={selectedY}
            />
            <div className={`div-table ${styles.selector_table}`}>
                <div className="div-table-row">
                    <div className="div-table-cell">
                        Eix X:
                        <Selector
                            selected={selectedX}
                            onChange={onXChange}
                            options={possibleOptions}
                        />
                    </div>
                    <div style={{display: "table-cell"}}>
                        Eix Y:
                        <Selector
                            selected={selectedY}
                            onChange={onYChange}
                            options={possibleOptions}
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default RelationBetweenGroups;
