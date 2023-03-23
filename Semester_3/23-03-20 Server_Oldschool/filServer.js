// filServer.js
const http = require('http');
const fs = require('fs').promises;

function genererLinks(filnavne) {
    let html = '';
    for (let filnavn of filnavne) {
        html += '<a href="' + filnavn + '">' + filnavn + '</a><br>\n';
    }
    return html;
}

http.createServer(async (request, response) => {
    if (request.url === '/') {
        let filnavne = await fs.readdir(__dirname + '/filer');
        let html = genererLinks(filnavne);
        response.writeHead(200, {"Content-Type": "text/html"}); // OK
        response.write(html);
    } else {
        try {
            let sti = __dirname + '/filer' + request.url;
            let filData = await fs.readFile(sti);
            response.writeHead(200); // OK
            response.write(filData);
        } catch (e) {
            response.writeHead(404); // Not Found
            response.write(e.name + ": " + e.message);
        }    
    }    
    response.end();
}).listen(8080);    

console.log('Lytter på port 8080 ...');