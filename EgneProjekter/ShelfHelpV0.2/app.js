//IMPORTS  -------------------------------------------------------------------------------------------
import { getGame, getCollectionIDs } from './BGG_Controller.js';


//express import
import express from 'express'
const app = express();

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

//Set view engine
app.set('view engine', 'pug')

//Middleware
app.use(express.static('assets'))

const testGetGame = await getGame(173346)

app.get('/', (req, res) => {
    res.render('gameListView', {games: {test: testGetGame}})
})

app.get('/', (req, res) => {
    res.render('shelfOrganizerView', {test: testGetGame})
})

app.listen(3141, console.log('Server running on port 3141'))


async function main () {
}
main()