import express from 'express'
import session from 'express-session'

//Global variables
const portNr = 3141
const dailyPass = 'hades'
const dailySecret = generateSecret()

//Initialize express
const app = express()

//User pug as view engine
app.set('view engine', 'pug')

//Middleware to serve static files
app.use(express.static('assets'))

app.use(express.json())

//Session initialization
app.use(session({
    secret : dailySecret,
    saveUninitialized:false,
    resave:true
}))


//Endpoints 
app.get('/', (req, res)=> {
    const name = req.session.name
    const gm = req.session.gm

    if (gm ) {
        res.render('gm', {user: name, gm:true})
    } else if (name) {
        res.render('player', {user:name, gm:false})
    } else {
        res.render('login', {user:'', gm:false})
    }    
})

app.post('/login', (req, res)=> {
    const data = req.body
    console.log(data);
    const pass = data.pass 
    const name = data.name
    if (pass && pass === dailyPass) {
        req.session.name = name
        req.session.gm = true
        console.log('login as GM');
        res.status(302)
        res.send()
    } else if (name) {
        req.session.name = name
        req.session.gm = false
        console.log('login as player: '+name);
        res.status(302)
        res.send()
    } else {
        req.session.destroy()
        console.log('no input values');
        res.status(401)
        res.send()
    }
    
})

app.get('/player', (req, res) => {
    res.render('player')

})

app.get('/gm', (req, res) => {
    res.render('gm')
})

//Server start
app.listen(3141, ()=> console.log(`Server started on port ${portNr}`))


//Functions
function generateSecret() {
    let secret = ''
    for(let i = 0; i < 20; i++) {
        secret += String(Math.floor(Math.random()*10))
    }
    return secret
}