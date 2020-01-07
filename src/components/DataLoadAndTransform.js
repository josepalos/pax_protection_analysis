import {csv, json, tsv} from 'd3';
import {feature} from 'topojson';

const datasetUrl = "/data/pax_all_agreements_data.csv";

const levelsAttributes = ["rhetoricalCount", "antiDiscriminationCount",
    "substantiveCount", "otherProtectionsCount"];


const fetchCountriesData = new Promise((resolve) => {
    Promise.all([
        tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
        json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
    ]).then(([tsvData, topoJSONdata]) => {
        const countryData = tsvData.reduce((acc, d) => {
            acc[d.iso_n3] = {
                name: d.name,
            };
            return acc;
        }, {});

        const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
        countries.features.forEach((d) =>
            Object.assign(d.properties, countryData[d.id]));
        resolve(countries.features);
    });
});

const fetchAgreements = new Promise((resolve) => {

    const parseCsv = (d) => {
        const groups = ["GCh", "GDis", "GAge", "GMig", "GRa", "GRe",
            "GInd", "GOth", "GRef", "GSoc"];
        const protections = ["Rhet", "Antid", "Subs", "Other"];

        const protectionsForGrous = groups.map((group) =>
            protections.map((p) => `${group}${p}`)
        ).flat();

        // TODO add variables of group+"Rhet", group+"Antid"...
        const attributesToReturn = ["Con", "Contp", "AgtId", "Agt",
            "Dat", "Status", "HrNi", ...groups, ...protectionsForGrous];

        // filter attributes
        return Object.keys(d)
            .filter(key => attributesToReturn.includes(key))
            .reduce((obj, key) => {
                if (groups.includes(key) || key === "HrNi" || protectionsForGrous.includes(key)) {
                    // Numeric attributes
                    obj[key] = +d[key];
                } else if (key === "Dat")
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
                    (count, group) => count + (+d[`${group}Oth`] === 1 ? 1 : 0)
                    , 0);

                return obj;
            }, {})
    };

    csv(datasetUrl, parseCsv)
        .then(agreementsData => {
            resolve(agreementsData)
        });
});

const generalSort = (e1, e2) => {
    if (e1.key < e2.key)
        return -1;
    else if (e1.key === e2.key)
        return 0;
    else
        return 1;
};

const countAggregator = (values) => {
    return values.length;
};

const medianAggregator = (values) => {
    if (values.length === 0) return 0;

    values.sort(function (a, b) {
        return a - b;
    });

    const half = Math.floor(values.length / 2);
    if (values.length % 2)
        return values[half];
    return (values[half - 1] + values[half]) / 2.0;
};

const aggregateElementsBy = (agreements, aggregator, groupBy, aggregateField = undefined, attributesIf = undefined) => {
    const data = {};
    agreements.forEach((agreement) => {
        const key = groupBy(agreement);
        if (!(key in data)) {
            data[key] = {key: key};
            if (attributesIf === undefined) {
                data[key].values = [];
            } else {
                Object.keys(attributesIf).forEach((attr) => {
                    data[key][attr] = [];
                });
            }
        }

        if (attributesIf === undefined) {
            if (aggregateField === undefined || aggregateField === null)
                data[key].values.push(agreement);
            else
                data[key].values.push(aggregateField(agreement));

        } else {
            for (let attr in attributesIf) {
                const ifFunc = attributesIf[attr];
                if (ifFunc(agreement)) {
                    if (aggregateField === undefined || aggregateField === null)
                        data[key][attr].push(agreement[attr]);
                    else
                        data[key][attr].push(aggregateField(agreement));
                }
            }
        }
    });

    const dataList = Object.values(data).sort(generalSort);

    return dataList.map((element) => {
        if (attributesIf === undefined) {
            return {key: element.key, value: aggregator(element.values)};
        } else {
            const item = {key: element.key};
            Object.keys(attributesIf).forEach((attr) => item[attr] = aggregator(element[attr]));
            return item;
        }
    });
};

// Match the names of the countries to the countries feature namings.
const namesMappings = {
    "Central African Republic": "Central African Rep.",
    "Democratic Republic of Congo": "Dem. Rep. Congo",
    "North Korea": "Dem. Rep. Korea",
    "South Korea": "Korea",
    "Republic of Congo": "Dem. Rep. Congo",
    "United States of America": "United States",
};

const countCountryInvolvements = (agreements) => {
    const aggregated = aggregateElementsBy(agreements, countAggregator, d => d.Con);
    const countriesCount = {};

    aggregated.forEach((d) => {
        const involvedCountries = d.key.split("/");
        if (involvedCountries.length > 1) {
            involvedCountries.forEach((country) => {
                const countryName = namesMappings[country] || country;
                countriesCount[countryName] = d.value + (countriesCount[countryName] || 0);
            })
        } else {
            const countryName = namesMappings[d.key] || d.key;
            countriesCount[countryName] = d.value + (countriesCount[countryName] || 0);
        }
    });

    return countriesCount;
};

const aggregateProtectionsByYearAndLevel = (agreements, group) => {
    const attributesIf = {
        "Rhetorical": d => d[group] === 1,
        "Provisions": d => d[group] === 2,
        "Substantive provisions": d => d[group] === 3
    };

    const p = aggregateElementsBy(
        agreements,
        countAggregator,
        d => d.Year,
        null,
        attributesIf);
    const data = {};
    p.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
};

const aggregateByConflictType = (agreements, aggregator) => {
    const aggregateByType = aggregateElementsBy(
        agreements,
        aggregator,
        d => d.Contp,
        null,
        {
            "rhetoricalCount": d => d.rhetoricalCount > 0,
            "antiDiscriminationCount": d => d.antiDiscriminationCount > 0,
            "substantiveCount": d => d.substantiveCount > 0,
            "otherProtectionsCount": d => d.otherProtectionsCount > 0
        });
    const data = {};
    aggregateByType.forEach((d) => {
        data[d.key] = d;
        delete data[d.key].key;
    });
    return data;
};


export {
    fetchCountriesData,
    fetchAgreements,
    aggregateElementsBy,
    countAggregator,
    medianAggregator,
    countCountryInvolvements,
    aggregateByConflictType,
    aggregateProtectionsByYearAndLevel,
    levelsAttributes
};
