import {csv, json, tsv} from 'd3';
import {feature} from 'topojson';

const datasetUrl = "/data/pax_all_agreements_data.csv";


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

const fetchAgreements = new Promise((resolve, reject) => {

    const parseCsv = (d) => {
        const groups = ["GCh", "GDis", "GAge", "GMig", "GRa", "GRe",
            "GInd", "GOth", "GRef", "GSoc"];
        const protections = ["Rhet", "Antid", "Subs", "Other"];

        const protectionsForGrous = groups.map( (group) =>
            protections.map( (p) => `${group}${p}`)
        ).flat();

        // TODO add variables of group+"Rhet", group+"Antid"...
        const attributesToReturn = ["Con", "Contp", "AgtId", "Agt",
            "Dat", "Status", "HrNi", ...groups, ...protectionsForGrous];

        // filter attributes
        return Object.keys(d)
            .filter(key => attributesToReturn.includes(key))
            .reduce((obj, key) => {
                if (groups.includes(key) || key === "HrNi" || protectionsForGrous.includes(key)){
                    // Numeric attributes
                    obj[key] = +d[key];
                }else if (key === "Dat")
                    obj.Year = new Date(d[key]).getFullYear();
                else
                    obj[key] = d[key];

                // Add aggregation variables
                obj.rhetoricalCount = groups.reduce(
                    (count, group) => count + (+d[`${group}Rhet`] === 1 ? 1 : 0)
                , 0);
                obj.antiDiscriminationCount = groups.reduce(
                    (count, group) => count + (+d[`${group}Antid`] === 1 ? 1 : 0)
                    , 0);
                obj.substantiveCount = groups.reduce(
                    (count, group) => count + (+d[`${group}Subs`] === 1 ? 1 : 0)
                    , 0);
                obj.otherProtectionsCount = groups.reduce(
                    (count, group) => count + (+d[`${group}Other`] === 1 ? 1 : 0)
                    , 0);
                // TODO

                return obj;
            }, {})
    };

    csv(datasetUrl, parseCsv)
        .then(agreementsData => {
            resolve(agreementsData)
        });
});

const generalSort = (e1, e2) => {
    if(e1.key < e2.key)
        return -1;
    else if(e1.key === e2.key)
        return 0;
    else
        return 1;
};

const countAgreementsBy = (agreements, by, attributesIf = undefined) => {
    const data = {};
    agreements.forEach( (agreement) => {
        const key = by(agreement);
        if(!(key in data)){
            data[key] = {key: key};
            if(attributesIf === undefined){
                data[key].count = 0;
            }else{
                Object.keys(attributesIf).forEach( (attr) => {
                    data[key][attr] = 0
                });
            }
        }

        if(attributesIf === undefined){
            data[key].count++;
        }else{
            for( let attr in attributesIf ){
                const ifFunc = attributesIf[attr];
                if(ifFunc(agreement)){
                    data[key][attr]++;
                }
            }

        }
    });

    return Object.values(data).sort(generalSort);
};

export { fetchCountries, fetchAgreements, countAgreementsBy };
