// deleteTest.js
const fetch = require('node-fetch');

async function deLete(url) {
    let respons = await fetch(url, {
        method: "DELETE"
    });
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function main(url) {
    try {
        let objekt = await deLete(url);
        console.log(objekt);
    } catch (fejl) {
        console.log(fejl);
    }
}
main('http://localhost:8080/test');