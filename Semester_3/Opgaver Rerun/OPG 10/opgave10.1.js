// opgave11.1.js
const userUrl = 'https://jsonplaceholder.typicode.com/users';
// const userUrl = 'https://jsonplaceholder.typicode.com/users/11';
// const userUrl = 'httpz://jsonplaceholder.typicode.com/users';

async function get(url) {
    try {
        const result = await fetch(url)
        return await result.json()
    }catch (error) {
        console.log(error);
    }
    
}

async function main(userUrl) {
    console.log(await get(userUrl));
}
main(userUrl);


get(userUrl)
    .then( (res)=> console.log(res) )
    .catch( (rej) => console.log(rej))