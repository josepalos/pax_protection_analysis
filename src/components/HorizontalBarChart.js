import React, { useEffect } from 'react';
import './HorizontalBarChart.css';
import {
    select,
    csv,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom
} from 'd3';

const HorizontalBarChart = ({title, datasetPath, xValue, xLabel, yValue, yLabel}) => {
    const width = 700;
    const height = 300;
    const margin = {
        top: 100,
        right: 10,
        bottom: 40,
        left: 100
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const render = data => {
        const xScale = scaleLinear()
            .domain([0, max(data, xValue)])
            .range([0, innerWidth]);

        const yScale = scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.1);

        const svg = select("svg");
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("text")
            .attr("class", "chart-title")
            .attr("y", -20)
            .attr("x", innerWidth / 2)
            .text(title);
        
        // Set axis
        const yAxisG = g.append('g').call(axisLeft(yScale));
        yAxisG.selectAll(".domain, .tick line")
            .remove();
        yAxisG.append("text")
            .attr("class", "axis-label")
            .attr("y", -60)
            .attr("x", -innerHeight / 2)
            .attr("transform", "rotate(-90)")
            .text(yLabel);
        
        const xAxis = axisBottom(xScale)
            .tickSize(-innerHeight);
        
        const xAxisG = g.append('g').call(xAxis)
            .attr("transform", `translate(0, ${innerHeight})`);
        xAxisG.select(".domain")
            .remove();
        xAxisG.append("text")
            .attr("class", "axis-label")
            .attr("y", 40)
            .attr("x", innerWidth / 2)
            .text(xLabel);

        // Set bars
        const bars = g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", d => `translate(0, ${yScale(yValue(d))})`);
        
        bars.append("rect")
            .attr("width", d => xScale(xValue(d)))
            .attr("height", yScale.bandwidth());
        bars.append("text")
            .attr("class", "label")
            .attr("x", d => xScale(xValue(d)))
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", ".35em")
            .text(xValue);
    }

    useEffect(() => {
        csv(datasetPath)
            .then(render);
    });

    return <svg width={width} height={height}></svg>

}

export default HorizontalBarChart;