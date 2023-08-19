//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, getDoc, getDocs, setDoc, doc, deleteDoc, collection, Timestamp} from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { getCollection} from './BGG_Controller.js'

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

const dbGameCollection = collection(db, 'GameCollection')
const metadataDB = collection(db, 'metaData')

// OLD__________________________ 

/**
 * Gets all IDs from all games in the database
 * @returns array of IDs
 */
async function getIDsFromDB () {
    const gameDocs = await getDocs(dbGameCollection)
    let gamesIDs = gameDocs.docs.map( (gameDoc)=> {
        return String(gameDoc.id)
    })
    gamesIDs = [...new Set(gamesIDs)]
    return gamesIDs
}

/**
 * adds a game object to the database. If an entry with same id already exists, instead updates the entry.
 * @param {Game} gameObject a Game object
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
    await deleteDoc(doc(db, 'GameCollection', String(objectID))) 
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
 * Gets a set of IDs based on the Games in the collection
 * @param {Array[Game]} collection 
 * @returns 
 */
function getSetOfIDsFromCollection(collection) {
    let collectionIDs = collection.map( (object) => object.id )
    return [...new Set(collectionIDs)]
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
    let collection = await getCollection(username)
    let collectionIDs = getSetOfIDsFromCollection(collection)

    //Get IDS from DB
    const DBIDs = await getIDsFromDB()
 
    if (Array.isArray(collectionIDs) && Array.isArray(DBIDs)) {
        //Sort lists of IDs
        collectionIDs.sort()
        DBIDs.sort()

        //run while both lists still have unhandled elements
        while (collectionIDs.length > 0 && DBIDs.length > 0) {
            //if both current elements are equal, do nothing, go on to next elements in both lists
            if (collectionIDs[0] === DBIDs[0]) {
                //if fullSync is true, merge the new game into db anyway
                if (fullSync) {
                        // await new Promise(r => setTimeout(r, 1000));
                        // const currentGame = await getGame(collectionIDs[0])
                        // let object = collection.find( (object) => object.id === collectionIDs[0] )
                        // currentGame.boxSize = object.boxSize

                        let currentGame = collection.find( (object) => object.id === collectionIDs[0] )
                        await addGameToDB(currentGame)
                        added++
                }
                collectionIDs.shift()
                DBIDs.shift()

            //If the collection id is lesser, game does not exists in DB and should be added
            } else if (collectionIDs[0] < DBIDs[0]) {
                    let currentGame = collection.find( (object) => object.id === collectionIDs[0] )
                    await addGameToDB(currentGame)
                    collectionIDs.shift()
                    added++

            //otherwise, the db id is lesser, and game does not exist in collection. It should be removed
            } else {
                await deleteGameFromDB(DBIDs[0])
                DBIDs.shift()
                removed++
            }
        }

        //if there is still elements in collectionIDs, add those to the db
        while (collectionIDs.length > 0) {
            let currentGame = collection.find( (object) => object.id === collectionIDs[0] )
                await addGameToDB(currentGame)
                collectionIDs.shift()
                added++
        }

        //If there is still elements in DBIDs, remove those from DB
        while (DBIDs.length > 0) {
            await deleteGameFromDB(DBIDs[0])
            DBIDs.shift()
            removed++
        }
    } else {
        throw new Error('Either database list of IDs or collection list of IDs is not an array')
    }

    setLastSyncDate(new Date())

    return {addedGames: added, removedGames: removed}


}

/**
 * Return Timestamp of the last sync
 * @returns  Timestamp
 */
async function getLastSyncDate() {
    const updateRef = doc(db, "metaData", "update");
    const docSnap = await getDoc(updateRef);
    let update    
    if (docSnap.exists()) {
        update = await docSnap.data()
        return update.timestamp
    } else {
      throw new Error('cannot locate the update document in Firestore')
    }
}

/**
 * Sets the last sync date in the DB
 * @param {Date} Date a date
 */
async function setLastSyncDate (Date) {
    const timestamp = Timestamp.fromDate(Date) 
    await setDoc(doc(db, "metaData", "update"), {timestamp}, {merge: false});
}

export {synchronizeCollection, getLastSyncDate, setLastSyncDate}