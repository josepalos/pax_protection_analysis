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
} from 'd3';
import {GroupAxis, XAxis, YAxis} from "./Axis";

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

    const render = (selection, {data}) => {
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
            tickRotation: 0,
            label: xLabel
        });

        innerGEnter.call(GroupAxis, {
            scale: subXScale,
            abbreviations: groupByAbbreviation,
            xScale: xScale,
            height: innerHeight,
            separatorLength: separatorLength
        });

        // Set bars
        const bars = innerGEnter.selectAll(".bars").data(data);
        bars.enter().append("rect")
            .attr("class", "bars")
            .merge(bars)
            .attr("fill", d => colorSelector(groupBy(d)))
            .attr("x", (d) => xScale(xValue(d)) + subXScale(groupBy(d)))
            .attr("width", subXScale.bandwidth())
            .attr("y", (d) => yScale(yValue(d)))
            .attr("height", (d) => innerHeight - yScale(yValue(d)))
            .append("title")
            .text(d => yValue(d));

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
