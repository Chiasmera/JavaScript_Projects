const shelfContainer = document.querySelector('.shelfContainer')
const leftoverContainer = document.querySelector('.leftoverContainer')
const maxColumnsField = document.getElementById('shelfX')
const maxRowsField = document.getElementById('shelfY')
const shelfHeightField = document.getElementById('shelfHeight')
const shelfWidthField = document.getElementById('shelfWidth')
const usernameField = document.getElementById('user')
const fillShelvesButton = document.getElementById('fillShelvesButton')
fillShelvesButton.addEventListener('pointerdown', ()=> {
    onFillShelvesAction()
})

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

async function onFillShelvesAction() {
    //clear all elements in shelfContainer and leftoverContainer
    while (shelfContainer.firstChild) {
        shelfContainer.removeChild(shelfContainer.lastChild)
    }
    while (leftoverContainer.firstChild) {
        leftoverContainer.removeChild(leftoverContainer.lastChild)
    }
    
    //fetch updated list of games
    const games = await fetchCollection(usernameField)


    //fill out shelf array, sorted by second criteria
    const filledShelves =distributeGamesToShelves(games, 'weight', 'officialTime')
    
    //display the shelf array

    displayShelves(filledShelves)
    // for (let column of filledShelves) {
    //     for (let shelf of column) {
    //         displayShelf(shelf)
    //     }
    // }



}

function distributeGamesToShelves(games, sortByA, sortByB) {
    function sortBy(list, criteria, reverse) {
        if (!Array.isArray(list)) {
            throw new Error('cannot sort list, was not passed an array')
        } else {
            if (!reverse){
                if (typeof list[0][criteria] === "number") {
                    return list.sort( (a, b) => {return a[criteria] - b[criteria]})
                } else {
                    return list.sort( (a, b) => {return  String(a[criteria]) - String(b[criteria])})
                }
            } else {
                if (typeof list[0][criteria] === "number") {
                    return list.sort( (a, b) => {return b[criteria] - a[criteria]})
                } else {
                    return list.sort( (a, b) => {return  String(b[criteria]) - String(a[criteria])})
                }
            }

        }
    }

    const shelves = []
    for (let col = 0; col<maxColumnsField.value; col++) {
        const column = []
        for (let row = 0; row < maxRowsField.value; row++){
            column.push(new Shelf())
        }
        shelves.push(column)
    }


    
    if (!Array.isArray(games)) {
        throw new Error('cannot distribute games, was not passed an array of games')
    } else if (typeof sortByA !== 'string' || typeof sortByB !== 'string') {
        throw new Error('critera not a string')
    } else {

            //sort by criteria A
            const sortedGames = sortBy(games, sortByA, true)

            //divide into rows
            const rowArray = divideIntoRows(maxRowsField.value, sortedGames)

            
            //for each row
            // for (let rowIndex = rowArray.length-1; rowIndex >= 0; rowIndex-- ) {
            for (rowIndex in rowArray) {
                //sort the current row
                const currentRow = sortBy(rowArray[rowIndex], sortByB, false)

                //variable to hold current shelf columns index in row
                let shelfColumnIndex = shelves.length-1

                //for each game in list, starting with the lowest
                for (let gameIndex = currentRow.length-1; gameIndex >= 0; gameIndex--) {

                    //place on the right-most shelf
                    if (!shelves[shelfColumnIndex][rowIndex].place(currentRow[gameIndex])) {
                        //game was not placed on the shelf, try shelf on the left
                        if (shelfColumnIndex > 0) {
                            //shelf exists to the left, try to place it here
                            if(!shelves[shelfColumnIndex-1][rowIndex].place(currentRow[gameIndex])){
                                //game could not be placed, put game into above row, if it exists
                                if (rowIndex > 0) {
                                    rowArray[rowIndex-1].push(currentRow[gameIndex])
                                } else {
                                    //place a game in leftovers
                                    createGameElement(leftoverContainer, currentRow[gameIndex])
                                    console.log('A game did not fit in column, and was placed on leftovers');
                                }
                                //shift the starting shelf to the left, if it exists
                                if (shelfColumnIndex>0) { shelfColumnIndex--}
                            }

                        } else {
                            //no more shelves on the left, put game into above row, if it exists
                            if (rowIndex > 0) {
                                rowArray[rowIndex-1].push(currentRow[gameIndex])
                            } else {
                                //place a game in leftovers
                                createGameElement(leftoverContainer, currentRow[gameIndex])
                                console.log('A game did not fit in column, and was placed on leftovers');
                            }
                        }
                    }
                }
            }

            //remove any rows and columns containing ONLY empty shelves empty shelves
            //TODO

            return shelves
    }


    

    // // old solution below
    // const arrayOfColumns = distributeGamesInColumns(parseInt(maxColumnsField.value), games,sortByB )

    // //for every column of games
    // for (let columnIndex in arrayOfColumns) {
    //     //sort, then run through games in the array
    //     arrayOfColumns[columnIndex].sort( (a,b) => {a[sortByA] > b[sortByA] ? 1 : -1})
    //     let shelfIndex = 0
    //     for (let game of arrayOfColumns[columnIndex]) {
    //         let placed = false
    //         while (shelfIndex < shelves[columnIndex].length && !placed){
    //             if (shelves[columnIndex][shelfIndex].place(game)){
    //                 placed = true
    //             } else {
    //                 shelfIndex++
    //             }
    //         } 
    //         if (!placed){
    //             createGameElement(leftoverContainer, game)
    //             console.log('A game did not fit in column, and was placed on leftovers');
    //         }
    //     }
        
    // }
    // return shelves
}

