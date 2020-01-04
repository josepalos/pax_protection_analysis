import React, {createRef, useEffect} from 'react';
import "./VerticalBarChart.css";

import {
    select,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom
} from 'd3';

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
        //groupBy = undefined,
        margin = {top: 100, right: 10, bottom: 80, left: 70},
        xAxisTickRotation = 0
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

    const render = data => {
        const {xScale, yScale} = createScales(data);

        const svg = select(svgRef.current);

        // General update pattern
        const innerG = svg.selectAll(".bar-chart-container").data([null]);
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
        const yAxis = axisLeft(yScale)
            .ticks(8)
            .tickSize(-innerWidth);
        const yAxisG = innerG.select(".y-axis");
        const yAxisGEnter = innerGEnter
            .append('g')
                .attr("class", "y-axis");
        yAxisG.merge(yAxisGEnter)
            .call(yAxis)
                .selectAll(".domain").remove(); // Remove the vertical axis' bar
        yAxisGEnter
            .append("text")
                .attr("class", "axis-label")
                .attr("y", -30)
                .attr("transform", "rotate(-90)")
            .merge(yAxisG.select(".axis-label"))
                .attr("x", -innerHeight / 2)
                .text(yLabel);

        const xAxisG = innerG.select(".x-axis");
        const xAxisGEnter = innerGEnter
            .append('g')
                .attr("class", "x-axis");
        xAxisG.merge(xAxisGEnter)
            .call(axisBottom(xScale))
                .attr("transform", `translate(0, ${innerHeight})`)
                .selectAll(".domain, .tick line").remove();
        xAxisG.selectAll(".tick text")
                .attr("transform", `translate(-18, 18) rotate(${xAxisTickRotation})`);
        xAxisGEnter
            .append("text")
                .attr("class", "axis-label")
                .attr("y", 70)
            .merge(xAxisG.select(".axis-label"))
                .attr("x", innerWidth / 2)
                .text(xLabel);

        // Set bars
        const xPos = (d) => xScale(xValue(d));
        const yPos = (d) => yScale(yValue(d));
        const barWidth = xScale.bandwidth();
        const barHeight = (d) => innerHeight - yScale(yValue(d));

        const bars = innerG.selectAll("rect").data(data);
        bars.enter().append("rect")
            .merge(bars)
                .attr("x", xPos)
                .attr("width", barWidth)
                .attr("y", yPos)
                .attr("height", barHeight);
    };

    useEffect(() => {
        if(data === undefined || data.length < 1){
            console.log("Loading years data");
        }else{
            render(data);
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
