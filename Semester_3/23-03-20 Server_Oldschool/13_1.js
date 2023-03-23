const express = require('express')
const fs = require('fs').promises;
const app = express()

function genererLinks(filnavne) {
    let html = '';
    for (let filnavn of filnavne) {
        html += '<a href="' + filnavn + '">' + filnavn + '</a><br>\n';
    }
    return html;
}

app.get('/:file', async (request, response) => {
    let sti = __dirname + '/filer' + request.url;
    let filData = await fs.readFile(sti);
    response.writeHead(200); // OK
    response.write(filData);
})

app.get('/', async (request, response) => {
    let filnavne = await fs.readdir(__dirname + '/filer');
    let html = genererLinks(filnavne);
    response.writeHead(200, {"Content-Type": "text/html"}); // OK
    response.write(html);
    response.end()
})

app.listen(3141, () => console.log('Serveren kører (port 3141)'))