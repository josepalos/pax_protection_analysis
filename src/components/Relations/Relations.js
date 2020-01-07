import React, {useState} from "react";
import RelationBetweenGroups from "./RelationBetweenGroups";
import RelationBetweenGroupAndHrNi from "./RelationBetweenGroupAndHrNi";

const Relations = ({agreements}) => {
    const possibleOptions = ["GCh", "GDis", "GAge", "GMig", "GRa", "GRe", "GInd",
        "GOth", "GRef", "GSoc"];
    // TODO move up in the hierarchy
    const [selectedX, setSelectedX] = useState(possibleOptions[0]);
    const [selectedY, setSelectedY] = useState(possibleOptions[1]);

    const [selectedGroup, setSelectedGroup] = useState(possibleOptions[0]);

    const handleXSelectorChange = (event) => {
        setSelectedX(event.target.value);
    };

    const handleYSelectorChange = (event) => {
        setSelectedY(event.target.value);
    };

    const handleGroupSelectorChange = (event) => {
        setSelectedGroup(event.target.value);
    };

    return (
        <div className="div-table tab-content">
            <div className="div-table-row">
                <div className="div-table-cell">
                    <RelationBetweenGroups
                        data={agreements}
                        possibleOptions={possibleOptions}
                        selectedX={selectedX}
                        onXChange={handleXSelectorChange}
                        selectedY={selectedY}
                        onYChange={handleYSelectorChange}
                        width={700}
                        height={700}
                    />
                </div>
                <div className="div-table-cell">
                    <RelationBetweenGroupAndHrNi
                        data={agreements}
                        possibleOptions={possibleOptions}
                        selectedGroup={selectedGroup}
                        onGroupChange={handleGroupSelectorChange}
                        width={700}
                        height={700}
                    />
                </div>
            </div>
        </div>
    )
};

export default Relations;
