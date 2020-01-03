import { tsv, json } from 'd3';
import { feature } from 'topojson';

const someData = {
    "Spain": 10,
    "Mexico": 30,
    "France": 5,
    "Egypt": 1,
    "Canada": 100
}

const fetchCountries = new Promise((resolve, reject) => {
    Promise.all([
        tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
        json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
    ]).then( ([tsvData, topoJSONdata]) => {
        const countryData = tsvData.reduce( (acc, d) => {
            let n_agreements = someData[d.name];
            acc[d.iso_n3] = {
                name: d.name,
                agreements: n_agreements === undefined ? 0 : n_agreements
            };
            return acc;
        }, {});

        const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
        countries.features.forEach( (d) =>
            Object.assign(d.properties, countryData[d.id] ) );
        resolve(countries);
    });
});

export default fetchCountries;