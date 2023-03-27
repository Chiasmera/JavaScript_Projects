//Initialize Express & Pug
const express = require ('express')
const app = express()

app.use(express.static('assets'))
app.use('/biler', require('./cars'))

app.set('view engine', 'pug')

//Root endpoint
app.get('/', (req, res) => {
    let cats = [{name: 'Ilse', imageName:'cat1.jpg'}, {name:'Bent', imageName:'cat2.jpg'}, {name:'Garfield', imageName:'cat3.jpg'}]
    res.render('index', {title: 'Dette er en titel på en webpage', name: 'Ole-Bength', cats : cats})

})





//Create listener på port 3141 and log message about server running
app.listen(3141)
console.log('Server running')