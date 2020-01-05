import React, {createRef, useEffect} from 'react';
import "./VerticalBarChart.css";
import colorLegend from "./ColorLegend";

import {
    select,
    scaleLinear,
    scaleOrdinal,
    schemeSpectral,
    max,
    scaleBand,
    axisLeft,
    axisBottom
} from 'd3';

const VerticalGroupedBarChart = (props) => {
    const {
        title,
        width,
        height,
        data,
        xValue,
        xLabel,
        yValue,
        yLabel,
        groupBy,
        groupByAbbreviation = undefined,
        margin,
    } = props;

    const svgRef = createRef();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const separatorLength = 40;

    function createScales(data) {
        const xScale = scaleBand()
            .domain(data.map(xValue).sort())
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = scaleLinear(5)
            .domain([0, max(data, yValue)])
            .range([innerHeight, 0])
            .nice();

        const subXScale = scaleBand()
            .domain(data.map(groupBy))
            .range([0, xScale.bandwidth()])
            .padding(0.1);

        return {xScale, yScale, subXScale};
    }

    const render = (selection,  {data}) => {
        const {xScale, yScale, subXScale} = createScales(data);

        const colorSelector = scaleOrdinal().domain(data.map(groupBy)); // Split in two lines to get the length of the domain
        colorSelector.range(schemeSpectral[colorSelector.domain().length]);

        // Chart title
        selection.append("text")
            .attr("class", "chart-title")
            .attr("y", 25)
            .attr("x", width / 2)
            .text(title);

        // General update pattern
        const innerG = selection.selectAll(".bar-chart-container").data([null]);
        const innerGEnter = innerG.enter().append("g")
            .attr("class", "bar-chart-container");
        innerGEnter.merge(innerG)
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Set axis
        const yAxis = axisLeft(yScale)
            .ticks(8)
            .tickSize(-innerWidth);
        const yAxisG = innerG.select(".y-axis");
        const yAxisGEnter = innerGEnter.append('g')
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
        const xAxisGEnter = innerGEnter.append('g')
            .attr("class", "x-axis");
        xAxisG.merge(xAxisGEnter)
            .call(axisBottom(xScale))
            .attr("transform", `translate(0, ${innerHeight + 20})`)
            .selectAll(".domain, .tick line").remove();
        xAxisG.selectAll(".tick text");
        xAxisGEnter
            .append("text")
            .attr("class", "axis-label")
            .attr("y", 50)
            .merge(xAxisG.select(".axis-label"))
            .attr("x", innerWidth / 2)
            .text(xLabel);

        const groupAxis = axisBottom(subXScale);
        if (groupByAbbreviation !== undefined) {
            groupAxis.tickFormat(d => groupByAbbreviation[d]);
        }

        const groupAxisG = innerG.merge(innerGEnter)
            .selectAll(".group-axis").data(xScale.domain());
        groupAxisG.enter().append("g")
            .attr("class", "group-axis")
            .merge(groupAxisG)
            .call(groupAxis)
            .attr("transform", d => `translate(${xScale(d)}, ${innerHeight})`)
            .selectAll(".domain, .tick line").remove();

        // X separators
        const separatorXCoord = d => xScale(d) - xScale.step() * xScale.paddingInner() / 2;
        const xSeparators = innerG.merge(innerGEnter)
            .selectAll(".x-separator").data(xScale.domain().filter((d,i) => i !== 0));
        xSeparators.enter().append("line")
            .attr("class", "x-separator")
            .attr("stroke", "black")
            .merge(xSeparators)
            .attr("x1", separatorXCoord)
            .attr("x2", separatorXCoord)
            .attr("y1", innerHeight)
            .attr("y2", innerHeight + separatorLength);

        // Set bars
        const bars = innerGEnter.selectAll(".bars").data(data);
        bars.enter().append("rect")
            .attr("class", "bars")
            .merge(bars)
            .attr("fill", d => colorSelector(groupBy(d)))
            .attr("x", (d) => xScale(xValue(d)) + subXScale(groupBy(d)))
            .attr("width", subXScale.bandwidth())
            .attr("y", (d) => yScale(yValue(d)))
            .attr("height", (d) => innerHeight - yScale(yValue(d)));

        // Set legend
        const legendG = selection.selectAll(".legend").data([null]);
        const legendGEnter = legendG
            .enter()
            .append("g")
            .attr("class", "legend");
        legendGEnter.merge(legendG)
            .attr("transform", `translate(${width - margin.right}, ${margin.top})`);

        legendGEnter.call(colorLegend, {
            colorScale: colorSelector,
            radius: 10,
            spacing: 30,
            textOffset: 15,
            legendWidth: margin.right,
            groupByAbbreviation: groupByAbbreviation
        });
    };

    useEffect(() => {
        if (data === undefined || data.length < 1) {
            console.log("Loading years data");
        } else {
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

export default VerticalGroupedBarChart;
