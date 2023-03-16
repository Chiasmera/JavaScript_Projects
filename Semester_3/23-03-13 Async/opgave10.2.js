// opgave11.2.js
const userUrl = 'https://jsonplaceholder.typicode.com/users';
const postUrl = 'https://jsonplaceholder.typicode.com/posts?userId=';


async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}


async function start(userUrl) {
    try {
        
        let userArray = await get(userUrl);

        createTable(userArray, document.body,'id', 'name', 'email', );

        let rows = document.querySelectorAll('tr');
        rows.forEach(
            (element) => element.addEventListener('click', (event) => onClickTable(event))
        )
        
    } catch (error) {
        console.log(error)
        
    }
}

start(userUrl);

function createRow(table){
    let row = document.createElement('tr')
    table.appendChild(row)
    return row
}

function createCell(row, data) {
    let nameCell = document.createElement('td');
    nameCell.textContent = data;
    row.appendChild(nameCell)
}

function createTable (array, parent, ...properties) {
    let table = document.createElement('table')
    parent.appendChild(table)

    if (Array.isArray(array)){
            array.forEach(element => {
                let row = createRow(table)
                properties.forEach( (property) => createCell(row, element[property]))
               
        });
    }

}

async function onClickTable(event) {
    let userArray = await get(userUrl);
    
    let user;
    if (Array.isArray(userArray)) {
        user = userArray.find((user) => event.target.textContent === user.name)
    }

    let div = document.querySelector('div')
    if (div == null) {
        div =document.createElement('div')
        document.body.appendChild(div)
    } else {
        div.removeChild(div.lastChild)
    }

    let table = document.createElement('table')
    div.appendChild(table)
    for (let entry in user) {
        let row = createRow(table)
        createCell(row, entry)
        createCell(row, user[entry])
    }



}