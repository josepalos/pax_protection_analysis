import { axisLeft, axisBottom } from 'd3';

const YAxis = (selection, {scale, ticks, width, height, label}) => {
    const axis = axisLeft(scale)
        .ticks(ticks)
        .tickSize(-width);
    const axisG = selection.select(".y-axis");
    const axisGEnter = selection.append("g")
        .attr("class", "y-axis");
    axisGEnter.merge(axisG)
        .call(axis)
        .selectAll(".domain").remove();
    axisGEnter.append("text") // X and Y are swapped because of the rotation
        .attr("class", "axis-label")
        .attr("y", -30)
        .attr("transform", "rotate(-90)")
        .merge(axisG.select(".axis-label"))
        .attr("x", -height / 2)
        .text(label);
};

const XAxis = (selection, {scale, width, height, tickRotation, label}) => {
    const axis = axisBottom(scale);
    const axisG = selection.select(".x-axis");
    const axisGEnter = selection.append("g")
        .attr("class", "x-axis");
    axisGEnter.merge(axisG)
        .call(axis)
        .attr("transform", `translate(0, ${height})`)
        .selectAll(".domain, .tick line").remove();

    const tickXOffset = Math.sin(tickRotation * Math.PI / 180) * 22;
    const tickYOffset = Math.cos(tickRotation * Math.PI / 180) * 22;
    axisGEnter.selectAll(".tick text")
        .attr("transform", `translate(${tickXOffset}, ${tickYOffset}) rotate(${tickRotation})`);

    axisGEnter.append("text")
        .attr("class", "axis-label")
        .attr("y", 70)
        .merge(axisG.select(".axis-label"))
        .attr("x", width / 2)
        .text(label)
};

const GroupAxis = (selection, props) => {
    const {
        scale,
        abbreviations = undefined,
        xScale,
        height,
        separatorLength
    } = props;


    const axis = axisBottom(scale);
    if(abbreviations !== undefined){
        axis.tickFormat(d => abbreviations[d]);
    }

    const axisG = selection.selectAll(".group-axis").data(xScale.domain());
    axisG.enter().append("g")
        .attr("class", "group-axis")
        .merge(axisG)
        .call(axis)
        .attr("transform", d => `translate(${xScale(d)}, ${height})`)
        .selectAll(".domain, .tick line").remove();

    const separatorDomain = xScale.domain().filter((d,i) => i !== 0);
    const separatorXCoord = d => xScale(d) - xScale.step() * xScale.paddingInner() / 2;
    const separators = selection.selectAll(".x-separator").data(separatorDomain);
    separators.enter().append("line")
        .attr("class", "x-separator")
        .attr("stroke", "black")
        .merge(separators)
        .attr("x1", separatorXCoord)
        .attr("x2", separatorXCoord)
        .attr("y1", height)
        .attr("y2", height + separatorLength);
};

export { XAxis, YAxis, GroupAxis };
