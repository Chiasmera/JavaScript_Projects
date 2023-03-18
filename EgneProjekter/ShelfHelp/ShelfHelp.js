
//Root API link: https://boardgamegeek.com/xmlapi2
//collection API link: /collection?username=NAME&excludesubtype=boardgameexpansion
//ting retrieval API link: /xmlapi2/thing?parameters

let username = 'LuciusWriter'
const LWCollection = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&excludesubtype=boardgameexpansion`
let itemArray;

async function getCollection (url) {
    let response = await fetch(url)
    if (response.status === 202) {
        //Prøv igen
        setTimeout(getCollection(url),10000)
        console.log('Server busy, retrying in 10 seconds')

    } else if (response.status !== 200) {
        throw new Error("fetch failed. Status: "+response.status)
    }
    return await response.text()
}

async function assignCollection(url) {
    return result = parseXml(await getCollection(url))
}

/**
 * Shamelessly stolen xml parser. Authors note: The following function parses XML and returns a JavaScript object with a scheme that corresponds to the XML. XML siblings w/ the same name are collapsed into arrays. nodes with names that can be found in the arrayTags parameter (array of tag name strings) always yield arrays even in case of only one tag occurrence. arrayTags can be omitted. Text nodes with only spaces are discarded.
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

function createHeader (collection) {
    let header = document.createElement('header')
    document.body.appendChild(header)

    let owner = document.createElement('h2')
    owner.textContent = `Owner: ${username}`
    header.appendChild(owner)

    let totalItems = document.createElement('h3')
    totalItems.textContent = `Total games (no expansions):   ${itemArray.length}`
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

    createRows(table);
}

async function createRows (table) {
    let index = 1;
        for ( let game of itemArray) {
            //Fetches data for game by id, and parses from XML to object
            const gameData = parseXml(await retrieveGameByID(game.objectid)).items.item
            if (index < 3){console.log(gameData);}
            

            //Creates row
            let gameRow = document.createElement('tr')
            table.appendChild(gameRow)

            //sets index of row
            let indexCell = document.createElement('td')
            indexCell.textContent = index++;
            gameRow.appendChild(indexCell)

            //Sets name cell
            let nameCell = document.createElement('td')
            if (typeof gameData.name[0] !== 'undefined') {
                nameCell.textContent = gameData.name[0].value
            } else {
                nameCell.textContent = gameData.name.value
            }
            gameRow.appendChild(nameCell)

            //Sets image
            let imageCell = document.createElement('td')
            let image = document.createElement('img')
            image.src = `${gameData.image['#text']}`
            imageCell.appendChild(image)
            gameRow.appendChild(imageCell)

            //Sets playernumber
            let numPlayerCell = document.createElement('td')
            numPlayerCell.textContent = `${gameData.minplayers.value} - ${gameData.maxplayers.value} (${findSuggestedPlayerNumber(gameData)})`
            numPlayerCell.style.textAlign = 'center'
            gameRow.appendChild(numPlayerCell)
    }
}


async function retrieveGameByID (id) {
    let response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`)
    if (response.status === 202) {
        //Prøv igen
        setTimeout(getCollection(url),10000)
        console.log('Server busy, retrying in 10 seconds')

    } else if (response.status !== 200) {
        throw new Error("fetch failed. Status: "+response.status)
    }
    return await response.text()
}

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

async function main () {
    temp = await assignCollection(LWCollection)
    itemArray = temp.items.item

    createHeader(itemArray)
    createTableOfGames()
    //console.log(itemArray);

}

main()




