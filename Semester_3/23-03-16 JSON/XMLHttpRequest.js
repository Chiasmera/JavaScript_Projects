// XMLHttpRequest.js
const userUrl = 'https://jsonplaceholder.typicode.com/users';
// const userUrl = 'https://jsonplaceholder.typicode.com/users/11';
// const userUrl = 'httpz://jsonplaceholder.typicode.com/users';

const xhr = new XMLHttpRequest();
const async = true;
xhr.responseType = "json";
xhr.open('GET', userUrl, async);
xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE)
        if (xhr.status !== 200) // OK
            console.log(xhr.status);
        else
            console.log(xhr.response);
}
xhr.send();