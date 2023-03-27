// opgave13.2.js
const express = require('express');
const app = express();
const fetch = require('node-fetch');

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
    try {
        let users = await get(userUrl);
        let html = genererTabel(users);
        response.send(html);
    } catch (fejl) {
        if (typeof fejl.message === 'number')
            response.sendStatus(fejl.message);
        else {
            response.send(fejl.name + ": " + fejl.message);
        }
    }
});

app.listen(8080);

console.log('Lytter på port 8080 ...');