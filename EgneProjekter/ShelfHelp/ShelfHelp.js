
//Root API link: https://boardgamegeek.com/xmlapi2
//collection API link: /collection?username=NAME&excludesubtype=boardgameexpansion
//ting retrieval API link: /xmlapi2/thing?parameters

let username = 'LuciusWriter'
const collectionURL = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&excludesubtype=boardgameexpansion`
let itemArray;
let collection = {};
let lastTimeFetched;

/**
 * Fetches the XML repressenting a users collection returned from BGG's API2
 * @param {*} url 
 * @returns 
 */
async function getCollection (url) {
         let response = await fetch(url)
        if (response.status === 202) {
            //Prøv igen
            setTimeout(getCollection(url),10000)
            console.log('Server busy, retrying in 10 seconds')

        } else if (response.status !== 200) {
            throw new Error("Collection fetch failed. Status: "+response.status)
        }
        return await response.text()
}



/**
 * Fetches the collection of a specific user from BGG, and parses the returned XML as an js object.
 * @param {*} url API call to a users collection
 */
async function fetchCollection (url) {
    let rawResponse = parseXml(await getCollection(url)).items
    
    collection.size = rawResponse.totalitems
    collection.owner = username
    collection.games = []
    for (let item of rawResponse.item) {

        let fetchedRawItem = await parseXml(await retrieveGameByID(item.objectid)).items.item

        currentGame = {
            id : item.objectid,
            name : typeof fetchedRawItem.name[0] !== 'undefined'? fetchedRawItem.name[0].value : fetchedRawItem.name.value,
            image : fetchedRawItem.image['#text'],
            thumbnail : item.thumbnail['#text'],
            minPlayers : parseInt(fetchedRawItem.minplayers.value),
            maxPlayers : parseInt(fetchedRawItem.maxplayers.value),
            recommendedPlayers : parseInt(findSuggestedPlayerNumber(fetchedRawItem)),
            minTime : parseInt(fetchedRawItem.minplaytime.value),
            maxTime : parseInt(fetchedRawItem.maxplaytime.value),
            playingTime : parseInt(fetchedRawItem.playingtime.value),
            languageDependence : findLanguageDependence(fetchedRawItem),
            description : fetchedRawItem.description['#text']

            

        }
        collection.games.push(currentGame)
    }    
}

/**
 * Shamelessly stolen xml parser, that needs to be rewritten when you learn more XML. 
 * Authors note: The following function parses XML and returns a JavaScript object with a scheme that 
 * corresponds to the XML. XML siblings w/ the same name are collapsed into arrays. nodes with names 
 * that can be found in the arrayTags parameter (array of tag name strings) always yield arrays even in 
 * case of only one tag occurrence. arrayTags can be omitted. Text nodes with only spaces are discarded.
 * @param {*} xml xml string to convert to an object
 * @param {*} arrayTags Not necessary. Not sure what it does
 * @returns Object formatted like the xml
 */
function parseXml(xml, arrayTags) {
    let dom = null;
    if (window.DOMParser) dom = (new DOMParser()).parseFromString(xml, "text/xml");
    else if (window.ActiveXObject) {
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) throw dom.parseError.reason + " " + dom.parseError.srcText;
    }
    else throw new Error("cannot parse xml string!");

    function parseNode(xmlNode, result) {
        if (xmlNode.nodeName == "#text") {
            let v = xmlNode.nodeValue;
            if (v.trim()) result['#text'] = v;
            return;
        }

        let jsonNode = {},
            existing = result[xmlNode.nodeName];
        if (existing) {
            if (!Array.isArray(existing)) result[xmlNode.nodeName] = [existing, jsonNode];
            else result[xmlNode.nodeName].push(jsonNode);
        }
        else {
            if (arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1) result[xmlNode.nodeName] = [jsonNode];
            else result[xmlNode.nodeName] = jsonNode;
        }

        if (xmlNode.attributes) for (let attribute of xmlNode.attributes) jsonNode[attribute.nodeName] = attribute.nodeValue;

        for (let node of xmlNode.childNodes) parseNode(node, jsonNode);
    }

    let result = {};
    for (let node of dom.childNodes) parseNode(node, result);

    return result;
}

function createHeader () {
    let header = document.createElement('header')
    document.body.appendChild(header)

    let owner = document.createElement('h2')
    owner.textContent = `Owner: ${collection.owner}`
    header.appendChild(owner)

    let totalItems = document.createElement('h3')
    totalItems.textContent = `Total games (no expansions):   ${collection.size}`
    header.appendChild(totalItems)
}

function createTableOfGames () {
    let table = document.createElement('table')
    document.body.appendChild(table)

    let headerRow = document.createElement('tr')
    table.appendChild(headerRow)

    let indexHeader = document.createElement('th')
    indexHeader.textContent = '#'
    headerRow.appendChild(indexHeader)

    let nameHeader = document.createElement('th')
    nameHeader.textContent = 'Name'
    headerRow.appendChild(nameHeader)

    let imageHeader = document.createElement('th')
    imageHeader.textContent = 'Image'
    headerRow.appendChild(imageHeader)

    let playerNumberHeader = document.createElement('th')
    playerNumberHeader.textContent = 'Number of Players (best with)'
    headerRow.appendChild(playerNumberHeader)

    let playtimeHeader = document.createElement('th')
    playtimeHeader.textContent = 'Playtime'
    headerRow.appendChild(playtimeHeader)


    createRows(table);
}

async function createRows (table) {
    let index = 1;
        for ( let game of collection.games) {
            //Fetches data for game by id, and parses from XML to object
            
            //Creates row
            let gameRow = document.createElement('tr')
            table.appendChild(gameRow)

            //sets index of row
            let indexCell = document.createElement('td')
            indexCell.textContent = index++;
            indexCell.className = 'index'
            gameRow.appendChild(indexCell)

            //Sets name cell
            let nameCell = document.createElement('td')
            nameCell.textContent = game.name
            gameRow.appendChild(nameCell)

            //Sets image
            let imageCell = document.createElement('td')
            let image = document.createElement('img')
            image.src = game.image
            imageCell.appendChild(image)
            gameRow.appendChild(imageCell)

            //Sets playernumber
            let numPlayerCell = document.createElement('td')
            numPlayerCell.textContent = `${game.minPlayers} - ${game.maxPlayers} (${game.recommendedPlayers})`
            numPlayerCell.style.textAlign = 'center'
            gameRow.appendChild(numPlayerCell)

            //Sets playtime
            let playtimeCell = document.createElement('td')
            if (game.minTime === game.maxTime) {
                playtimeCell.textContent = `${game.maxTime}`
            } else {
                playtimeCell.textContent = `${game.minTime} - ${game.maxTime}`
            }
            
            playtimeCell.style.textAlign = 'center'
            gameRow.appendChild(playtimeCell)

    }
}

/**
 * Retrieves a game from BGG by its objectid
 * @param {objectid} id the objectid of a boardgame on BGG 
 * @returns XML string representation of the board game object
 */
async function retrieveGameByID (id) {
 
        let response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`)
        let retryCounter = 0;
        if (response.status === 202) {
            //Prøv igen
            setTimeout(getCollection(url),10000)
            console.log('Server busy, retrying in 10 seconds')

        } else if (response.status !== 200) {
            if (retryCounter < 3) {
                setTimeout(retrieveGameByID(id), 2000)
                retryCounter++;
            } else {
                throw new Error("fetch failed. Status: "+response.status)
            }
            
        }
        return await response.text()

    
}

