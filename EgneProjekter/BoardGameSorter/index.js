class Game {
    constructor(name, width, height, depth, time, complexity) {
        this.name = name,
        this.height = height,
        this.width = width,
        this.depth = depth,
        this.time = time,
        this.complexity = complexity
    }
}

const sampleGames = [
    new Game('Carcasonne', 20, 7, 30, 20, 1.5),
    new Game('Clank', 30, 7, 30, 60, 3.2),
    new Game('Smallworld', 30, 7, 30, 90, 2.5),
    new Game('Magic Maze', 20, 5, 20, 30, 2.1),
    new Game('Dungeon Lords', 30, 7, 30, 120, 4.2),
    new Game('Seasons', 30, 7, 30, 120, 4.1),
    new Game('Coup', 15, 3, 8, 10, 1.9),
    new Game('Splendor', 30, 7, 20, 45, 2.5),
    new Game('Quantum', 30, 7, 30, 60, 2.8),
    new Game('Blood Bowl: Team Manager', 30, 5, 30, 60, 3.5),

    new Game('Carcasonne', 20, 7, 30, 20, 1.5),
    new Game('Clank', 30, 7, 30, 60, 3.2),
    new Game('Smallworld', 30, 7, 30, 90, 2.5),
    new Game('Magic Maze', 20, 5, 20, 30, 2.1),
    new Game('Dungeon Lords', 30, 7, 30, 120, 4.2),
    new Game('Seasons', 30, 7, 30, 120, 4.1),
    new Game('Coup', 15, 3, 8, 10, 1.9),
    new Game('Splendor', 30, 7, 20, 45, 2.5),
    new Game('Quantum', 30, 7, 30, 60, 2.8),
    new Game('Blood Bowl: Team Manager', 30, 5, 30, 60, 3.5),

    new Game('Carcasonne', 20, 7, 30, 20, 1.5),
    new Game('Clank', 30, 7, 30, 60, 3.2),
    new Game('Smallworld', 30, 7, 30, 90, 2.5),
    new Game('Magic Maze', 20, 5, 20, 30, 2.1),
    new Game('Dungeon Lords', 30, 7, 30, 120, 4.2),
    new Game('Seasons', 30, 7, 30, 120, 4.1),
    new Game('Coup', 15, 3, 8, 10, 1.9),
    new Game('Splendor', 30, 7, 20, 45, 2.5),
    new Game('Quantum', 30, 7, 30, 60, 2.8),
    new Game('Blood Bowl: Team Manager', 30, 5, 30, 60, 3.5),

    new Game('Carcasonne', 20, 7, 30, 20, 1.5),
    new Game('Clank', 30, 7, 30, 60, 3.2),
    new Game('Smallworld', 30, 7, 30, 90, 2.5),
    new Game('Magic Maze', 20, 5, 20, 30, 2.1),
    new Game('Dungeon Lords', 30, 7, 30, 120, 4.2),
    new Game('Seasons', 30, 7, 30, 120, 4.1),
    new Game('Coup', 15, 3, 8, 10, 1.9),
    new Game('Splendor', 30, 7, 20, 45, 2.5),
    new Game('Quantum', 30, 7, 30, 60, 2.8),
    new Game('Blood Bowl: Team Manager', 30, 5, 30, 60, 3.5),

    new Game('Carcasonne', 20, 7, 30, 20, 1.5),
    new Game('Clank', 30, 7, 30, 60, 3.2),
    new Game('Smallworld', 30, 7, 30, 90, 2.5),
    new Game('Magic Maze', 20, 5, 20, 30, 2.1),
    new Game('Dungeon Lords', 30, 7, 30, 120, 4.2),
    new Game('Seasons', 30, 7, 30, 120, 4.1),
    new Game('Coup', 15, 3, 8, 10, 1.9),
    new Game('Splendor', 30, 7, 20, 45, 2.5),
    new Game('Quantum', 30, 7, 30, 60, 2.8),
    new Game('Blood Bowl: Team Manager', 30, 5, 30, 60, 3.5)
]

const shelfHeight = 30;
const shelfWidth = 30;
const shelfDepth = 30;

