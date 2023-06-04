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
    const allGames = await getGamesFromDB()
    res.render('gameListView', {games: allGames})
})

app.get('/shelf', (req, res) => {
    
    res.render('shelfOrganizerView', {test: testGetGame})
})


async function synchronizeWithDB () {
    console.log('Synchronizing with BGG');
    const syncStats = await synchronizeCollection('LuciusWriter', false)
    console.log(`Database synchronized. ${syncStats.addedGames} added or updated, ${syncStats.removedGames} removed.`);
}
synchronizeWithDB()

app.listen(3141, console.log('Server running on port 3141'))