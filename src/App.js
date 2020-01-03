import React, { useState } from 'react';
import Tabs from './components/Tabs/Tabs';
import HorizontalBarChart from './components/HorizontalBarChart/HorizontalBarChart';
import WorldMap from './components/WorldMap/WorldMap';
import fetchCountries from './components/DataLoadAndTransform';

function App() {
  const initialTab = "Number of agreements over the years";
  const [countries, setCountries] = useState({});
  const [activeTab, setActiveTab] = useState(initialTab);

  const datasetPath = "/data/employees.csv";
  const xValue = d => d.Age;
  const yValue = d => d.Name;

  fetchCountries.then((data) => {
    setCountries(data);
  });

  return (
    <>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div label="Number of agreements over the years">
          <HorizontalBarChart
            title="Edats dels treballadors"
            width="700"
            height="300"
            datasetPath={datasetPath}
            xValue={xValue}
            xLabel="Nom"
            yValue={yValue}
            yLabel="Edat"/>
        </div>
        <div label="World map agreements">
          <WorldMap width="960" height="500" countries={countries}></WorldMap>
        </div>
      </Tabs>
    </>
  );
}

export default App;
