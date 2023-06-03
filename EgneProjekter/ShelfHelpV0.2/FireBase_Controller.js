//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, getDocs, setDoc, doc, deleteDoc, collection} from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

const dbGameCollection = collection(db, 'GameCollection')
const username = 'LuciusWriter'

/**
 * Gets all IDs from all games in the collection
 * @returns array of IDs
 */
async function getIDsFromDB () {
    const gameDocs = await getDocs(dbGameCollection)
    const gamesIDs = gameDocs.docs.map( (gameDoc)=> {
        return gameDoc.id
    })
    return gamesIDs
}

/**
 * adds a game object to the database. If an entry with same id already exists, instead updates the entry.
 * @param {Object} gameObject 
 */
async function addGameToDB (gameObject) {
    const id = gameObject.id
    await setDoc(doc(db, "GameCollection", String(id)), gameObject, {merge: true});
}

/**
 * Deletes a game from database
 * @param {Int} objectID 
 */
async function deleteGameFromDB(objectID) {
    await deleteDoc(doc(db, 'GameCollection', objectID)) 
}

/**
 * Get an array of all games from the database
 * @returns an array containing game objects
 */
async function getGamesFromDB() {
    const gameDocs = await getDocs(dbGameCollection)
    const games = gameDocs.docs.map( (gameDoc)=> {
        let data = gameDoc.data()
        data.objectID = gameDoc.id
        return data
    })
    return games
}

/**
 * syncs the database with the collection of the given user on BGG. Will add any new games to DB, and 
 * remove games no longer present in collection. If fullSync is true, will also compare each game for 
 * changes and update fields where needed
 * @param {String} username name of the user that owns the collection
 * @param {Boolean} fullSync boolean argument, if true the functions also syncs every field on every game.
 * @returns an object with properties removedGames and addedGames, containing the number of games added and removed
 */
async function synchronizeCollection (username, fullSync) {
    let added = 0;
    let removed = 0;

    //Get IDs for games in collection
    const collectionIDs = getCollectionIDs(username)

    //compare with IDs in DB
    //For each not in collection, but in DB
        //remove game in DB

    //if fullSync true
        //For each game in collection
            //fetch game info
            //add/update entry
    //else
        //For each not in DB, but in collection
            //fetch the game information
            //add the game to DB   
    return {addedGames: added, removedGames: removed}
}

export {getIDsFromDB, addGameToDB, deleteGameFromDB, getGamesFromDB}