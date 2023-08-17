import express from "express";
import { render } from "pug"

const app = express()

app.set('view engine', 'pug')

//ENDPOINTS__________________________________________________________
app.get('/', (req, res)=>{
    res.render('test')
})

app.listen(8080, ()=>{ console.log('server running on port 8080') })