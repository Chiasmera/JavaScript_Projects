// getx.js
const userUrl = 'https://jsonplaceholder.typicode.com/users';
// const userUrl = 'https://jsonplaceholder.typicode.com/users/11';
// const userUrl = 'httpz://jsonplaceholder.typicode.com/users';

async function main(url) {
    try {
        let respons = await get(url);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}
main(userUrl);