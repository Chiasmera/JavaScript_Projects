const baseURL = 'https://randomuser.me/api/'
// const url = 'https://randomuser.me/api/?nat=dk&results=' + batchSize

const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.set('view engine', 'pug')

app.use(express.static('assets'))


async function getData(url) {
    let data = await fetch(url)
    if (data.status !== 200) {
        throw new Error('datafetch failed: '+data.status)
    }
    return await data.json();
}

app.get('/:nat/:amount', async (req, res) => {
    const nat = req.params.nat
    const amount = req.params.amount
    if (nat === 'gb' || nat === 'dk' || nat === 'de' || nat === 'fr') {
        if (amount >= 10 && amount <= 100) {
            const data = await getData(baseURL + '?nat='+nat+'&results='+amount)
            res.render('dataTable', {title: 'users', data: data})
        } else {
            res.send('invalid amount')
        }
    } else {
        res.send('Invalid nationality')
    } 

})

//Root endpoint
app.get('/', async (req, res) => {
    const data = await getData(baseURL)
    res.render('dataTable', {title: 'users', data: data})

})







//Create listener på port 3141 and log message about server running
app.listen(3141)
console.log('Server running')