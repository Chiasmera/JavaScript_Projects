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
                        parseAttributeValue: true,
                        attributeNamePrefix: "",
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

app.get('/test', async (req, res)=> {
    const games = await getGames();
    res.redirect('/')
    
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
    const id = gameObject.id
    await setDoc(doc(db, "GameCollection", String(id)), gameObject, {merge: true});

}

async function deleteGameFromDB(objectID) {
    await deleteDoc(doc(db, 'GameCollection', objectID)) 
}

async function fetchXML(url) {
    let response = await fetch(url)
   if (response.status === 202) {
       //Prøv igen
       response = await setTimeout( fetchXML(url),10000)
       console.log('Server busy, retrying in 10 seconds')

   } else if (response.status === 429) {
        console.log('request rate limited by server, retrying in 5 seconds');
        response = await setTimeout(fetchXML(url),5000)
    } else if (response.status !== 200) {
        throw new Error("Failed fetching collection CML data. Status: "+response.status)
   }
   return await response.text()
}

async function parseXMLToObject(XML) {
    const parser = new XMLParser(parserOptions)
    const gameObject = parser.parse(XML)
    return gameObject.items
}

async function parseGameXMLToObject (xml) {
    const parser = new XMLParser(parserOptions)
    const gameObject = parser.parse(xml)
    const simplifiedObject = {
        id: String(gameObject.items.item.id),
        img: gameObject.items.item.image,
        thumbnail: gameObject.items.item.thumbnail,
        minPlayers: gameObject.items.item.minplayers.value,
        maxPlayers: gameObject.items.item.maxplayers.value,
        minTime: gameObject.items.item.minplaytime.value,
        maxTime: gameObject.items.item.maxplaytime.value,
        officialTime: gameObject.items.item.playingtime.value,
        description: gameObject.items.item.description,
        publishYear: gameObject.items.item.yearpublished.value,
        minAge: gameObject.items.item.minage.value,
        mechanics: []

    }
    //Assign title
    if (Array.isArray(gameObject.items.item.name)) {
        simplifiedObject.title = gameObject.items.item.name[0].value
    } else if (typeof gameObject.items.item.name === 'object') {
        simplifiedObject.title = gameObject.items.item.name.value
    } else {
        simplifiedObject.title = gameObject.items.item.name
    }

    //calculate best number of player
    let pollBestPlayers = {number: 'no result', weight: 0}
    for (let results of gameObject.items.item.poll[0].results) {
        let weight = ((results.result[0].numvotes*1.5) + results.result[1].numvotes - results.result[2].numvotes)
        if (weight > pollBestPlayers.weight) {
            pollBestPlayers.number = results.numplayers
            pollBestPlayers.weight = weight
        }
    }
    simplifiedObject.bestPlayers = pollBestPlayers.number

    //calculate language dependency
    let pollLanguageDep = {desc: 'no result', weight: 0}
    for (let results of gameObject.items.item.poll[2].results.result) {
        if (results.numvotes > pollLanguageDep.weight) {
            pollLanguageDep.desc = results.value
            pollLanguageDep.weight = results.numvotes
        }
    }
    simplifiedObject.languageDependence = pollLanguageDep.desc

    //create array of mechanics

    for (let link of gameObject.items.item.link) {
        if (link.type === "boardgamemechanic")
        simplifiedObject.mechanics.push(link.value)
    }

    return simplifiedObject
}

async function getGameObject (objectID) {
    const gameXML = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${objectID}`)
    let gameObject = await parseGameXMLToObject(gameXML)
    return gameObject
}

async function bggSync (username) {
    let removedGames = 0;
    let addedGames = 0;
    //get collection from BGG
    const collectionXML = await fetchXML(`https://boardgamegeek.com/xmlapi2/collection?username=${username}&excludesubtype=boardgameexpansion`)
    const collectionObject = await parseXMLToObject(collectionXML)
    //extract objectIDs from collection
    const bggIDs = collectionObject.item.map( (item) => String(item.objectid) )

    //Get all IDs in database
    const dbIDs = await getDBGamesIDs();
    
    if (Array.isArray(dbIDs) && Array.isArray(bggIDs)) {
        //Remove from DB those not in collection.
        dbIDs.forEach(async (dbID)=> {
            if (!bggIDs.includes(dbID)) {
                //remove this game from DB
                removedGames++
                await deleteGameFromDB(dbID)
                
                
            }
        })

        //Add to DB those in collection, but not yet in DB
        bggIDs.forEach( async (bggID) => {
            if (!dbIDs.includes(bggID)) {
                //fetch data from BGG
                const gameObject = await getGameObject(bggID)
                //add object to DB
                addedGames++
                await addGameToDB(gameObject)
                
            }
        })
        
    } else {
        console.log('dbIDs or bggIDs is not an array, but it should be');
    }
    await console.log(`BGG sync complete. ${addedGames} games added to collection, ${removedGames} games removed`);
}


//Server start  -----------------------------------------------------------------------------------------

async function main () {

    await bggSync(username)  
    // let xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=105`)
    // console.log(xml);
    // let object = await parseGameXMLToObject(xml)
    // console.log(object);
    
}


app.listen(3141, ()=> console.log('server running on port 3141'))

main()



