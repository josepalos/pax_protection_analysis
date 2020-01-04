import React, {useState} from "react";
import DiscretePointPlot from "./ScatterPlot/DiscretePointPlot";



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
        <div>
            <div>
                <span>
                    Eix X:
                    <select className="select-x"
                            value={selectedX}
                            onChange={handleXSelectorChange}>
                        {possibleOptions.map( (d) =>
                            <option key={d} value={d}>{d}</option>)}
                    </select>
                </span>
                <span>
                    Eix Y:
                    <select className="select-y"
                            value={selectedY}
                            onChange={handleYSelectorChange}>
                        {possibleOptions.map( (d) =>
                            <option key={d} value={d}>{d}</option>)}
                    </select>
                </span>
            </div>
            <div>
                <DiscretePointPlot
                    data={agreements}
                    title={"Relació entre " + selectedX + " i " + selectedY}
                    width="400"
                    height="400"
                    getXDim={(agreement) => agreement[selectedX]}
                    xLabel={selectedX}
                    getYDim={(agreement) => agreement[selectedY]}
                    yLabel={selectedY}
                />
            </div>
        </div>
    )
};

export default Relations;
