import React, { useState } from 'react';
import Tabs from './components/Tabs/Tabs';
import VerticalBarChart from './components/VerticalBarChart/VerticalBarChart';
import WorldMap from './components/WorldMap/WorldMap';
import fetchCountries from './components/DataLoadAndTransform';

const fetchYears = new Promise((resolve, reject) => {
  const data = [];
  for(let i = 1990; i <= 2019; i++){
    data.push({any: i, n: Math.floor(Math.random() * 100)});
  }
  resolve(data);
});

function App() {
  const initialTab = "Visió general";
  const [countries, setCountries] = useState({});
  const [activeTab, setActiveTab] = useState(initialTab);
  const [years, setYears] = useState([]);

  fetchCountries.then((data) => {
    setCountries(data);
  });

  fetchYears.then((data) => {
    setYears(data);
  });

  const xValue = d => d.any;
  const yValue = d => d.n;
  

  return (
    <>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div label={initialTab}>
          <VerticalBarChart
            title="Quantitat d'acords signats cada any"
            width="700"
            height="500"
            data={years}
            xValue={xValue}
            xLabel="Any"
            yValue={yValue}
            yLabel="Nombre d'acords"/>

            <hr/>

            <WorldMap width="960" height="500" countries={countries}></WorldMap>
        </div>
        <div label="Distribució dels acords segons el nivell de protecció">
          
        </div>
      </Tabs>
    </>
  );
}

export default App;
