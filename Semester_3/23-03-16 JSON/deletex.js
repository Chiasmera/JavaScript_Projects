// deletex.js
let userUrl = 'https://jsonplaceholder.typicode.com/users/1';
// let userUrl = 'https://jsonplaceholder.typicode.com/users';

async function main(url) {
    try {
        let respons = await deLete(url);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}
main(userUrl);