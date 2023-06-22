import express from 'express'
import session from 'express-session'


const app = express()
app.set('view engine', 'pug')

app.use(express.static('assets'))
app.use(session({
    secret : 'superhemmeligtlogin',
    saveUninitialized:false,
    resave:true
}))
app.use(express.json())



app.get('/', (req, res)=> {
    const loggedIn = req.session.loggedIn
    if (loggedIn !== true) {
        res.redirect('/login')
    } else {
        res.render('hemmelig')
    }
})

//Fanger redirects til login siden. Redirecter til roden hvis allerede logget ind
app.get('/login', (req, res)=> {
    const loggedIn = req.session.loggedIn
    if (loggedIn !== true) {
        res.render('login')
    } else {
        res.redirect('/')
    }
})

//Post med login-detaljer. Tjekker detaljer, hvis match sætter session.loggedIn og sender et ok tilbage. Ellers ædelægger session og redirecter til login
app.post('/login', (req, res)=> {
    const user = String(req.body.user).toLocaleLowerCase()
    const pass = String(req.body.pass).toLocaleLowerCase()
    if (user && pass === 'hades') {
        req.session.loggedIn = true
        res.send ({ ok: true })
    } else {
        req.session.destroy( () => res.redirect('/login'))
    }
})

app.post('/logout', (req, res)=> {
    req.session.destroy( () => res.redirect(250, '/'))

})


app.listen(3141, console.log('server running on port 3141'))