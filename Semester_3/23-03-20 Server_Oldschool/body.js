// body.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (request, response) => {
    response.status(201).send(request.body); // Created
    console.log(request.body.navn);
});

app.listen(8080);

console.log('Lytter på port 8080 ...');