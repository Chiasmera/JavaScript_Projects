const express = require('express')
const app = express()
const fetch = require('node-fetch')


const userUrl = 'https://jsonplaceholder.typicode.com/users';

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

function genererTabel(users) {
    let html = '<table>';
    for (user of users) {
        html +=
            '<tr><td>' + user.id +
            '</td><td>' + user.name +
            '</td><td>' + user.company.name +
            '</td></tr>\n';
    }
    html += '</table>';
    return html;
}

app.get('/', async (request, response) => {
    let users = await get(userUrl);
    let html = genererTabel(users);
    response.writeHead(200, { "Content-Type": "text/html" }); // OK
    response.write(html);
    response.end()
})

app.listen(3141, () => console.log('Serveren kører (port 3141)'))