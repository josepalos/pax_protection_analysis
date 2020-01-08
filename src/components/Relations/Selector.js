import React from "react";

const Selector = ({ selected, onChange, options }) => (
    <select className="select"
            value={selected}
            onChange={onChange}>
        {options.map((d) =>
            <option key={d} value={d}>{d}</option>)}
    </select>
);

export default Selector;
