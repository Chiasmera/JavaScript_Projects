// putx.js
let userUrl = 'https://jsonplaceholder.typicode.com/users/1';
// let userUrl = 'https://jsonplaceholder.typicode.com/users';

let updateUser = { username: 'xyz' };

async function main(url) {
    try {
        let respons = await put(url, updateUser);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}
main(userUrl);