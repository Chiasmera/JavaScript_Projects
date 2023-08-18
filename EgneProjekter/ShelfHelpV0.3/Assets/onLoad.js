const shelfContainer = document.querySelector('.shelfContainer')
const leftoverContainer = document.querySelector('.leftoverContainer')
const maxColumnsField = document.getElementById('shelfX')
const maxRowsField = document.getElementById('shelfY')
const shelfHeightField = document.getElementById('shelfHeight')
const shelfWidthField = document.getElementById('shelfWidth')

class Shelf {
    constructor() {
        this.remHeight = parseFloat(shelfHeightField.value)
        this.rows = []
    }
    /**
     * Places a game in a row on the shelf. May construct a new row, if there is no space for the game in any row, 
     * and if there is still space for a row with the game on the shelf
     * @param {Game} game 
     * @returns true if game was placed correctly, false otherwise
     */
    place (game) {
        if (this.rows.length === 0) {
            if (game.y < this.remHeight) {
                this.remHeight -= game.y
                const currentRow = new ShelfRow()
                this.rows.push(currentRow)
                return currentRow.place(game)
            } else {
                console.log(`Game (${game.title}) could not be placed. Reason: too tall`);
                return false
            }        


        } else {

        
            //if there is space in any row, place and return true
            for ( let row of this.rows) {
                if (row.place(game)) {
                    return true
                }
            }

            // else A new row must be constructed, if there is space
          
            //check for space in height
            if (game.y <= this.remHeight) {
                const currentRow = new ShelfRow()
                //place game on in new row
                if (currentRow.place(game)) {
                    this.remHeight -= currentRow.height
                    this.rows.push(currentRow)
                    return true
                } else {
                    console.log(`Game (${game.title}) could not be placed. Reason: SheldRow reported false`);
                    return false
                }
            } else {
                console.log(`Game (${game.title}) could not be placed. Reason: there is no space on the shelf for a new row, and no place in old row`);
                return false
            }
            
        }        
        
    }

    getGames() {
        const array = []
        for (let row of this.rows) {
            for (let game of row.content) {
                array.push(game)
            }
        }
        return array
    }


}

class ShelfRow {
    constructor() {
        this.height = parseFloat(0),
        this.remWidth = parseFloat(shelfWidthField.value),
        this.content = []
    }

    /**
     * Places the game in this row if its height is less than the rows height, and there is remaining width to the row
     * @param {Game} game 
     * @returns true if game was placed, false otherwise
     */
    place(game) {
        if (this.height === 0) {
            if (game.x <= this.remWidth) {
                this.content.push(game)
                this.height = parseFloat(game.y)
                this.remWidth -= parseFloat(game.x)
                return true
            } else {
                return false
            }
        } else {
            if (game.y <= this.height && game.x <= this.remWidth) {
                this.content.push(game)
                this.height = parseFloat(game.y)
                this.remWidth -= parseFloat(game.x)
                return true
            } else {
                return false
            }  
        }
    }
}

class Game {
    constructor(id, versionID) {
        this.id = String(id),
        this.versionID = String(versionID)
    }
}

async function main() {
    const games = await fetchCollection('LuciusWriter')
    const testShelfObject = new Shelf()
    for (game of games) {
        console.log(game.y)
    }

    testShelfObject.place(games[0])
    testShelfObject.place(games[1])
    testShelfObject.place(games[2])
    testShelfObject.place(games[3])
    testShelfObject.place(games[4])

    console.log(testShelfObject);
    displayShelf(testShelfObject)
}

main()


/**
 * Fetches a collection of games from a users collection
 * @param {String} username 
 * @returns an array of Game objects
 */
async function fetchCollection (username) {
    const response = await fetch(`/collection/${username}`)
    const games = await JSON.parse( await response.text())
    return games
}


function displayShelf(shelfObject) {
    const shelfElement = document.createElement('div')
    shelfElement.setAttribute('class', 'shelf')
    shelfElement.style.width = String( `${shelfWidthField.value / 2}rem`)
    shelfElement.style.height = String( `${shelfHeightField.value / 2}rem`)
   
    for (let game of shelfObject.getGames()) {
        createGameElement(shelfElement, game)
    }

    shelfContainer.prepend(shelfElement)

}

function createGameElement(parent, game) {
    const gameElement = document.createElement('div')
    gameElement.setAttribute('class', 'game')

    gameElement.style.width = String( `${Math.round(game.x) / 2}rem`)
    gameElement.style.height = String( `${Math.round(game.y) / 2}rem`)
    gameElement.textContent = String( `${game.title}`)

    parent.prepend(gameElement)
}

