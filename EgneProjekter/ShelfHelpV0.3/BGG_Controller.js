//IMPORTS  -------------------------------------------------------------------------------------------
//node-fetch import
import fetch from 'node-fetch'
import he from 'he'

//fast-xml-parser import
const parserOptions = {
    ignoreAttributes: false,
    parseAttributeValue: true,
    attributeNamePrefix: "",
}
import { XMLParser } from 'fast-xml-parser'

//CONSTANTS & CLASSES -------------------------------------------------------------------------------------------
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

//METHODS  -------------------------------------------------------------------------------------------
/**
 * fetches raw XML from the given url and returns the response body
 * @param {URL} url 
 * @returns 
 */
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

/**
 * Fetches collection from BGG and returns it parsed from xml to javascript object
 * @param {String} username Username of the collections owner
 * @param {*} includeExpansion true if the collection should include expansions
 * @returns a js object parsed firectly from the xml
 */
async function fetchCollectionXMLFromBGG(username, includeExpansion) {
    const expansionString = includeExpansion ? '' : '&excludesubtype=boardgameexpansion'
    const xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/collection?username=${username}${expansionString}&excludesubtype=boardgameexpansion&version=1`)
    return await parseXML(xml)
}

/**
 * Parses a BGG Collection to a list of Game objects
 * @param {Collection Object} collectionXML javascript object representing a BGG collection parsed from XML
 * @returns an Array of simple Game objects
 */
function parseCollectiontoGameObjects (collectionXML) {
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

/**
 * Fetches additional details for a Game object, then mutates that Game with the new date
 * @param {Game} game a Game object
 */
async function fetchGameDetails (game) {
    const xml = await fetchXML(`https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1&versions=1`)
    const parsedResult = await parseXML(xml)
    
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

/**
 * Loops through Game array and fetches additional data for each game. Has a delay between requests to respect rate limit
 * @param {Array[Game]} gameArray an Array of Game objects
 * @returns mutated version of the provided Game array, with additional data for ever game
 */
async function filloutGameList (gameArray) {
    console.log(gameArray);
    const games = gameArray 
    
    for (let game of games) {
        await new Promise(r => setTimeout(r, 500));
        fetchGameDetails(game)
    }
    return games
}

/**
 * translates XML from BGG to a javascript object
 * @param {String} xml XML string retrieved from Board Game Geek
 * @returns a javascript object
 */
async function parseXML(xml) {
    const parser = new XMLParser(parserOptions)
    const resultObject = await parser.parse(xml)
    return resultObject
}

async function getCollection(username, includeExpansions) {
    const XML = fetchCollectionXMLFromBGG(username, includeExpansions)
    const collection = parseCollectiontoGameObjects(XML)
    const detailedCollection = filloutGameList(collection)
    return detailedCollection
}


export {getCollection}