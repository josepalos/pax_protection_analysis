import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./styles.css"

import {
    fetchCountriesData,
    fetchAgreements,
    aggregateElementsBy,
    countAggregator,
    countCountryInvolvements,
    medianAggregator
} from './components/DataLoadAndTransform';

import Overview from "./components/Overview";
import Distribution from "./components/Distribution";
import Relations from "./components/Relations/Relations";

function aggregateProtectionsByYearAndLevel(agreements, group) {
    const attributesIf = {
        "Rhetorical": d => d[group] === 1,
        "Provisions": d => d[group] === 2,
        "Substantive provisions": d => d[group] === 3
    };

    const p = aggregateElementsBy(
        agreements,
        countAggregator,
        d => d.Year,
        null,
        attributesIf);
    const data = {};
    p.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
}

function aggregateByConflictType(agreements, aggregator) {
    const aggregateByType = aggregateElementsBy(
        agreements,
        aggregator,
        d => d.Contp,
        null,
        {
            "rhetoricalCount": d => d.rhetoricalCount > 0,
            "antiDiscriminationCount": d => d.antiDiscriminationCount > 0,
            "substantiveCount": d => d.substantiveCount > 0,
            "otherProtectionsCount": d => d.otherProtectionsCount > 0
        });
    const data = {};
    aggregateByType.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
}

const levelsAttributes = ["rhetoricalCount", "antiDiscriminationCount",
    "substantiveCount", "otherProtectionsCount"];


function App() {
    const tabs = [
        "Visió general",
        "Distribució dels acords segons el nivell de protecció",
        "Relacions interessants entre variables dels acords"
    ];

    const defaultTabIndex = 2;

    const [countriesFeatures, setCountriesFeatures] = useState({});
    const [agreements, setAgreements] = useState([]);

    fetchCountriesData.then((data) => setCountriesFeatures(data));
    fetchAgreements.then((data) => {
        setAgreements(data);
    });

    const aggregatedYears = aggregateElementsBy(agreements, countAggregator, d => d.Year);
    const countriesCount = countCountryInvolvements(agreements);

    const protectionsForGroupByYearAndLevel = aggregateProtectionsByYearAndLevel(agreements, "GCh");
    const countByProtectionLevel = levelsAttributes.map(
        (attr) => {
            const count = aggregateElementsBy(agreements, countAggregator, d => d[attr])
                .filter((d) => d.key !== 0);
            count.forEach((d) => d.attr = attr);
            return count;
        })
        .flat();
    const conflictTypeCount = aggregateByConflictType(agreements, countAggregator);
    const conflictTypeMedian = aggregateByConflictType(agreements, medianAggregator);

    return (
        <Tabs forceRenderTabPanel={true} defaultIndex={defaultTabIndex}>
            <TabList>
                {tabs.map((tab, i) => (
                    <Tab key={i}>{tab}</Tab>
                ))}
            </TabList>

            <TabPanel>
                <Overview
                    yearlyCount={aggregatedYears}
                    countriesCount={countriesCount}
                    countriesFeatures={countriesFeatures}
                />
            </TabPanel>
            <TabPanel>
                <Distribution
                    agreements={agreements}
                    protectionsForGroupByYearAndLevel={protectionsForGroupByYearAndLevel}
                    countByProtectionLevel={countByProtectionLevel}
                    conflictTypeCount={conflictTypeCount}
                    conflictTypeMedian={conflictTypeMedian}
                />
            </TabPanel>
            <TabPanel>
                <Relations agreements={agreements}/>
            </TabPanel>
        </Tabs>
    );
}

export default App;
