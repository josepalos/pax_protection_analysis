import React, {createRef, useEffect} from "react";

import {
    select,
    max,
    scalePoint,
    scaleSqrt,
    axisBottom,
    axisLeft
} from 'd3';

const renderPlot = (selection, props) => {
    // TODO add legend
    const {
        title,
        data, // a list of objects like {x: , y: , value: }
        xLabel, // TODO add labels
        yLabel
    } = props;

    const width = +selection.attr("width");
    const height = +selection.attr("height");

    const margins = {top: 30, right: 10, bottom: 30, left: 60};
    const innerMargin = 80;
    const innerWidth = width - margins.left - margins.right;
    const innerHeight = height - margins.top - margins.bottom;
    const maxRadius = 20;
    const minRadius = 0;

    const createScales = (data) => {
        const xScale = scalePoint();
        xScale.domain(data.properties.xDomain)
            .domain(xScale.domain().sort())
            .range([innerMargin, innerWidth - innerMargin]);

        const yScale = scalePoint();
        yScale.domain(data.properties.yDomain)
            .domain(yScale.domain().sort())
            .range([innerMargin, innerHeight - innerMargin]);

        const radiusScale = scaleSqrt()
            .domain([0, max(data.values, d => d.value)])
            .range([minRadius, maxRadius]);
        return {xScale, yScale, radiusScale};
    };

    const {xScale, yScale, radiusScale} = createScales(data);

    const innerG = selection.selectAll(".container").data([null]);
    const innerGEnter = innerG.enter().append("g")
        .attr("class", "container");
    innerGEnter
        .merge(innerG)
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

    innerG.append("rect")
        .attr("class", "bounding-box")
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("width", innerWidth)
        .attr("height", innerHeight);

    // Chart title
    innerGEnter.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .merge(innerG.select(".chart-title"))
        .attr("x", innerWidth / 2)
        .text(title);

    // Draw X and Y axis
    const xAxisG = innerG.select(".x-axis");
    const xAxisGEnter = innerGEnter
        .append("g")
        .attr("class", "x-axis");
    xAxisGEnter.merge(xAxisG)
        .call(axisBottom(xScale))
        .attr("transform", `translate(0, ${innerHeight})`)
        .selectAll(".domain").remove();

    const yAxisG = innerG.select(".y-axis");
    const yAxisGEnter = innerGEnter
        .append("g")
        .attr("class", "y-axis");
    yAxisGEnter.merge(yAxisG)
        .call(axisLeft(yScale))
        .selectAll(".domain").remove();

    // Axis labels
    xAxisGEnter.append("text")
        .attr("class", "axis-label")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .merge(xAxisG.select(".axis-label"))
        .attr("x", innerWidth / 2)
        .attr("y", 30)
        .text(xLabel);

    yAxisGEnter.append("text")
        .attr("class", "axis-label")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .merge(yAxisG.select(".axis-label"))
        .attr("x", -innerHeight / 2)
        .text(yLabel);

    // Draw the points
    const circles = innerG.merge(innerGEnter)
        .selectAll("circle").data(data.values);
    circles.enter().append("circle")
        .merge(circles)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) => radiusScale(d.value))
        .append("title").text(d => d.value);

    const labels = innerG.merge(innerGEnter)
        .selectAll(".circle-label").data(data.values);
    labels.enter().append("text")
        .attr("class", "circle-label")
        .attr("fill", "white")
        .merge(labels)
        .attr("x", d => xScale(d.x) - 5)
        .attr("y", d => yScale(d.y) + 5)
        .text(d => d.value);

};

const aggregateOver = (agreements, getXDim, getYDim) => {
    // TODO optimize and clean this
    const data = {
        values: [],
        properties: {
            xDomain: [],
            yDomain: []
        }
    };

    const values = [];

    const getXIndex = (agreement) => data.properties.xDomain.indexOf(getXDim(agreement));
    const getYIndex = (agreement) => data.properties.yDomain.indexOf(getYDim(agreement));

    agreements.forEach( (d) => {
        if (getXIndex(d) === -1){
            data.properties.xDomain.push(getXDim(d));
            const newArray = [];
            data.properties.yDomain.forEach( () => newArray.push(0));
            values.push(newArray);
        }

        if (getYIndex(d) === -1){
            data.properties.yDomain.push(getYDim(d));
            values.forEach( (d) => d.push(0) );
        }
        values[getXIndex(d)][getYIndex(d)]++;
    });


    values.forEach( (row, i) => {
        const d1 = data.properties.xDomain[i];
        row.forEach( (d, i) => {
            const d2 = data.properties.yDomain[i];
            data.values.push({x: d1, y: d2, value: d});
        });
    });

    return data;
};


const DiscretePointPlot = (props) => {
    const {
        data,
        title,
        width,
        height,
        getXDim,
        xLabel,
        getYDim,
        yLabel
    } = props;

    const svgRef = createRef();

    useEffect(() =>{
        if(data !== undefined && data.length > 0) {
            select(svgRef.current)
                .call(renderPlot, {
                    title: title,
                    data: aggregateOver(data, getXDim, getYDim),
                    xLabel: xLabel,
                    yLabel: yLabel
                });
        }else{
            console.log("Loading data");
        }
    });

    return (
        <svg ref={svgRef} width={width} height={height}/>
    )
};

export default DiscretePointPlot;
