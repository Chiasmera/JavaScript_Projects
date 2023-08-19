const host = 'localhost'
const port = 80

//IMPORTS  -------------------------------------------------------------------------------------------
import { synchronizeCollection } from './FireBase_Controller.js';

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'
import { addGameToDB, getGamesFromDB, deleteGameFromDB, getIDsFromDB } from './FireBase_Controller.js';

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

//node-fetch import
import fetch from 'node-fetch'

//HTML parser?
import he from 'he'

//cors import
import cors from 'cors'

//express import
import express, { json } from 'express'
const app = express();

//fast-xml-parser import
const parserOptions = {
    ignoreAttributes: false,
    parseAttributeValue: true,
    attributeNamePrefix: "",
}
import { XMLParser } from 'fast-xml-parser'

//Set view engine
app.set('view engine', 'pug')

//Middleware
app.use(express.static('Assets'))
app.use(cors())
app.use(express.json())

//endpoints
app.get('/', async (req, res) => {
   
    res.render('home', {  })
})

app.get('/collection/:name', async (req, res) => {
    const username = req.params.name

    //TODO - check if collection already exists in databas before fetching
    const collectionXML = await fetchCollectionXMLFromBGG(username, false)
    const games = parseXMLtoGameObjects(collectionXML)
    console.log(games);

    games = await JSON.stringify(await fetchGamesFromBGG(games))
    res.send(games)
})

//other functions
async function synchronizeWithDB () {
    console.log('Synchronizing with BGG');
    const syncStats = await synchronizeCollection('LuciusWriter', false)
    console.log(`Database synchronized. ${syncStats.addedGames} added or updated, ${syncStats.removedGames} removed.`);
}



function parseXMLtoGameObjects (collectionXML) {
    const games = []
    for (let game of collectionXML.items.item) {       
        const id = game.objectid
        let versionID = 0
        let x = 29.6
        let y = 7.2
        let z = 29.6
        let mass = 0
        let img = ''
        let thumbnail = ''
        if (game.version) {
            versionID = game.version.item.id
            x = game.version.item.width * 2.54
            y = game.version.item.depth * 2.54
            z = game.version.item.length * 2.54
            mass = game.version.item.weight
            img = game.version.item.image
            thumbnail = game.version.item.thumbnail
        }

        games.push(new Game(id, versionID, x, y, z, mass))
    }
    return games

}

async function fetchCollectionXMLFromBGG(username, includeExpansion) {
    const expansionString = includeExpansion ? '' : '&excludesubtype=boardgameexpansion'
    const xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/collection?username=${username}${expansionString}&excludesubtype=boardgameexpansion&version=1`)
    const parser = new XMLParser(parserOptions)
    const parsedResult = await parser.parse(xml)
    return parsedResult
}

async function fetchGamesFromBGG (gameObjectarray) {
    console.log(gameObjectarray);
    const games = gameObjectarray 
    
    for (let game of games) {
        const xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1&versions=1`)
        const parser = new XMLParser(parserOptions)
        const parsedResult = await parser.parse(xml)

        if (!game.img) {
            game.img = String(parsedResult.items.item.image)
        }
        if (!game.img) {
           game.thumbnail = String(parsedResult.items.item.thumbnail)
        }
        
        game.minPlayers = parsedResult.items.item.minplayers.value,
        game.maxPlayers = parsedResult.items.item.maxplayers.value,
        game.minTime = parsedResult.items.item.minplaytime.value,
        game.maxTime = parsedResult.items.item.maxplaytime.value,
        game.officialTime = parsedResult.items.item.playingtime.value,
        game.description = String(he.decode(parsedResult.items.item.description)),
        game.publishYear = parsedResult.items.item.yearpublished.value,
        game.minAge = parsedResult.items.item.minage.value,
        game.mechanics = [],
        game.averageRating = parsedResult.items.item.statistics.ratings.average.value,
        game.rank = 0,
        game.weight =  parsedResult.items.item.statistics.ratings.averageweight.value

        //Assign title
        if (Array.isArray(parsedResult.items.item.name)) {
            game.title = he.decode(parsedResult.items.item.name[0].value)
        } else if (typeof parsedResult.items.item.name === 'object') {
            game.title = he.decode(parsedResult.items.item.name.value)
        } else {
            game.title = he.decode(parsedResult.items.item.name)
        }

        //calculate best number of player
        let pollBestPlayers = {number: -1, weight: 0}
        if (Array.isArray(parsedResult.items.item.poll[0].results)) {
            for (let results of parsedResult.items.item.poll[0].results) {
                let weight = ((results.result[0].numvotes*1.5) + results.result[1].numvotes - results.result[2].numvotes)
                if (weight > pollBestPlayers.weight) {
                    pollBestPlayers.number = results.numplayers
                    pollBestPlayers.weight = weight
                }
            }
            game.bestPlayers = pollBestPlayers.number
        } else {
            game.bestPlayers = -1
        }


        //calculate language dependency
        let pollLanguageDep = {desc: '', weight: 0}
        if (parsedResult.items.item.poll[2].results && Array.isArray(parsedResult.items.item.poll[2].results.result)) {
            for (let results of parsedResult.items.item.poll[2].results.result) {
                if (results.numvotes > pollLanguageDep.weight) {
                    pollLanguageDep.desc = he.decode(results.value)
                    pollLanguageDep.weight = results.numvotes
                }
            }
            game.languageDependence = pollLanguageDep.desc
        } else {
            game.languageDependence = ''
            console.log(parsedResult.items.item.poll[2].results);
        }

        //create array of mechanics
        for (let link of parsedResult.items.item.link) {
            if (link.type === "boardgamemechanic")
            game.mechanics.push(he.decode(link.value))
        }

        //Assign rank
        if (Array.isArray(parsedResult.items.item.statistics.ratings.ranks.rank)) {
            for (let entry of parsedResult.items.item.statistics.ratings.ranks.rank) {
                if (entry.friendlyname === "Board Game Rank") {
                    game.rank = entry.value
                }
            }
        } else {
            game.rank = parsedResult.items.item.statistics.ratings.ranks.rank.value
        }           
    }
    return games
}

 async function fetchXML (url) {
    let response = await fetch(url)
    
   if (response.status === 202) {
       let error  = new Error("Server busy, retry after delay. Status: "+response.status)
       error.status = 202
       throw error
   } else if (response.status === 429) {
        let error  = new Error("Request rate limit reached. Retry after delay. Status: "+response.status)
        error.status = 429
        throw error
    } else if (response.status !== 200) {
        let error  = new Error("Failed fetching collection XML data. Status: "+response.status)
        error.status = 429
        throw error
   } else {
       return await response.text()
   }
}

class Game {
    constructor(id, versionID, x, y, z, mass, img, thumbnail) {
        this.id = String(id)
        this.versionID = String(versionID)
        this.x = x
        this.y = y
        this.z = z
        this.mass = mass
        this.img = img
        this.thumbnail = thumbnail
    }
}


await synchronizeWithDB()
app.listen(port, console.log(`server running on ${port}`))