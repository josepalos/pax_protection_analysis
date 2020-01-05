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

function App() {
    const tabs = [
        "Visió general",
        "Distribució dels acords segons el nivell de protecció",
        "Relacions interessants entre variables dels acords"
    ];

    const defaultTabIndex = 1;

    const [countries, setCountries] = useState({});
    const [agreements, setAgreements] = useState([]);

    fetchCountries.then((data) => setCountries(data));
    fetchAgreements.then((data) =>{
        setAgreements(data);
    });

    const aggregatedYears = countAgreementsBy(agreements, d => d.Year);

    return (
        <Tabs forceRenderTabPanel={true} defaultIndex={defaultTabIndex}>
            <TabList>
                {tabs.map( (tab, i) => (
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
                <DistributionAccordingToProtectionLevelView
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