/**
 * Returns the amount of players with the most votes in the "best" category, in the given XML parsed BGG representation of a game
 * @param {*} gameObject 
 * @returns 
 */
function findSuggestedPlayerNumber(gameObject) {
    let poll = gameObject.poll[0].results.reduce( (acc, current) => {
        if (parseInt(current.result[0].numvotes) >= parseInt(acc.result[0].numvotes)) {
            return current   
        } else {
            return acc
        }     
    } )

    return poll.numplayers
}

/**
 * Returns an object with the description and number of votes of the most voted-upon option for language dependency, in the given XML parsed BGG representation of a game
 * @param {*} gameObject 
 * @returns object with a string description and an int number of votes
 */
function findLanguageDependence(gameObject) {
    let poll = gameObject.poll[2].results.result.reduce( (acc, current) => {
        if (parseInt(current.numvotes) >= parseInt(acc.numvotes)) {
            return current  
        } else {
            return acc
        }     
    } )

    let object = {
        description : poll.value,
        votes : poll.numvotes
    }
    

    return object

}


/**
 * Executes when the script is run
 * @param {*} url URl wor a user collection of board games
 */
async function main (url) {
    try {
        await fetchCollection(url)
        console.log(collection.games)
            
        } catch (error) {
        console.log('Caught error: '+error)  
    }
 
    createHeader();
    createTableOfGames()
}


main(collectionURL)