let shelfRows = document.createElement('input')
shelfRows.setAttribute('type', 'number')
shelfRows.setAttribute('id', 'rowsCounter')
let shelfColumns = document.createElement('input')
shelfColumns.setAttribute('type', 'number')
shelfColumns.setAttribute('id', 'columnsCounter')

document.body.appendChild(shelfColumns)
document.body.appendChild(shelfRows)

const rowCounter = document.getElementById('rowsCounter')
rowCounter.value = 5
const columnCounter = document.getElementById('columnsCounter')
columnCounter.value = 5

rowCounter.addEventListener('change', (event) => {
    rebuildtable (undefined, 'complexity')
})

columnCounter.addEventListener('change', (event) => {
    rebuildtable (undefined, 'complexity')
})


function rebuildtable (sortColumnBy, sortRowBy) {
    const formerTable = document.querySelector('table')
    if (formerTable !== null) {
        formerTable.remove()
    }
    

    const table = document.createElement('table')
    for (let i = 0; i < rowCounter.value; i++ ){
        const currentRow = document.createElement('tr')
        for (let i = 0; i < columnCounter.value; i++ ){
            const currentColumn = document.createElement('td')
            currentRow.appendChild(currentColumn)
        }
        table.appendChild(currentRow)
    }

    document.body.appendChild(table)

    distributeGamesEvenly(sampleGames,sortColumnBy, sortRowBy)
}

function distributeGamesEvenly (gameList, sortColumnBy, sortRowBy) {
    const columns = columnCounter.value
    const rows = rowCounter.value

    //Sort whole list by row criteria
    if (sortRowBy !== undefined) {
        gameList = sortGameList(gameList, sortRowBy)
    }

    //distribute list evenly over all rows
    let rowContent = []
    for (let i = 0; i < rows; i++) {
        rowContent[i] = []
    }
    
    for (let index in gameList) {
        let position = index % rows
        rowContent[position].push(gameList[index])
    }

    //Sort each row, to make sure it is sorted correctly
    for (let array of rowContent) {
        array = sortGameList(array, sortRowBy)
    }

    //distribute each row into cells
    divideIntoCells(rowContent)

    //Merge columns into a list, sort it by column criteria, then divide it into cells again


    
    //Find tablerows
    const tableRows = [... document.querySelectorAll('tr')]

    for (let rowIndex in tableRows) {
        const cells = [...tableRows[rowIndex].children]
        for(let cellIndex in cells){
            //Add games to current cell, in current row
            for (let game of rowContent[rowIndex][cellIndex]){
                const currentGame = document.createElement('div')
                currentGame.innerHTML = game.name
                cells[cellIndex].appendChild(currentGame)
            }
        }
    }

    //TODO - Hvad hvis der ikke sorteres på rows? skal der så sorteres på columns før de bliver delt ud, på en eller anden måde?

    return []


    function divideIntoCells (rowContent) {
        for (let rowIndex in rowContent) {
            const newCurrentRowContent = []
            for (let cellIndex = 0; cellIndex < columns; cellIndex++) {
                newCurrentRowContent[cellIndex] = rowContent[rowIndex].slice( Math.floor(rowContent[rowIndex].length/columns*(cellIndex)), 
                                                        Math.floor(rowContent[rowIndex].length/columns*(cellIndex+1)))
            }
            rowContent[rowIndex] = newCurrentRowContent        
        }
    }
}

function sortGameList(gameList, property) {
    if (!Array.isArray(gameList)){
        throw new Error('List of game to be sorted is not an array')        
    }
    if (!Object.hasOwn(gameList[0], property)){
        console.log(gameList[0]+ ' ' + property);
        throw new Error('property is not a valid choice for sorting')        
    }
    if (gameList.length === 0) {
        return gameList
    } else if ( typeof gameList[0][property] === 'string') {
        return [...gameList.sort( (a, b) => {return a[property].localeCompare(b[property])})]
    } else {
        return [...gameList.sort( (a, b) => {
            let result = a[property] - b[property]
            if (result === 0) {
                result = a.name.localeCompare(b.name)
            }
            return result
        } )]
    }
}

rebuildtable ('name', 'complexity')

