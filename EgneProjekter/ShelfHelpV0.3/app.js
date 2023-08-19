const host = 'localhost'
const port = 80

//IMPORTS  -------------------------------------------------------------------------------------------
import { synchronizeCollection } from './FireBase_Controller.js';

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { addGameToDB, getGamesFromDB, deleteGameFromDB, getIDsFromDB } from './FireBase_Controller.js';

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

//node-fetch import
import fetch from 'node-fetch'

//HTML parser?
import he from 'he'

//cors import
import cors from 'cors'

//express import
import express, { json } from 'express'
const app = express();

//fast-xml-parser import
const parserOptions = {
    ignoreAttributes: false,
    parseAttributeValue: true,
    attributeNamePrefix: "",
}
import { XMLParser } from 'fast-xml-parser'

//Set view engine
app.set('view engine', 'pug')

//Middleware
app.use(express.static('Assets'))
app.use(cors())
app.use(express.json())

//endpoints
app.get('/', async (req, res) => {
   
    res.render('home', {  })
})

app.get('/collection/:name', async (req, res) => {
    const username = req.params.name

    //TODO - check if collection already exists in databas before fetching
    // const collectionXML = await fetchCollectionXMLFromBGG(username, false)
    // const games = parseXMLtoGameObjects(collectionXML)
    // console.log(games);

    // games = await JSON.stringify(await fetchGamesFromBGG(games))
    // res.send(games)
})

//other functions
async function synchronizeWithDB () {
    console.log('Synchronizing with BGG');
    const syncStats = await synchronizeCollection('LuciusWriter', false)
    console.log(`Database synchronized. ${syncStats.addedGames} added or updated, ${syncStats.removedGames} removed.`);
}


class Game {
    constructor(id, versionID, x, y, z, mass, img, thumbnail) {
        this.id = String(id)
        this.versionID = String(versionID)
        this.x = x
        this.y = y
        this.z = z
        this.mass = mass
        this.img = img
        this.thumbnail = thumbnail
    }
}


await synchronizeWithDB()
app.listen(port, console.log(`server running on ${port}`))