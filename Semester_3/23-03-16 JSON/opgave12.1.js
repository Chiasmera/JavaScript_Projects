// opgave12.1.js
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const earthquakeUrl ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

async function getData(url) {
    let data = await fetch(url)
    if (data.status !== 200) {
        throw new Error('datafetch failed: '+data.status)
    }
    return await data.json();
}


 function createEathquakeTable () {
    let table = document.createElement('table')
    document.body.appendChild(table);

    createHeaders(table)

    createCells(table)


}

function createHeaders(table) {
    let headerRow = document.createElement('tr')
    table.appendChild(headerRow)

    let mag = document.createElement('th')
    mag.textContent = 'Magnitude'
    headerRow.appendChild(mag)

    let place = document.createElement('th')
    place.textContent = 'Place'
    headerRow.appendChild(place)

    let time = document.createElement('th')
    time.textContent = 'Time'
    headerRow.appendChild(time)
}

async function createCells (table) {
    let dataObject = await getData(earthquakeUrl);

    if(Array.isArray(dataObject.features)) {

        let entries = dataObject.features
        .filter((element) => element.properties.mag >= 5)
        .map(element => {
                return ({mag: element.properties.mag, 
                        place: element.properties.place,
                        time: new Date(element.properties.time).toLocaleString()})
        })
        .sort( (a, b) => a.mag - b.mag)
        .forEach(element => {
            let row = document.createElement('tr')
            table.appendChild(row);

            let cellMag = document.createElement('td')
            cellMag.textContent = element.mag
            row.appendChild(cellMag)

            let cellPlace = document.createElement('td')
            cellPlace.textContent = element.place
            row.appendChild(cellPlace)

            let cellTime = document.createElement('td')
            cellTime.textContent = element.time
            row.appendChild(cellTime)
        });
    }

}

createEathquakeTable();