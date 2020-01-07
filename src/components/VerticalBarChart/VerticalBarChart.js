import React, {createRef, useEffect} from 'react';
import "./VerticalBarChart.css";

import {
    select,
    scaleLinear,
    max,
    scaleBand
} from 'd3';
import { XAxis, YAxis } from "./Axis";

const VerticalBarChart = (props) => {
    const {
        title,
        width,
        height,
        data,
        xValue,
        xLabel,
        yValue,
        yLabel,
        margin = {top: 100, right: 10, bottom: 80, left: 70},
        xAxisTickRotation
    } = props;

    const svgRef = createRef();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    function createScales(data) {
        const xScale = scaleBand()
            .domain(data.map(xValue))
            .range([0, innerWidth])
            .padding(0.1);
        const yScale = scaleLinear(5)
            .domain([0, max(data, yValue)])
            .range([innerHeight, 0])
            .nice();
        return {xScale, yScale};
    }

    const render = (selection, {data}) => {
        const {xScale, yScale} = createScales(data);
        const xPos = (d) => xScale(xValue(d));
        const yPos = (d) => yScale(yValue(d));
        const barWidth = xScale.bandwidth();
        const barHeight = (d) => innerHeight - yScale(yValue(d));


        // General update pattern
        const innerG = selection.selectAll(".bar-chart-container").data([null]);
        const innerGEnter = innerG.enter().append("g")
            .attr("class", "bar-chart-container");
        innerGEnter.merge(innerG)
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        innerGEnter.append("text")
            .attr("class", "chart-title")
            .attr("y", -20)
            .attr("x", innerWidth / 2)
            .text(title);

        // Set axis
        innerGEnter.call(YAxis, {
            scale: yScale,
            ticks: 8,
            width: innerWidth,
            height: innerHeight,
            label: yLabel
        });

        innerGEnter.call(XAxis, {
            scale: xScale,
            width: innerWidth,
            height: innerHeight,
            tickRotation: xAxisTickRotation,
            label: xLabel
        });

        // Set bars
        const bars = innerGEnter.selectAll("rect").data(data);
        bars.enter()
            .append("rect")
            .attr("class", "no-group")
            .merge(bars)
            .attr("x", xPos)
            .attr("width", barWidth)
            .attr("y", yPos)
            .attr("height", barHeight)
            .append("title")
            .text(d => yValue(d));
    };

    useEffect(() => {
        if (data !== undefined && data.length > 0) {
            select(svgRef.current)
                .call(render, {data});
        }
    });

    return <svg
        ref={svgRef}
        className="bar-chart"
        width={width}
        height={height}>
    </svg>

};

export default VerticalBarChart;
