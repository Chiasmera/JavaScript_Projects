import express from 'express'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'

const app = express()


app.use(express.static('filer'))

app.get('/', async (req, res)=> {
    const links = await generateLinks()
    res.send(links)
})


app.listen(3141, console.log('server listening on port 3141'))


async function generateLinks() {
    const fileNames = await fs.readdir('./filer')

    let htmlString = '<ul>'

    fileNames.forEach( (name) => {
        htmlString += `<li><a href='${name}'>${name}</a></li>`
    })
    htmlString += '</ul>'  

    return htmlString
}