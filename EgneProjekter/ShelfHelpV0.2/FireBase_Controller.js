//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, getDocs, setDoc, doc, deleteDoc, collection} from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { getCollectionIDs, getGame } from './BGG_Controller.js'

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
        return String(gameDoc.id)
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
    const collectionIDs = await getCollectionIDs(username)

    //Get IDS from DB
    const DBIDs = await getIDsFromDB()
 
    if (Array.isArray(collectionIDs) && Array.isArray(DBIDs)) {
        //Sort lists of IDs
        collectionIDs.sort()
        DBIDs.sort()

        //Create counters to manage position in lists
        let collCounter = 0;
        let dbCounter = 0;

        // console.log(collectionIDs);
        // console.log(dbCounter);

        //run while both lists still have unhandled elements
        while (collCounter < collectionIDs.length && dbCounter < DBIDs.length) {


            //if both current elements are equal, do nothing, go on to next elements in both lists
            if (collectionIDs[collCounter] === DBIDs[dbCounter]) {
                collCounter++
                dbCounter++
                //if fullSync is true, merge the new game into db anyway
                if (fullSync) {
                    try {
                        const currentGame = await getGame(collectionIDs[collCounter])
                        await addGameToDB(currentGame)
                        added++
                    } catch (error) {
                        if (error.status === 429) {
                            console.log(error);
                        }else if (error.status === 429) {
                            console.log(error);
                        } else {
                            console.log(error);
                        }                        
                    }
                }
            //If the collection id is lesser, game does not exists in DB and should be added
            } else if (collectionIDs[collCounter] < DBIDs[dbCounter]) {
                try {
                    const currentGame = await getGame(collectionIDs[collCounter])
                    await addGameToDB(currentGame)
                    collCounter++
                    added++
                } catch (error) {
                    if (error.status === 429) {
                        console.log(error);
                    }else if (error.status === 429) {
                        console.log(error);
                    } else {
                        console.log(error);
                    }                    
                }
                
            //otherwise, the db id is lesser, and game does not exist in collection. It should be removed
            } else {
                await deleteGameFromDB(DBIDs[dbCounter])
                dbCounter++
                removed++
            }
        }

        //if there is still elements in collectionIDs, add those to the db
        while (collCounter < collectionIDs.length) {
           try {
                const currentGame = await getGame(collectionIDs[collCounter])
                addGameToDB(currentGame)
                collCounter++
            } catch (error) {
                if (error.status === 429) {
                    console.log(error);
                }else if (error.status === 429) {
                    console.log(error);
                } else {
                    console.log(error);
                }                    
            }
        }

        //If there is still elements in DBIDs, remove those from DB
        while (dbCounter <= DBIDs.length) {
            deleteGameFromDB(DBIDs[dbCounter])
            dbCounter++
        }
    }

    return {addedGames: added, removedGames: removed}
}

export {getIDsFromDB, addGameToDB, deleteGameFromDB, getGamesFromDB, synchronizeCollection}