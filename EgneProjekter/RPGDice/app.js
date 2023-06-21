//diceColors
const diceColours = {
    red: ['rgb(255, 100, 100)', 'rgb(255, 255, 255)'],
    green:['rgb(100, 255, 100)', 'rgb(0, 0, 0)'],
    blue:['rgb(100, 100, 255)', 'rgb(255, 255, 255)'],
    yellow:['rgb(255, 255, 100)', 'rgb(0, 0, 0)'],
    purple:['rgb(255, 100, 255)', 'rgb(255, 255, 255)'],
    teal:['rgb(100, 255, 255)', 'rgb(0, 0, 0)'],
    white:['rgb(255, 255, 255)', 'rgb(0, 0, 0)'],
    black:['rgb(0, 0, 0)', 'rgb(255, 255, 255)']
}

const statColours = {
    str: ['assets/str.png', diceColours.red],
    dex:['assets/dex.png', diceColours.teal],
    con:['assets/end.png', diceColours.green],
    int:['assets/int.png', diceColours.blue],
    wis:['assets/wis.png', diceColours.purple],
    cha:['assets/cha.png', diceColours.yellow]
}

const body = document.body

//Arrays to hold contents of pool and tray
const poolDice = []
const trayDice = []

//Create dividers for main layout
const statusBar = document.createElement('div')
statusBar.setAttribute('id', 'statusBar')
body.appendChild(statusBar)

const mainWindow = document.createElement('div')
mainWindow.setAttribute('id', 'mainWindow')
body.appendChild(mainWindow)

const diceTray = document.createElement('div')
diceTray.setAttribute('id', 'diceTray')
body.appendChild(diceTray)

const dicePool = document.createElement('div')
dicePool.setAttribute('id', 'dicePool')
body.appendChild(dicePool)

//Status bar contents
const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha']

stats.forEach( (element) => {
    const stat = document.createElement('div')
    stat.setAttribute('id', element)
    stat.setAttribute('class', 'attribute')
    

    const statText = document.createElement('div')
    statText.textContent = element.toUpperCase()
    stat.appendChild(statText)

    const statNumber = document.createElement('input')
    statNumber.setAttribute('type', 'number')
    statNumber.setAttribute('min', 0)
    statNumber.setAttribute('max', 30)
    statNumber.value = 10;
    statNumber.style.backgroundColor = statColours[`${element}`][1][0]

    statNumber.addEventListener('change', (event)=>{ 
        if (event.target.value > 30) {
            event.target.value = 30
        } else if(event.target.value < 0) {
            event.target.value = 0
        }})
    stat.appendChild(statNumber)

    stat.style.backgroundColor = statColours[`${element}`][1][0]
    statusBar.appendChild(stat)
})

//Dice Tray contents
const rollButton = document.createElement('button')
rollButton.setAttribute('id', 'rollButton')
rollButton.textContent = 'Roll'
rollButton.addEventListener('pointerup', ()=> rollDiceInTray())
diceTray.appendChild(rollButton)


//Die class implementation
class Die {
    constructor (statObject, mainStat, parent) {
        this.sides = fillSideArrayBasedOnStats(statObject, mainStat)
        this.parent = parent
        for (let side of this.sides) {
            if (side.name === mainStat) {
                this.result = side
            }
        }
        this.result.value = 0;

        const dieElement = document.createElement('div')
        this.element = dieElement 

        const img = document.createElement('img')
        this.element.appendChild(img)
        this.img = img
        this.img.src = this.result.image[0]    

        this.colour = statColours[mainStat][1]
       
        dieElement.setAttribute('class', 'die')
        dieElement.setAttribute('dieObject', this)
        dieElement.style.backgroundColor = this.colour[0]

        dieElement.addEventListener('pointerup', ()=> {
            this.toggleSide()
        })

        this.parent.appendChild(dieElement)
    }

    /**
     * Rolls this die
     */
    roll = function () {
        const randIndex = randomSide(this.sides)
        this.result = this.sides[randIndex]
        this.result.value =+ (Math.floor(( Math.random() *6 )+1)* this.result.factor)
        
        this.img.src=this.sides[randIndex].image[0]
        this.element.style.backgroundColor = this.colour[0]
        
        function randomSide(sides) {
            if (!Array.isArray(sides)) {
                throw new Error('Sides is not an array. Cannot randomly pick a side')
            }
            let accumulator = 0;
            const totalChance = sides.reduce( (acc, curr)=> Number(acc) + Number(curr.chance), 0) 
            const roll = Math.floor(Math.random() * totalChance)

            for (let index in sides) {
                accumulator += sides[index].chance
                if (roll <= accumulator) {
                    return index
                }
            }
        }
    }

    toggleSide = function() {
        if (this.parent === dicePool) {
            this.parent = diceTray
            trayDice.push(this)
            diceTray.appendChild(this.element)
        } else {
            this.parent = dicePool
            poolDice.push(this)
            dicePool.appendChild(this.element)
        }
    }
}

/**
 * Fills an aray with sides of a die, with a probability matching the relevant stat, and a double factor on the main stat of the die
 * @param {Object} statObject object with values for each stat
 * @param {String} mainStat three letter representation of the main stat for this die
 * @returns an array of sides
 */
function fillSideArrayBasedOnStats(statObject, mainStat) {
    const sideArray = []
    for (let statIndex in statObject) {
        if (mainStat === statIndex) {
            sideArray.push( {
                name:statIndex,
                image: statColours[`${statIndex}`], 
                chance: Number(statObject[statIndex]),
                factor: Number(2)
            } )        
        } else {
            sideArray.push( {
                name:statIndex,
                image: statColours[`${statIndex}`], 
                chance: Number(statObject[statIndex]),
                factor: Number(1)
            } )
        }
    }
    return sideArray
}

function rollDiceInTray() {
    for (let die of trayDice) {
        die.roll()
    }
    printDieResults()
}

//Generates object with current stat values
const statDivs = document.querySelectorAll('#statusBar > div > input')
statDivs.forEach((stat)=>stat.value=16)
const statObject = {
    str: statDivs[0].value,
    dex: statDivs[1].value,
    con: statDivs[2].value,
    int: statDivs[3].value,
    wis: statDivs[4].value,
    cha: statDivs[5].value
}





//Creates dice in the tray. One, plus one if stat is > 9, plus one if stat is > 17
for (let statName in statObject) {
    if (statObject[statName] >= 20) {
        poolDice.push( new Die(statObject, statName, dicePool) )
    }
    if (statObject[statName] >= 16) {
        poolDice.push( new Die(statObject, statName, dicePool) )
    }
    if (statObject[statName] >= 10) {
        poolDice.push( new Die(statObject, statName, dicePool) )
    }
    if (statObject[statName] >= 6) {
        poolDice.push( new Die(statObject, statName, dicePool) )
    }
    poolDice.push( new Die(statObject, statName, dicePool) )
}

//prints the summed value of each stat rolled in pool
function printDieResults() {
    const rollValue = {
        str: 0,
        dex:0,
        con:0,
        int:0,
        wis:0,
        cha:0
    }
    for (let die of trayDice) {
        rollValue[die.result.name] += die.result.value  
    }
    console.log(rollValue)
}