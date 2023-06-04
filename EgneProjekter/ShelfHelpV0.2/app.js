//IMPORTS  -------------------------------------------------------------------------------------------
import { synchronizeCollection } from './FireBase_Controller.js';


//express import
import express from 'express'
const app = express();

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { addGameToDB, getGamesFromDB, deleteGameFromDB, getIDsFromDB } from './FireBase_Controller.js';

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

//Set view engine
app.set('view engine', 'pug')

//Middleware
app.use(express.static('assets'))

app.get('/', async (req, res) => {
    let allGames = await getGamesFromDB()
    res.render('gameListView', {games: allGames, sortBy: sortBy})
})

app.get('/shelf', (req, res) => {
    
    res.render('shelfOrganizerView', {test: testGetGame})
})

function sortBy (list, property) {
    let sample = list[0]
    if (property === 'title') {
        list.sort( (a, b) => {return a['title'].localeCompare(b['title'])})
    } else if (property === 'rating') {
        list.sort( (a, b) => {return b['averageRating'] - a['averageRating']})
    }  else if (property === 'time') {
        list.sort( (a, b) => {return ((a.minTime + a.maxTime)/2) - ((b.minTime + b.maxTime)/2)})
    } else if (typeof sample[property] === 'string') {
        list.sort( (a, b) => {return a[property].localeCompare(b[property])})
    } else {
        list.sort( (a, b) => {return a[property] - b[property]})
    }
}

async function synchronizeWithDB () {
    console.log('Synchronizing with BGG');
    const syncStats = await synchronizeCollection('LuciusWriter', false)
    console.log(`Database synchronized. ${syncStats.addedGames} added or updated, ${syncStats.removedGames} removed.`);
}
await synchronizeWithDB()

app.listen(3141, console.log('Server running on port 3141'))