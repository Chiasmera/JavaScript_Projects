//IMPORTS  -------------------------------------------------------------------------------------------
//node-fetch import
import fetch from 'node-fetch'

//fast-xml-parser import
const parserOptions = {
    ignoreAttributes: false,
    parseAttributeValue: true,
    attributeNamePrefix: "",
}
import { XMLParser } from 'fast-xml-parser'

//METHODS  -------------------------------------------------------------------------------------------
/**
 * Collects the collection of games associated with the given user name and returns an array of ID for those games
 * @param {String} userName 
 * @returns An array of IDs
 */
 async function getCollectionIDs (userName) {
    const collection = await fetchFromBGG(`https://boardgamegeek.com/xmlapi2/collection?username=${userName}&excludesubtype=boardgameexpansion`)
    const parsedCollection = await parseXML(collection)
    const ids = parsedCollection.items.item.map( (item) => String(item.objectid) )
    return ids
}

/**
 * Calls the BGG API with the given ID and returns a Game object with the retrieved data
 * @param {Int} id 
 * @returns a Game object
 */
async function getGame (id) {
    const xml = await fetchFromBGG(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`)
    const gameObject = await parseXML(xml)

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
        mechanics: [],
        averageRating: gameObject.items.item.statistics.ratings.average.value,
        rank:  gameObject.items.item.statistics.ratings.ranks.rank[0].value,
        weight:  gameObject.items.item.statistics.ratings.averageweight.value
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

/**
 * Calls BGG API with the given URL and returns the raw XML text
 * @param {String} url 
 * @returns XML response from BGG API
 */
async function fetchFromBGG(url) {
    let response = await fetch(url)
   if (response.status === 202) {
       //Prøv igen
       response = await setTimeout( fetchXML(url),10000)
       console.log('Server busy, retrying in 10 seconds')

   } else if (response.status === 429) {
        console.log('request rate limited by server, retrying in 5 seconds');
        response = await setTimeout(fetchXML(url),5000)
    } else if (response.status !== 200) {
        throw new Error("Failed fetching collection XML data. Status: "+response.status)
   }
   return await response.text()
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

export {getGame, synchronizeCollection}