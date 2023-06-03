//IMPORTS  -------------------------------------------------------------------------------------------
import { getGame} from './BGG_Controller.js';


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

// const testGetGame = await getGame(173346)

app.get('/', async (req, res) => {
    const allGames = await getGamesFromDB()
    res.render('gameListView', {games: allGames})
})

app.get('/shelf', (req, res) => {
    res.render('shelfOrganizerView', {test: testGetGame})
})

app.listen(3141, console.log('Server running on port 3141'))


async function synchronizeWithDB () {

}
synchronizeWithDB()