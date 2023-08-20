const host = 'localhost'
const port = 80
const username = 'LuciusWriter'

//IMPORTS  -------------------------------------------------------------------------------------------
//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { synchronizeCollection, setLastSyncDate, getLastSyncDate } from './FireBase_Controller.js';

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

//cors import
import cors from 'cors'

//express import
import express, { json } from 'express'
const app = express();


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
async function synchronizeWithDB (username) {
    console.log('Synchronizing with BGG');
    const syncStats = await synchronizeCollection(username, false)
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


const now = Timestamp.fromDate(new Date()).toMillis()
let lastSync =await getLastSyncDate()
lastSync = lastSync.toMillis()


if ( (now - lastSync) / 1000 / 60 / 60  > 0) {
    await synchronizeWithDB(username, false)
} else {
    console.log(`Did not sync database.`);
    console.log(`Hours since last sync : ${(now - lastSync) / 1000 / 60 / 60}`);
}

app.listen(port, console.log(`server running on ${port}`))