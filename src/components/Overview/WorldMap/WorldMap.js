import React, {createRef, useEffect} from 'react';
import {
    select,
    geoPath,
    geoMercator,
    max,
    scaleSequential,
    interpolateReds
} from 'd3';
import styles from './WorldMap.module.css';

const WorldMap = (props) => {
    const {
        width,
        height,
        countriesCount,
        countriesFeatures,
        noDataFill = "lightgrey",
        projection = geoMercator()
    } = props;

    const colorValue = d => countriesCount[d.properties.name] || 0;
    const getCountryTitle = d => d.properties.name + ": " + colorValue(d);
    const pathGenerator = geoPath()
        .projection(projection);

    const svgRef = createRef();

    const renderMap = (selection, props) => {
        const colorScale = scaleSequential()
            .interpolator(interpolateReds)
            .domain([0, max(countriesFeatures, colorValue)]);

        const paths = selection.selectAll(styles.country)
            .data(countriesFeatures);
        paths.enter().append("path")
            .merge(paths)
            .attr("class", styles.country)
            .attr("d", pathGenerator)
            .attr("fill", d => colorValue(d) === 0 ? noDataFill : colorScale(colorValue(d)))
            .append("title")
            .text(getCountryTitle);
    };

    useEffect(() => {
        if (Object.entries(countriesFeatures).length === 0) {
            console.log("Loading map features...");
        } else if (countriesCount.length === 0) {
            console.log("Loading count data...");
        } else {
            console.log("Loaded data");
            select(svgRef.current)
                .call(renderMap, {});

        }
    });

    return (
        <div>
            <svg ref={svgRef}
                 className={styles.world_map}
                 width={width}
                 height={height}
            />
            <div className="help">
                <p>Situa el cursor sobre un país per veure el nombre d'acords en els que està involucrat</p>
            </div>
        </div>
    );
};

export default WorldMap;
