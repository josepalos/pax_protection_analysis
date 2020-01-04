import React, { useState } from 'react';
import Tabs from './components/Tabs/Tabs';
import VerticalBarChart from './components/VerticalBarChart/VerticalBarChart';
import VerticalGroupedBarChart from './components/VerticalBarChart/VerticalGroupedBarChart';
import WorldMap from './components/WorldMap/WorldMap';
import fetchCountries from './components/DataLoadAndTransform';
import SquaresTable from './components/SquaresTable/SquaresTable';

const createYears = (minValue, maxValue) => {
  const data = [];
  for(let i = 1990; i <= 2019; i++){
    data.push({any: i, n: minValue + Math.floor(Math.random() * maxValue)});
  }
  return data;
};
const fetchYears = new Promise((resolve, reject) => {
  resolve(createYears(0, 100));
});

const agreements = [
  {r: 1, d: 3, s: 4, o: 5},
  {r: 1, d: 2, s: 1, o: 2},
  {r: 2, d: 3, s: 1, o: 3}
];

const agreementsGrouped = (agreements) => [
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
    "TODO"
  ];

  const initialTab = tabs[0];
  const [countries, setCountries] = useState({});
  const [activeTab, setActiveTab] = useState(initialTab);
  const [years, setYears] = useState([]);

  fetchCountries.then( (data) => setCountries(data) );
  fetchYears.then( (data) => setYears(data) );

  return (
    <>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div label={tabs[0]}>
          <VerticalBarChart
              title="Quantitat d'acords signats cada any"
              width="800"
              height="500"
              data={years}
              xValue={d => d.any}
              xLabel="Any"
              yValue={d => d.n}
              yLabel="Nombre d'acords"
              xAxisTickRotation={-55}
          />

            <hr/>

            <WorldMap width="960" height="500" countries={countries}/>
        </div>
        <div label={tabs[1]}>
          <SquaresTable
            title={"Quantitat d'acords que estableixen els diferents nivells de protecció pels nens cada any"}
            data={{
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
            }}
            rows={[1990, 1991, 1992]}
            rowsName="Any de signatura"
            columns={[
              "Retòrica",
              "Provisions",
              "Provisions substantives"
            ]}
            columnsName="Children/Youth"
            />

          <hr/>
          <VerticalGroupedBarChart
              title="Quantitat de grups protegits segons el nivell i acord"
              width="800"
              height="500"
              margin={{top: 50, right: 200, bottom: 80, left: 70}}
              data={agreementsGrouped(agreements)}
              xValue={group => group.x}
              xLabel="Número de grups protegits"
              yValue={group => group.y}
              yLabel="Número d'acords"
              groupBy={group => group.g}
              groupByAbbreviation={{
                "Retòrica": "R",
                "Anti-discriminació": "D",
                "Substantiva": "S",
                "Altres": "O"
              }}
          />
        </div>
        <div label={tabs[2]}>
            <p>Not implemented yet</p>
        </div>
      </Tabs>
    </>
  );
}

export default App;
