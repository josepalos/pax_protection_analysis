import React, {createRef, useEffect} from "react";
import styles from './DiscretePointPlot.module.css';

import {
    select,
    max,
    scalePoint,
    scaleSqrt,
    axisBottom,
    axisLeft
} from 'd3';

const xAxis = (selection, {scale, height, width, label}) => {
    const axis = axisBottom(scale);

    const axisG = selection.select(".x-axis");
    const axisGEnter = selection.append("g")
        .attr("class", "x-axis");
    axisGEnter.merge(axisG)
        .call(axis)
        .attr("transform", `translate(0, ${height})`)
        .selectAll(".domain").remove();

    axisGEnter.append("text")
        .attr("class", styles.axis_label)
        .merge(axisG.select(`.${styles.axis_label}`))
        .attr("x", width / 2)
        .attr("y", 30)
        .text(label);
};

const yAxis = (selection, {scale, height, label}) => {
    const axis = axisLeft(scale);

    const axisG = selection.select(".y-axis");
    const axisGEnter = selection.append("g")
        .attr("class", "y-axis");
    axisGEnter.merge(axisG)
        .call(axis)
        .selectAll(".domain").remove();
    axisGEnter.append("text")
        .attr("class", styles.axis_label)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .merge(axisG.select(`.${styles.axis_label}`))
        .attr("x", -height / 2)
        .text(label);
};

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

    const margins = {top: 50, right: 10, bottom: 30, left: 60};
    const innerMargin = 80;
    const innerWidth = width - margins.left - margins.right;
    const innerHeight = height - margins.top - margins.bottom;
    const maxRadius = 70;
    const minRadius = 10;

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
    innerGEnter.merge(innerG)
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

    innerGEnter.append("rect")
        .attr("class", styles.bounding_box)
        .attr("width", innerWidth)
        .attr("height", innerHeight);

    // Chart title
    innerGEnter.append("text")
        .attr("class", "chart-title")
        .merge(innerG.select(".chart-title"))
        .attr("x", innerWidth / 2)
        .attr("y", -20)
        .text(title);

    // Draw X and Y axis
    innerGEnter.call(xAxis, {
        scale: xScale,
        height: innerHeight,
        width: innerWidth,
        label: xLabel
    });
    innerGEnter.call(yAxis, {
        scale: yScale,
        height: innerHeight,
        width: innerWidth,
        label: yLabel
    });

    // Draw the points
    const circles = innerG.merge(innerGEnter)
        .selectAll("circle").data(data.values);
    const circlesEnter = circles.enter()
        .append("circle")
        .attr("class", styles.circles);

    circlesEnter.merge(circles)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) => d === 0 ? 0 : radiusScale(d.value));
    circlesEnter.append("title")
        .text(d => d.value);
    circles.select("title").text(d => d.value);
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

    agreements.forEach((d) => {
        if (getXIndex(d) === -1) {
            data.properties.xDomain.push(getXDim(d));
            const newArray = [];
            data.properties.yDomain.forEach(() => newArray.push(0));
            values.push(newArray);
        }

        if (getYIndex(d) === -1) {
            data.properties.yDomain.push(getYDim(d));
            values.forEach((d) => d.push(0));
        }
        values[getXIndex(d)][getYIndex(d)]++;
    });


    values.forEach((row, i) => {
        const d1 = data.properties.xDomain[i];
        row.forEach((d, i) => {
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

    useEffect(() => {
        if (data !== undefined && data.length > 0) {
            select(svgRef.current)
                .call(renderPlot, {
                    title: title,
                    data: aggregateOver(data, getXDim, getYDim),
                    xLabel: xLabel,
                    yLabel: yLabel
                });
        }
    });

    return (
        <svg ref={svgRef} width={width} height={height}/>
    )
};

export default DiscretePointPlot;
