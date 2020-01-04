import React, { useState } from 'react';
import Tabs from './components/Tabs/Tabs';
import VerticalBarChart from './components/VerticalBarChart/VerticalBarChart';
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

const agreeementsGrouped = (agreements) => [
  {x: 1, y: 2, g: "R"},
  {x: 1, y: 0, g: "D"},
  {x: 1, y: 2, g: "S"},
  {x: 1, y: 0, g: "O"},
  {x: 2, y: 1, g: "R"},
  {x: 2, y: 1, g: "D"},
  {x: 2, y: 0, g: "S"},
  {x: 2, y: 1, g: "O"},
  {x: 3, y: 0, g: "R"},
  {x: 3, y: 1, g: "D"},
  {x: 3, y: 0, g: "S"},
  {x: 3, y: 1, g: "O"},
  {x: 4, y: 0, g: "R"},
  {x: 4, y: 0, g: "D"},
  {x: 4, y: 1, g: "S"},
  {x: 4, y: 0, g: "O"},
  {x: 5, y: 0, g: "R"},
  {x: 5, y: 0, g: "D"},
  {x: 5, y: 0, g: "S"},
  {x: 5, y: 1, g: "O"},
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
      <VerticalBarChart
          title="Quantitat d'acords signats cada any"
          width="700"
          height="500"
          data={years}
          xValue={d => d.any}
          xLabel="Any"
          yValue={d => d.n}
          yLabel="Nombre d'acords"
          xAxisTickRotation={-55}
      />

      <VerticalBarChart
          title="Quantitat de grups protegits segons el nivell i acord"
          width="700"
          height="500"
          data={agreeementsGrouped(agreements)}
          xValue={group => group.x}
          xLabel="Número de grups protegits"
          yValue={group => group.y}
          yLabel="Número d'acords"
          // groupBy={group => group.g}
      />


      {/*<Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div label={tabs[0]}>
          <VerticalBarChart
            title="Quantitat d'acords signats cada any"
            width="700"
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
          <VerticalBarChart
            title="Quantitat de grups protegits segons el nivell i acord"
            width="700"
            height="500"
            data={agreeementsGrouped(agreements)}
            xValue={group => group.x}
            xLabel="Número de grups protegits"
            yValue={group => group.y}
            yLabel="Número d'acords"
            // groupBy={group => group.g}
          />
        </div>
        <div label={tabs[2]}>
            <p>Not implemented yet</p>
        </div>
      </Tabs>*/}
    </>
  );
}

export default App;
