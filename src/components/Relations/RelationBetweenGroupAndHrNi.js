import Selector from "./Selector";
import DiscretePointPlot from "../ScatterPlot/DiscretePointPlot";
import React from "react";
import styles from "./Relations.module.css";

const RelationBetweenGroupAndHrNi = (props) => {
    const {
        data,
        possibleOptions,
        selectedGroup,
        onGroupChange,
        width,
        height
    } = props;
    return (
        <>
            <DiscretePointPlot
                data={data}
                title={"Relació entre " + selectedGroup + " i NhRi"}
                width={width}
                height={height}
                getXDim={(d) => d[selectedGroup]}
                xLabel={selectedGroup}
                getYDim={(d) => d.HrNi}
                yLabel={"Menció HrNi"}
            />
            <div className={`div-table ${styles.selector_table}`}>
                <div className="div-table-row">
                    <div className="div-table-cell">
                        Grup:
                        <Selector
                            value={selectedGroup}
                            onChange={onGroupChange}
                            options={possibleOptions}
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default RelationBetweenGroupAndHrNi;
