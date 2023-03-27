const username = 'LuciusWriter'
const collectionURL = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&excludesubtype=boardgameexpansion`

/**
 * Fetches XML from a URL call to BGGs API
 * @param {URL} url 
 * @returns XML representation of the fetched data
 */
async function fetchXML (url) {
    let response = await fetch(url)
   if (response.status === 202) {
       //Prøv igen
       setTimeout(getCollection(url),10000)
       console.log('Server busy, retrying in 10 seconds')

   } else if (response.status !== 200) {
       throw new Error("Failed fetching collection CML data.. Status: "+response.status)
   }
   return await response.text()
}

function getIDsFromCollection (xmlCollection) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlCollection, 'text/xml')
    let itemList = xmlDoc.getElementsByTagName('item')
    const itemAttributeNames = itemList[0].getAttributeNames();
    console.log(itemAttributeNames)
    let boardGames = [];
    for (let item of itemList) {
        let game = {}
        for (let name of itemAttributeNames) {
            game.name = item.getAttribute(name)
        }

    }


    
    return item[0].getAttributeNames()

}

async function main() {
    
    let output = await fetchXML(collectionURL)
    let ids = getIDsFromCollection(output)

    console.log(ids);
}

main()
