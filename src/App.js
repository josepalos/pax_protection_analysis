import React, { useState } from 'react';
// import HorizontalBarChart from './components/HorizontalBarChart';
import WorldMap from './components/WorldMap';
import fetchCountries from './components/DataLoadAndTransform';

function App() {
  // const datasetPath = "/data/employees.csv";
  // const xValue = d => d.Age;
  // const yValue = d => d.Name;
  const [countries, setCountries] = useState({});

  fetchCountries.then((data) => {
    setCountries(data);
  });

  return (
    <>
      {/* <div>
        <HorizontalBarChart
          title="Edats dels treballadors"
          datasetPath={datasetPath}
          xValue={xValue}
          xLabel="Nom"
          yValue={yValue}
          yLabel="Edat"></HorizontalBarChart>
      </div> */}
      <div>
        <WorldMap width="960" height="500" countries={countries}></WorldMap>
      </div>
    </>
  );
}

export default App;
