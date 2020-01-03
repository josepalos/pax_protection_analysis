import React, { useEffect } from 'react';
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
        yLabel
    } = props;

    const margin = {
        top: 100,
        right: 10,
        bottom: 80,
        left: 70
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xAxisTickRotation = -55;

    const render = data => {        
        const xScale = scaleBand()
            .domain(data.map(xValue))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = scaleLinear(5)
            .domain([0, max(data, yValue)])
            .range([innerHeight, 0])
            .nice();

        const svg = select("svg");
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("text")
            .attr("class", "chart-title")
            .attr("y", -20)
            .attr("x", innerWidth / 2)
            .text(title);
        
        // Set axis
        const yAxis = axisLeft(yScale)
            .ticks(8)
            .tickSize(-innerWidth);
        const yAxisG = g.append('g').call(yAxis);
        yAxisG.select(".domain")
            .remove();
        yAxisG.append("text")
            .attr("class", "axis-label")
            .attr("y", -30)
            .attr("x", -innerHeight / 2)
            .attr("transform", "rotate(-90)")
            .text(yLabel);
        
        const xAxisG = g.append('g').call(axisBottom(xScale))
            .attr("transform", `translate(0, ${innerHeight})`);
        xAxisG.selectAll("text")
            .attr("transform", `translate(-18, 18) rotate(${xAxisTickRotation})`);
        xAxisG.selectAll(".domain, .tick line")
            .remove();
        xAxisG.append("text")
            .attr("class", "axis-label")
            .attr("y", 70)
            .attr("x", innerWidth / 2)
            .text(xLabel);

        // Set bars
        const xPos = (d) => xScale(xValue(d));
        const yPos = (d) => yScale(yValue(d));
        const barWidth = xScale.bandwidth();
        const barHeight = (d) => innerHeight - yScale(yValue(d));


        g.selectAll("rect")
            .data(data, d => d.year)
            .enter().append("rect")
                .attr("x", xPos)
                .attr("width", barWidth)
                .attr("y", yPos)
                .attr("height", barHeight);

        // const bars = g.selectAll(".bar")
        //     .data(data)
        //     .enter()
        //     .append("g")
        //     .attr("class", ".bar")
        //     .attr("transform", d => `translate(${xPos(d)}, ${yPos(d)})`);

        // bars.append("rect")
        //     .attr("width", barWidth)
        //     .attr("height", barHeight);
        
        // bars.append("text")
        //     .attr("class", "label")
        //     .attr("y", -10)
        //     .attr("x", xScale.bandwidth() / 2)
        //     .attr("dy", ".35em")
        //     .text(yValue);
    }

    useEffect(() => {
        if(data === undefined || data.length < 1){
            console.log("Loading years data");
        }else{
            render(data);
        }
    });

    return <svg
        className="bar-chart"
        width={width}
        height={height}>
        </svg>

}

export default VerticalBarChart;