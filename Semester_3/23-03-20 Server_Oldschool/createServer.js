// createServer.js
const http = require('http');

http.createServer((request, response) => {
    let array = [request.method, request.url];
    response.writeHead(200, {"Content-Type": "application/json"}); // OK
    response.write(JSON.stringify(array));
    response.end();
}).listen(8080);

console.log('Lytter på port 8080 ...');