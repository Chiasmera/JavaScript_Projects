const express = require('express')
const app = express()
const session = require('express-session')

//Middleware
app.use(express.static('assets'))
app.set('view engine', 'pug')
app.use(session({   secret: '454A1729-0515-44C3-A374-ED0B360Ec43F',
                    resave: true,
                    saveUninitialized : true
                    }))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(checkSecretPages)

//Endpoints
app.get('/', (req, res)=> {
    let isLoggedIn = false
    if (req.session.isLoggedIn) {
        isLoggedIn = true
    }
    res.render('home', {knownUser: isLoggedIn})
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (checkUser(username, password)) {
        req.session.isLoggedIn = true
    }
    res.redirect('/')
})

app.get('/secret', (req, res)=> {
    if (!req.session.isLoggedIn) {
        res.redirect('/')
    } else {
        res.render('secret', {knownUser : true})
    }
    
})

app.get('/logout', (req, res)=> {
    req.session.destroy()
    res.redirect('/')
})

//Server start
app.listen(3141, ()=> console.log('Server running on port 3142'))

//Functions
/**
 * Simulerer et databaseopslag af password
 * @param {*} username postede brugernavn
 * @param {*} password postede password
 */
function checkUser(username, password) {
    let returnvalue = false
    if(username === 'Hugo' && password === '123') {
        returnvalue = true
    }
    return returnvalue
}

function checkSecretPages(request, response, next) {
    let secretPages = '/secret'
    if (request.url === secretPages) {
      if (!request.session.isLoggedIn) {
        console.log('Forsøg på ulovlig indtrængen')
        response.redirect('/')
      } else {
        next()
      }
    } else {
        next()
    }
    
}