//IMPORTS  -------------------------------------------------------------------------------------------
//Express import
import express, { response } from 'express'
const app = express()

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)



//Pug import
import pug from 'pug'
app.set('view engine', 'pug')


//global variables --------------------------------------------------------------------------------------
const gamecollection = collection(db, 'GameCollection')

//Middleware  -------------------------------------------------------------------------------------------
app.use(express.static('assets'))


//Endpoints
app.get('/', async (req, res)=> {
    const games = await getGames();
    res.render('home', {games: games})
    
})


//Functions----------------------------------------------------------------------------------------------
async function getGames() {
    const gameDocs = await getDocs(gamecollection)
    const games = gameDocs.docs.map( (gameDoc)=> {
        let data = gameDoc.data()
        data.objectID = gameDoc.id
        return data
    })
    return games
}

async function addGame (game) {
    let docRef = doc (db, 'GameCollection', game.objectID)
    docRef = await setDoc(docRef, game, {merge:true})
}


//Server start  -----------------------------------------------------------------------------------------
app.listen(3141, ()=> console.log('server running on port 3141'))

const tempGame = {title: 'testosterone', objectID: '12345678'}
let id = addGame(tempGame)