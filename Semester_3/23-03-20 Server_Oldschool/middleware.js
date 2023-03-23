// middleware.js
const express = require('express');
const app = express();

function log(request, response, next) {
    console.log(request.method + ': ' + request.url);
    next();
}

app.use(log);

app.get('/', (request, response) => {
    response.sendStatus(200); // OK
});

app.listen(8080);

console.log('Lytter på port 8080 ...');