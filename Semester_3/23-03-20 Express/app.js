const express = require('express')
const figlet = require('figlet')
const app = express()

app.use( (request, response, next) => {
    console.log(`Request ankommet ${request.url}`)
    next()
})

app.get('/:variabel', (request, response) => {
    const variabel = request.params.variabel

    response.writeHead(200, 'ok')
    figlet.text(request.params.variabel, (error, data) => {
        if (error) throw error
        response.write(data)
        response.end()
    } )
    // response.write(`Dette er den variabel du forsøger at give: ${variabel}`)
    // response.end()

})

app.listen(3141, () => console.log('Serveren spiller (port 3141)'))

