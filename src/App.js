import React, {useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import {
    fetchCountries,
    fetchAgreements,
    countAgreementsBy
} from './components/DataLoadAndTransform';

import Overview from "./components/Overview";
import DistributionAccordingToProtectionLevelView from "./components/DistributionAccordingToProtectionLevelView";
import Relations from "./components/Relations";

const protectionLevels = {
    1990: {
        "Retòrica": 1,
        "Provisions": 1,
        "Provisions substantives": 1
    },
    1991: {
        "Retòrica": 1,
        "Provisions": 1,
        "Provisions substantives": 2
    },
    1992: {
        "Retòrica": 10,
        "Provisions": 0,
        "Provisions substantives": 1
    }
};

const agreementsGrouped = [
    {x: 1, y: 2, g: "Retòrica"},
    {x: 1, y: 0, g: "Anti-discriminació"},
    {x: 1, y: 2, g: "Substantiva"},
    {x: 1, y: 0, g: "Altres"},
    {x: 2, y: 1, g: "Retòrica"},
    {x: 2, y: 1, g: "Anti-discriminació"},
    {x: 2, y: 0, g: "Substantiva"},
    {x: 2, y: 1, g: "Altres"},
    {x: 3, y: 0, g: "Retòrica"},
    {x: 3, y: 1, g: "Anti-discriminació"},
    {x: 3, y: 0, g: "Substantiva"},
    {x: 3, y: 1, g: "Altres"},
    {x: 4, y: 0, g: "Retòrica"},
    {x: 4, y: 0, g: "Anti-discriminació"},
    {x: 4, y: 1, g: "Substantiva"},
    {x: 4, y: 0, g: "Altres"},
    {x: 5, y: 0, g: "Retòrica"},
    {x: 5, y: 0, g: "Anti-discriminació"},
    {x: 5, y: 0, g: "Substantiva"},
    {x: 5, y: 1, g: "Altres"},
];

function App() {
    const tabs = [
        "Visió general",
        "Distribució dels acords segons el nivell de protecció",
        "Relacions interessants entre variables dels acords"
    ];

    const defaultTabIndex = 0;

    const [countries, setCountries] = useState({});
    const [agreements, setAgreements] = useState([]);

    fetchCountries.then((data) => setCountries(data));
    fetchAgreements.then((data) =>{
        setAgreements(data);
    });

    return (
        <Tabs forceRenderTabPanel={true} defaultIndex={defaultTabIndex}>
            <TabList>
                {tabs.map( (tab, i) => (
                    <Tab key={i}>{tab}</Tab>
                ))}
            </TabList>

            <TabPanel>
                <Overview
                    years={countAgreementsBy(agreements, d => d.Dat)}
                    countries={countries} // TODO extract from agreements
                />
            </TabPanel>
            <TabPanel>
                <DistributionAccordingToProtectionLevelView
                    protectionLevels={protectionLevels}
                    agreementsGrouped={agreementsGrouped}
                />
            </TabPanel>
            <TabPanel>
                <Relations agreements={agreements}/>
            </TabPanel>
        </Tabs>
    );
}

export default App;
