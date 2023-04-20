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
        data.objectID = gameDoc.id
        return data
    })
    return gamesIDs
}

async function addGameToDB (game) {
    let docRef = doc (db, 'GameCollection', game.objectID)
    docRef = await setDoc(docRef, game, {merge:true})
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
    dbIDs.array.forEach(dbID => {
        const index = bggIDs.indexOf(dbID)
        if (index === -1) {
            //remove this game from DB
            //TODO 
                       
        } else {
            //remove ID from bggIDs
            bggIDs.splice(index, 1)
        }
    });
    //Rest of bggIDS are not in DB:
            //fetch data from BGG
          //  const gameXML = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${objectid}`)
          //  const gameObject = await parseXMLToObject(gameXML)
            //add object to DB
         //   addGameToDB(gameObject)
            

    console.log(`BGG sync complete. ${addedGames} games added to collection, ${removedGames} games removed`);
}


//Server start  -----------------------------------------------------------------------------------------


const tempGame = {title: 'testosterone', objectID: '12345678'}
let id = addGameToDB(tempGame)

async function main () {
    //7 wonders object id = 173346
    await bggSync(username)  
    
}


app.listen(3141, ()=> console.log('server running on port 3141'))
main()



