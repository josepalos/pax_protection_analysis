import { tsv, json } from 'd3';
import { feature } from 'topojson';

const someData = {
    "Spain": 10,
    "Mexico": 30,
    "France": 5,
    "Egypt": 1,
    "Canada": 100
};

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

const agreements = [];
const con = ["Spain", "Mexico", "France", "Egypt", "Canada"];
const levels = ["Rhet", "Antid", "Subs", "Other"];
const contp = ["Government", "Territory", "Government/territory", "Inter-group", "Other"];
const status = ["Multiparty signed/agreed", "Unilateral agreement", "Status unclear", "Agreement with Subsequent Status"]
const randItem = (list) => list[Math.floor(Math.random() * list.length)];

const fetchAgreements = new Promise((resolve, reject) => {
    for(let i = 0; i < 100; i++){
        agreements.push({
            Con: randItem(con),
            Contp: randItem(contp),
            AgtId: i,
            Agt: `Agreement ${i}`,
            Dat: Math.floor(1990 + Math.random() * (2019 - 1990)),
            Status: randItem(status),
            GCh: randItem(levels),
            GDis: randItem(levels),
            GAge: randItem(levels),
            GMig: randItem(levels),
            GRa: randItem(levels),
            GRe: randItem(levels),
            GInd: randItem(levels),
            GOth: randItem(levels),
            GRef: randItem(levels),
            GSoc: randItem(levels),
            HrNi: randItem(levels)
        });
    }
    resolve(agreements);
});

const countAgreementsBy = (agreements, by) => {
    const data = {};
    agreements.forEach( (agreement) => {
        const key = by(agreement);
        if(!(key in data)){
            data[key] = {key: key, count: 0};
        }

        data[key].count++;
    });

    const generalSort = (e1, e2) => {
        if(e1.key < e2.key)
            return -1;
        else if(e1.key === e2.key)
            return 0;
        else
            return 1;
    };

    return Object.values(data).sort(generalSort);
};

export { fetchCountries, fetchAgreements, countAgreementsBy };
