const colorLegend = (selection, props) => {
    const {
        colorScale,
        radius,
        spacing,
        textOffset,
        legendWidth,
        groupByAbbreviation = undefined
    } = props;

    selection.append("rect")
        .attr("rx", radius)
        .attr("width", legendWidth)
        .attr("height", colorScale.domain().length * spacing);

    const groups = selection.selectAll(".legend-items")
        .data(colorScale.domain());
    const groupsEnter = groups.enter()
        .append("g")
        .attr("class", "legend-items");
    groupsEnter.merge(groups)
        .attr("transform", (d, i) =>
            `translate(${radius + 5}, ${ (i+.5) * spacing })`);

    let getText;
    if(groupByAbbreviation === undefined){
        getText = (d) => d;
    }else{
        getText = (d) => `${groupByAbbreviation[d]}: ${d}`;
    }

    groupsEnter.append("circle")
        .merge(groups.select("circle"))
        .attr("r", radius)
        .attr("fill", colorScale);
    groupsEnter.append("text")
        .merge(groups.select("text"))
        .attr("x", textOffset)
        .attr("y", "0.35em")
        .text(getText);
};

export default colorLegend;
