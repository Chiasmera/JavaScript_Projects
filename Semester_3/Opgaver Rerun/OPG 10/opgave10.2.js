// opgave11.2.js
const userUrl = 'https://jsonplaceholder.typicode.com/users';
const postUrl = 'https://jsonplaceholder.typicode.com/posts?userId=';

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

function generateUserTable(users) {
    let html = '<table>';
    for (user of users) {
        html += '<tr><td>' + user.id +
            '</td><td>' + user.name +
            '</td><td>' + user.company.name +
            '</td></tr>\n';
    }
    html += '</table><br><div></div>';
    return html;
}

function generatePostTable(posts) {
    let html = '<table>';
    for (post of posts) {
        html += '<tr><td>' + post.userId +
            '</td><td>' + post.id +
            '</td><td>' + post.title +
            '</td></tr>\n';
    }
    html += '</table>';
    return html;
}

async function postHandler(event) {
    let userId = event.currentTarget.firstElementChild.innerHTML;
    let posts;
    try {
        posts = await get(postUrl + userId);
    } catch (fejl) {
        console.log(fejl);
    }
    document.querySelector('div').innerHTML = generatePostTable(posts);
}

async function main(userUrl) {
    let users;
    try {
        users = await get(userUrl);
    } catch (fejl) {
        console.log(fejl);
    }
    document.body.innerHTML = generateUserTable(users);
    let trs = document.querySelectorAll('tr');
    for (tr of trs)
        tr.onclick = postHandler;
}
main(userUrl);