// opgave12.1.js
const earthquakeUrl = // https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php 
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

async function generateEarthquakeTable(earthquakeUrl) {
    const table = document.createElement('table')
    document.body.appendChild(table)
    
    let results = await fetch(earthquakeUrl)
    if (results.status !== 200) {
        throw new Error(result.status)
    }
    results = await results.json()

    const simplifiedArray = results.features.map( (feature) => { return {
            mag:feature.properties.mag,
            place:feature.properties.place,
            time:feature.properties.time
        }
    })

    simplifiedArray.sort( (a,b)=> b.mag - a.mag)

    //Headers
    const row = document.createElement('tr')
    const indexHeader = document.createElement('th')
    indexHeader.textContent = '#'
    row.appendChild(indexHeader)
    const magHeader = document.createElement('th')
    magHeader.textContent = 'Magnitude'
    row.appendChild(magHeader)
    const timeHeader = document.createElement('th')
    timeHeader.textContent = 'Time'
    row.appendChild(timeHeader)
    const placeHeader = document.createElement('th')
    placeHeader.textContent = 'Place'
    row.appendChild(placeHeader)
    table.appendChild(row)
    
    //Data generation
    simplifiedArray.forEach( (element, index) => {
        const row = document.createElement('tr')
        const indexCell = document.createElement('td')
        indexCell.textContent = index
        row.appendChild(indexCell)

        const magCell = document.createElement('td')
        magCell.textContent = element.mag
        row.appendChild(magCell)

        const timeCell = document.createElement('td')
        timeCell.textContent = Date(element.time)
        row.appendChild(timeCell)

        const placeCell = document.createElement('td')
        placeCell.textContent = element.place
        row.appendChild(placeCell)

        table.appendChild(row)
    });

}

async function main(earthquakeUrl) {
    generateEarthquakeTable(earthquakeUrl)
}
main(earthquakeUrl);