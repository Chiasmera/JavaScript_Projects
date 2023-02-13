const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
];

function generateTitle(title) {
    let header = document.createElement('h1');
    header.textContent = title;
    header.style.color = 'red';
    document.body.appendChild(header);
}



function tableFromArray (Array) {
    let table = document.createElement('table');

    //head of table
    let head = document.createElement('thead');
    let headerRow = document.createElement('tr');
    for (let key in Array[0]) {
        let headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    }
    head.appendChild(headerRow);
    table.appendChild(head);

    //body of table
    let body = document.createElement('tbody');
    table.appendChild(body);

     for (let arrayObject of Array) {
        let row = document.createElement('tr');

        for (let value of Object.values(arrayObject)) {
            let cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);

            cell.style.borderStyle = 'solid';
            cell.style.borderColor = 'blue';
        }
        body.appendChild(row);
    }

    document.body.appendChild(table)

    table.style.borderStyle = 'solid';
    table.style.borderColor = 'blue';
    table.style.borderCollapse = 'collapse';
}


generateTitle('Mountains');
tableFromArray(MOUNTAINS);