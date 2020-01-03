import React, { useEffect } from 'react';
import {
    select,
    geoPath,
    geoMercator,
    max,
    scaleSequential,
    interpolateReds
} from 'd3';
import styles from './WorldMap.module.css';


const WorldMap = ( { width, height, countries } ) => {
    const colorValue = d => d.properties.agreements;
    const getCountryTitle = d => d.properties.name + ": " + colorValue(d);

    const projection = geoMercator();
    const pathGenerator = geoPath().projection(projection);
    const colorScale = scaleSequential();

    const renderMap = (svg) => {
        colorScale
            .interpolator(interpolateReds)
            .domain([0, max(countries.features, colorValue)])

        svg.selectAll("path").data(countries.features)
            .enter().append("path")
                .attr("class", styles.country)
                .attr("d", pathGenerator)
                .attr("fill", d => colorValue(d) === 0 ? "lightgrey" : colorScale(colorValue(d)))
            .append("title")
                .text(getCountryTitle);
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

    return (
        <div>
            <svg id="world-map" className={styles.world_map} width={width} height={height}></svg>
            <div className="help">
                <p>Situa el cursor sobre un país per veure el nombre d'acords en els que està involucrat</p>
            </div>
        </div>
    );
}

export default WorldMap;