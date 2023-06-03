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
 * @param {String} id 
 * @returns a Game object
 */
async function getGame (id) {
    try{
        const xml = await fetchFromBGG(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`)
        const gameObject = await parseXML(xml)
        if (gameObject.items.item === undefined) {
            throw new Error(`Empty object recieved from BGG fetch.`)
        }
        

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
            rank:  '',
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
        if (Array.isArray(gameObject.items.item.poll[0].results)) {
            for (let results of gameObject.items.item.poll[0].results) {
                let weight = ((results.result[0].numvotes*1.5) + results.result[1].numvotes - results.result[2].numvotes)
                if (weight > pollBestPlayers.weight) {
                    pollBestPlayers.number = results.numplayers
                    pollBestPlayers.weight = weight
                }
            }
            simplifiedObject.bestPlayers = pollBestPlayers.number
        } else {
            simplifiedObject.bestPlayers = ''
        }


        //calculate language dependency
        let pollLanguageDep = {desc: 'no result', weight: 0}
        if (gameObject.items.item.poll[2].results && Array.isArray(gameObject.items.item.poll[2].results.result)) {
            for (let results of gameObject.items.item.poll[2].results.result) {
                if (results.numvotes > pollLanguageDep.weight) {
                    pollLanguageDep.desc = results.value
                    pollLanguageDep.weight = results.numvotes
                }
            }
            simplifiedObject.languageDependence = pollLanguageDep.desc
        } else {
            simplifiedObject.languageDependence = ''
            console.log(gameObject.items.item.poll[2].results);
        }

        //create array of mechanics

        for (let link of gameObject.items.item.link) {
            if (link.type === "boardgamemechanic")
            simplifiedObject.mechanics.push(link.value)
        }

        //Assign rank
        if (Array.isArray(gameObject.items.item.statistics.ratings.ranks.rank)) {
            for (let entry of gameObject.items.item.statistics.ratings.ranks.rank) {
                if (entry.friendlyname === "Board Game Rank") {
                    simplifiedObject.rank = entry.value
                }
            }
        } else {
            simplifiedObject.rank = gameObject.items.item.statistics.ratings.ranks.rank.value
        }

        return simplifiedObject
    } catch (error) {
        throw error                  
    }

    

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
    await new Promise(r => setTimeout(r, 500));

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



export {getGame, getCollectionIDs}