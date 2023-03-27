// opgave14.1.js (modificeret 13.1)
const express = require('express');
const app = express();
const fs = require('fs').promises;

app.set('view engine', 'pug')

app.use(express.static(__dirname + '/filer'));
app.use(express.static('assets'))



function genererLinks(filnavne) {
    let linkArray = [];
    for (let filnavn of filnavne) {
        
        linkArray.push(filnavn)
    }
    return linkArray;
}

app.get('/', async (request, response) => {
    let filnavne = await fs.readdir(__dirname + '/filer');
    let links = genererLinks(filnavne);

    response.render('frontPage', {title: 'front page', links: links})

});

app.listen(8080);

console.log('Lytter på port 8080 ...');