//IMPORTS  -------------------------------------------------------------------------------------------
//node-fetch import
import fetch from 'node-fetch'


//Express import
import express from 'express'
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

//fast-xml-parser import
const parserOptions = {
                        ignoreAttributes: false,
                        parseAttributeValue: true
                    }
import { XMLParser } from 'fast-xml-parser'


//global variables --------------------------------------------------------------------------------------
const dbGameCollection = collection(db, 'GameCollection')
const username = 'LuciusWriter'

//Middleware  -------------------------------------------------------------------------------------------
app.use(express.static('assets'))


//Endpoints
app.get('/', async (req, res)=> {
    const games = await getGames();
    res.render('home', {games: games})
    
})


//Functions----------------------------------------------------------------------------------------------
async function getGames() {
    const gameDocs = await getDocs(dbGameCollection)
    const games = gameDocs.docs.map( (gameDoc)=> {
        let data = gameDoc.data()
        data.objectID = gameDoc.id
        return data
    })
    return games
}

async function getDBGamesIDs () {
    const gameDocs = await getDocs(dbGameCollection)
    const gamesIDs = gameDocs.docs.map( (gameDoc)=> {
        return gameDoc.id
    })
    return gamesIDs
}

async function addGameToDB (gameObject) {
    const id = gameObject.items.item['@_id']
    await setDoc(doc(db, "GameCollection", String(id)), gameObject, {merge: true});

}

async function deleteGameFromDB(objectID) {
    await deleteDoc(doc(db, 'GameCollection', objectID)) 
}

async function fetchXML(url) {
    let response = await fetch(url)
   if (response.status === 202) {
       //Prøv igen
       setTimeout(fetchXML(url),10000)
       console.log('Server busy, retrying in 10 seconds')

   } else if (response.status !== 200) {
       throw new Error("Failed fetching collection CML data.. Status: "+response.status)
   }
   return await response.text()
}

async function parseXMLToObject(XML) {
    const parser = new XMLParser(parserOptions)
    const gameObject = parser.parse(XML)
    return gameObject
}

async function getGameObject (objectID) {
    const gameXML = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${objectID}`)
    let gameObject = await parseXMLToObject(gameXML)
    return gameObject
}

async function bggSync (username) {
    let removedGames = 0;
    let addedGames = 0;
    //get collection from BGG
    const collectionXML = await fetchXML(`https://boardgamegeek.com/xmlapi2/collection?username=${username}&excludesubtype=boardgameexpansion`)
    const collectionObject = await parseXMLToObject(collectionXML)
    //extract objectIDs from collection
    const bggIDs = collectionObject.items.item.map( (item) => item['@_objectid'] )

    //Get all IDs in database
    const dbIDs = await getDBGamesIDs();

    //Remove from DB those not in collection.

    if (Array.isArray(dbIDs) && Array.isArray(bggIDs)) {
        dbIDs.forEach(async (dbID)=> {
            if (!bggIDs.includes(dbID)) {
                //remove this game from DB
                await deleteGameFromDB(dbID)
                removedGames++
            }
        })

        bggIDs.forEach( async (bggID) => {
            if (!dbIDs.includes(bggID)) {
                //fetch data from BGG
                const gameObject = await getGameObject(bggID)
                //add object to DB
                await addGameToDB(gameObject)
                addedGames++
            }
        })
        
    } else {
        console.log('dbIDs or bggIDs is not an array, but it should be');
    }
    console.log(`BGG sync complete. ${addedGames} games added to collection, ${removedGames} games removed`);
}


//Server start  -----------------------------------------------------------------------------------------

async function main () {

    await bggSync(username)  
    
}


app.listen(3141, ()=> console.log('server running on port 3141'))

main()



