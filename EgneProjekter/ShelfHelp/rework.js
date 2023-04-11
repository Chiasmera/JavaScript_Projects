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
       setTimeout(fetchXML(url),10000)
       console.log('Server busy, retrying in 10 seconds')

   } else if (response.status !== 200) {
       throw new Error("Failed fetching collection CML data.. Status: "+response.status)
   }
   return await response.text()
}

async function fetchCollectionIDs (collectionURL) {
    let output = await fetchXML(collectionURL)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(output, 'text/xml')
    let itemList = xmlDoc.getElementsByTagName('item')
    const itemAttributeNames = itemList[0].getAttributeNames();

    let boardGames = [];
    for (let item of itemList) {
        let game = {}
        for (let name of itemAttributeNames) {
            game[name] = item.getAttribute(name)
        }
        boardGames.push(game)
    }
    return boardGames

}

async function populateGameWithInfo(id, game) {
    const gameURL = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`
    const gameXML = await fetchXML(gameURL)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(gameXML, 'text/xml')
    const xmlItem = xmlDoc.children
    console.log(xmlDoc)
    //Hertil er du nået


}



async function main() {
      
    let games = await fetchCollectionIDs(collectionURL)
    // await games.forEach((game) =>  populateGameWithInfo(game.objectid, element))
    console.log(await populateGameWithInfo(games[0].objectid, games[0]))


    console.log(games);
}

main()
