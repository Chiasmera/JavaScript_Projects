const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
];

const headline = document.createElement('h1')
headline.textContent = 'Mountains'
document.body.appendChild(headline)

//create table
const table = document.createElement('table')
table.id = 'Mountains'

//create headers from keys
const headerRow = document.createElement('tr')
table.appendChild(headerRow)
Object.keys(MOUNTAINS[0]).forEach( (key) => {
    const header = document.createElement('th')
    header.textContent = key
    headerRow.appendChild(header)
})

//create list of data
MOUNTAINS.forEach( (element) => {
    const row = document.createElement('tr')
    Object.values(element).forEach( (value) => {
        const cell = document.createElement('td')
        cell.textContent = value
        row.appendChild(cell)
    })
    table.appendChild(row)
})

document.body.appendChild(table)