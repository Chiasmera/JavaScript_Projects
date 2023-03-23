// postNavn.js
const fetch = require('node-fetch');

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 201) // Created
        throw new Error(respons.status);
    return await respons.json();
}

async function main(url, objekt) {
    try {
        let respons = await post(url, objekt);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}
main('http://localhost:8080/', {navn: 'Viggo'});