import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import {
    fetchCountriesData,
    fetchAgreements,
    aggregateElementsBy,
    countAggregator, countCountryInvolvements
} from './components/DataLoadAndTransform';

import Overview from "./components/Overview/Overview";
import Distribution from "./components/Distribution/Distribution";
import Relations from "./components/Relations/Relations";

function App() {
    const tabs = [
        "Visió general",
        "Distribució dels acords segons el nivell de protecció",
        "Relacions interessants entre variables dels acords"
    ];

    const defaultTabIndex = 0;

    const [countriesFeatures, setCountriesFeatures] = useState({});
    const [agreements, setAgreements] = useState([]);

    fetchCountriesData.then((data) => setCountriesFeatures(data));
    fetchAgreements.then((data) => {
        setAgreements(data);
    });

    const aggregatedYears = aggregateElementsBy(agreements, countAggregator, d => d.Year);
    const countriesCount = countCountryInvolvements(agreements);

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
                />
            </TabPanel>
            <TabPanel>
                <Relations agreements={agreements}/>
            </TabPanel>
        </Tabs>
    );
}

export default App;
