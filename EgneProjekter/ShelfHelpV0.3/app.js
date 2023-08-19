const host = 'localhost'
const port = 80

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

    let games = [
        new Game(173346, 318316),
        new Game(1758, 31959),
        new Game(183231, 283480),
        new Game(270633, 441764),
        new Game(31260, 189116),
        new Game(161970, 245258),
        new Game(80642, 60524),

        new Game(173346, 318316),
        new Game(1758, 31959),
        new Game(183231, 283480),
        new Game(270633, 441764),
        new Game(31260, 189116),
        new Game(161970, 245258),
        new Game(80642, 60524),

        new Game(173346, 318316),
        new Game(1758, 31959),
        new Game(183231, 283480),
        new Game(270633, 441764),
        new Game(31260, 189116),
        new Game(161970, 245258),
        new Game(80642, 60524)
    ]

    games = await JSON.stringify(await fetchGamesFromBGG(games))
    res.send(games)
})

async function fetchGamesFromBGG (gameObjectarray) {
    const games = gameObjectarray 
    
    for (let game of games) {
        const xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1&versions=1`)
        const parser = new XMLParser(parserOptions)
        const parsedResult = await parser.parse(xml)

        game.img = String(parsedResult.items.item.image),
        game.thumbnail = String(parsedResult.items.item.thumbnail),
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

        //Assign dimensions
        let currentVersion = parsedResult.items.item.versions.item
        if (Array.isArray(currentVersion)) {
            for (let item of currentVersion) {        
                
                if (String(item.id) === String(game.versionID) ) {
                    currentVersion = item
                }
            }
        }
        
        if (parseFloat(currentVersion.width.value) > 0){
            game.x = parseFloat(currentVersion.width.value)  * 2.54
        } else {
            game.x = 29.6
        }
        if (parseFloat(currentVersion.depth.value) > 0){
            game.y =parseFloat(currentVersion.depth.value) * 2.54
        } else {
            game.y = 7.2
        }
        if (parseFloat(currentVersion.length.value) > 0){
            game.z =parseFloat(currentVersion.length.value) * 2.54
        } else {
            game.z = 29.6
        }  
        if (currentVersion.weight.value){
            game.mass = parseFloat(currentVersion.weight.value)
        } else {
            game.mass = parseFloat(0)
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
    constructor(id, versionID) {
        this.id = String(id),
        this.versionID = String(versionID)
    }
}

app.listen(port, console.log(`server running on ${port}`))