import React, {useState} from 'react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./styles.css"

import {
    aggregateByConflictType,
    aggregateElementsBy,
    aggregateProtectionsByYearAndLevel,
    countAggregator,
    countCountryInvolvements,
    fetchAgreements,
    fetchCountriesData,
    levelsAttributes,
    medianAggregator
} from './components/DataLoadAndTransform';

import Overview from "./components/Overview";
import Distribution from "./components/Distribution";
import Relations from "./components/Relations/Relations";


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