//outdated
// function distributeGamesInColumns(columns, games, sortBy) {
//     const sortedGames = games.sort( (a, b) => { a[sortBy] > b[sortBy] ? 1 : -1})


//     const columnArray = []
//     for (let i = 0; i < columns; i++) {
//         columnArray[i] = []
//     }
//     for (let gameIndex in sortedGames ) {
//         columnArray[gameIndex % columns].push(sortedGames[gameIndex])
//     }

//     return columnArray
// }

function divideIntoRows(rows, sortedList) {
    const rowArray = []
    //create as many rows as the max amount of rows
    for (let i = 0; i < rows; i++) {
        rowArray.push( [] )
    }

    const chunkSize = Math.ceil(sortedList.length / rows);
    for (let row = 0; row < rows; row++) {
        for (let i = 0; i < chunkSize; i++) {
          const value = sortedList[i + row * chunkSize]
          if (!value) continue //avoid adding "undefined" values
          rowArray[row].push(value)
        }
    }
    return rowArray

}



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

function displayShelves(shelfArray) {
    let col = 0
    for (let row in shelfArray[col]) {
        const currentTableRow = document.createElement('tr')
        for ( let col in shelfArray) {
            const currentTCell = document.createElement('td')
            currentTCell.style.width = String( `${shelfWidthField.value / 2}rem`)
            currentTCell.style.height = String( `${shelfHeightField.value / 2}rem`)
            for (let game of shelfArray[col][row].getGames()) {
                createGameElement(currentTCell, game)
            }
            if (currentTCell.hasChildNodes()) {
                currentTableRow.appendChild(currentTCell)
            }
            col++
        }
        if (currentTableRow.hasChildNodes()) {
            shelfContainer.prepend(currentTableRow)
        }
    }
}


function createGameElement(parent, game) {
    const gameElement = document.createElement('div')
    gameElement.setAttribute('class', 'game')

    gameElement.style.width = String( `${Math.round(game.x) / 2}rem`)
    gameElement.style.height = String( `${Math.round(game.y) / 2}rem`)
    gameElement.textContent = String( `${game.title} (W:${game.weight}, T:${game.officialTime})`)


    parent.prepend(gameElement)
}

