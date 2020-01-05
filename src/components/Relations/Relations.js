import React, {useState} from "react";
import RelationBetweenGroups from "./RelationBetweenGroups";

const Relations = ({agreements}) => {
    const possibleOptions = ["GCh", "GDis", "GAge", "GMig", "GRa", "GRe", "GInd",
        "GOth", "GRef", "GSoc"];
    // TODO move up in the hierarchy
    const [selectedX, setSelectedX] = useState(possibleOptions[0]);
    const [selectedY, setSelectedY] = useState(possibleOptions[1]);

    const handleXSelectorChange = (event) => {
        setSelectedX(event.target.value);
    };

    const handleYSelectorChange = (event) => {
        setSelectedY(event.target.value);
    };

    return (
        <div style={{display: "table"}}>
            <div style={{display: "table-row"}}>
                <div style={{display: "table-cell"}}>
                    <RelationBetweenGroups
                        data={agreements}
                        possibleOptions={possibleOptions}
                        selectedX={selectedX}
                        onXChange={handleXSelectorChange}
                        selectedY={selectedY}
                        onYChange={handleYSelectorChange}
                    />
                </div>
                <div style={{display: "table-cell"}}>
                    <p>Not implemented</p>
                </div>
            </div>
        </div>
    )
};

export default Relations;
