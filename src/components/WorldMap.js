import React, { useEffect } from 'react';
import {
    select,
    geoPath,
    geoMercator,
    max,
    scaleSequential,
    interpolateReds
} from 'd3';

import './WorldMap.css';


const WorldMap = ( { width, height, countries } ) => {
    const colorValue = d => d.properties.agreements;
    const getCountryTitle = d => d.properties.name + ": " + colorValue(d);

    const projection = geoMercator();
    const pathGenerator = geoPath().projection(projection);
    const colorScale = scaleSequential();

    const renderMap = (svg) => {
        const maxValue = max(countries.features.map(colorValue));
        colorScale
            .interpolator(interpolateReds)
            .domain([0, maxValue])
        console.log(colorScale.domain());

        svg.selectAll("path").data(countries.features)
            .enter().append("path")
                .attr("class", "country")
                .attr("d", pathGenerator)
                .attr("fill", d => colorScale(colorValue(d)))
            .append("title")
                .text(getCountryTitle)
    };

    useEffect( () => {
        if(Object.entries(countries).length === 0 && countries.constructor === Object){
            console.log("Loading map data");
        }else{
            console.log("Loaded map data");
            const svg = select('#world-map');
            renderMap(svg);
        }
    });

    return <svg id="world-map" width={width} height={height}></svg>
}

export default WorldMap;