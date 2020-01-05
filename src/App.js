import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import {
    fetchCountries,
    fetchAgreements,
    aggregateElementsBy,
    countAggregator
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

    const defaultTabIndex = 2;

    const [countries, setCountries] = useState({});
    const [agreements, setAgreements] = useState([]);

    fetchCountries.then((data) => setCountries(data));
    fetchAgreements.then((data) => {
        setAgreements(data);
    });

    const aggregatedYears = aggregateElementsBy(agreements, countAggregator, d => d.Year);

    return (
        <Tabs forceRenderTabPanel={true} defaultIndex={defaultTabIndex}>
            <TabList>
                {tabs.map((tab, i) => (
                    <Tab key={i}>{tab}</Tab>
                ))}
            </TabList>

            <TabPanel>
                <Overview
                    years={aggregatedYears}
                    countries={countries} // TODO extract from agreements
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
