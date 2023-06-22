//diceColors
const diceColours = {
    red: ['rgb(255, 100, 100)', 'rgb(255, 255, 255)'],
    green:['rgb(100, 255, 100)', 'rgb(0, 0, 0)'],
    blue:['rgb(100, 100, 255)', 'rgb(255, 255, 255)'],
    yellow:['rgb(255, 255, 100)', 'rgb(0, 0, 0)'],
    purple:['rgb(255, 100, 255)', 'rgb(255, 255, 255)'],
    teal:['rgb(100, 255, 255)', 'rgb(0, 0, 0)'],
    white:['rgb(255, 255, 255)', 'rgb(0, 0, 0)'],
    black:['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
    grey:['rgb(160, 160, 160)', 'rgb(255, 255, 255)']

}

const statColours = {
    str: ['assets/str.png', diceColours.red],
    dex:['assets/dex.png', diceColours.teal],
    con:['assets/end.png', diceColours.green],
    int:['assets/int.png', diceColours.blue],
    wis:['assets/wis.png', diceColours.purple],
    cha:['assets/cha.png', diceColours.yellow],
    none:['', diceColours.grey]
}

const body = document.body
rollValue = {
    str: {value: 0, count:0},
    dex:{value: 0, count:0},
    con:{value: 0, count:0},
    int:{value: 0, count:0},
    wis:{value: 0, count:0},
    cha:{value: 0, count:0}
}

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
const statValues = {}
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
    statValues[element] = statNumber.value
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

//Main screen contents
const activeActions = []

//action class
class Action {
    constructor(name, difficulty, mainStat, secondaryStatArray) {
        this.mainStat = mainStat
        this.secondaryStats = secondaryStatArray
        this.difficulty = Number( difficulty )
        this.name = name
        
        this.setDifficultyHint()
        this.constructgraphics()
    }

    calcResult = function () {
        //Stat part of the resulting value =  (mainStat + (Sum(secStats)/2))/10 
        let mainStatValue = 0;
        if (this.mainStat === 'none') {
            mainStatValue = 0
        } else {
            mainStatValue = Number(statValues[this.mainStat])
        }

        const secStatValue = Math.round( this.secondaryStats.reduce( (acc, curr) => { return Number(statValues[curr]) }, 0) / 2 )

        let attemptValue = Math.round( (mainStatValue + secStatValue) / 5 )

        let rollSubTotal = 0
        //Dice part of the resulting value = mainStat result + Sum(secstat) result / 2 + Count(OtherStat)
        for ( let index in rollValue) {
            if (index === this.mainStat) {
                rollSubTotal += rollValue[index].value

            } else if (this.secondaryStats.includes(index)) {
                rollSubTotal += rollValue[index].value / 2
            } 

        }
        const dieModifier = (3 - trayDice.length) * 2.5

        attemptValue += Math.round(rollSubTotal + dieModifier)

        const luckRoll = Math.random()


        if ( luckRoll >= 0.95 || attemptValue >= this.difficulty + 7){
            //critical success
            this.result = 'Great Success!'
        } else if (luckRoll < 0.05 || attemptValue<= this.difficulty - 7 ) {
            //Great failure
            this.result = 'Great Failure'
        } else if(attemptValue >= this.difficulty+2) {
            //Success
            this.result = 'Success'
        }else if(attemptValue >= this.difficulty-3) {
            //Success , with a cost
            this.result = 'Success, with a cost'
        } else {
            //failure
            this.result = 'Failure'
        }

        this.attemptValue = attemptValue
        this.element.lastChild.textContent = this.result
    }

    setDifficultyHint = function () {
        if (this.difficulty >= 25) {
            this.result = 'Very Hard'
        } else if (this.difficulty >= 20) {
            this.result = 'Hard'
        } else if (this.difficulty >= 15) {
            this.result = 'Medium'
        } else if(this.difficulty >= 10) {
            this.result = 'Easy'
        } else {
            this.result = 'Very Easy'
        }
    }

    constructgraphics = function () {
        const mainDiv = document.createElement('div')
        mainDiv.setAttribute('class', 'action')

        const header = document.createElement('h1')
        header.textContent = `${this.name}`
        mainDiv.appendChild(header)

        const secondariesContainer = document.createElement('div')
        secondariesContainer.setAttribute('class', 'secondariesContainer')
        mainDiv.appendChild(secondariesContainer)

        this.secondaryStats.forEach( (secStat) => {
            const secCircle = document.createElement('div')
            secCircle.setAttribute('class', 'statCircle')
            secCircle.style.backgroundColor = statColours[secStat][1][0]
            secondariesContainer.appendChild(secCircle)
        })

        const result = document.createElement('p')
        result.textContent = this.result
        mainDiv.appendChild(result)

        mainWindow.appendChild(mainDiv)

        mainDiv.style.backgroundColor = statColours[this.mainStat][1][0]

        this.element = mainDiv
        
        activeActions.push(this)     
    }
}





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
     * Rolls this die. returns the results and sets die graphic and result value
     */
    roll = function () {
        const randIndex = randomSide(this.sides)
        this.result = this.sides[randIndex]
        this.result.value = (Math.floor(( Math.random() * this.result.factor )+1))
        
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
        return this.result
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
                chance: Number(statObject[statIndex]) * 3,
                factor: Number(20)
            } )       
        } else {
            sideArray.push( {
                name:statIndex,
                image: statColours[`${statIndex}`], 
                chance: Number(statObject[statIndex]),
                factor: Number(10)
            } )
        }        
    }
    return sideArray
}

function rollDiceInTray() {
    for (let die of trayDice) {
        die.roll()
    }
    calcDieResults()
    activeActions.forEach((action)=> action.calcResult())
}


//Creates dice in the tray. One, plus one if stat is > 9, plus one if stat is > 17
for (let statName in statValues) {
    if (statValues[statName] >= 20) {
        poolDice.push( new Die(statValues, statName, dicePool) )
    }
    if (statValues[statName] >= 16) {
        poolDice.push( new Die(statValues, statName, dicePool) )
    }
    if (statValues[statName] >= 10) {
        poolDice.push( new Die(statValues, statName, dicePool) )
    }
    if (statValues[statName] >= 6) {
        poolDice.push( new Die(statValues, statName, dicePool) )
    }
    poolDice.push( new Die(statValues, statName, dicePool) )
}

//prints the summed value of each stat rolled in pool
function calcDieResults() {
    rollValue = {
        str: {value: 0, count:0},
        dex:{value: 0, count:0},
        con:{value: 0, count:0},
        int:{value: 0, count:0},
        wis:{value: 0, count:0},
        cha:{value: 0, count:0}
    }
    for (let die of trayDice) {
        rollValue[die.result.name].value += die.result.value  
        rollValue[die.result.name].count++
    }
    // console.log(rollValue)
}

poolDice[0].toggleSide()
// poolDice[1].toggleSide()
// poolDice[2].toggleSide()
poolDice[3].toggleSide()
// poolDice[4].toggleSide()
// poolDice[5].toggleSide()
poolDice[6].toggleSide()
// poolDice[9].toggleSide()
// poolDice[12].toggleSide()
// poolDice[15].toggleSide()


// const action1 = new Action('Investigate', 15,'int', ['dex', 'wis'])
// const action2 = new Action('Defend', 12,'con', ['dex', 'int'])
// const action3 = new Action('Move', 10,'dex', ['wis'])
// const action4 = new Action('Social Interaction', 17,'cha', ['int', 'str', 'wis'])
// const action5 = new Action('Kill Everyone all at once', 23,'str', ['dex', 'con', 'int', 'wis', 'cha'])
const action = new Action('Attack', 10,'none', ['dex', 'wis', 'str', 'con', 'int', 'cha'])

// const action6 = new Action('Investigate', 15,'int', ['dex', 'wis'])
// const action7 = new Action('Defend', 12,'con', ['dex', 'int'])
// const action8 = new Action('Move', 10,'dex', ['wis'])
// const action9 = new Action('Social Interaction', 17,'cha', ['int', 'str', 'wis'])
// const action10 = new Action('Kill Everyone all at once', 23,'str', ['dex', 'con', 'int', 'wis', 'cha'])
const action11 = new Action('Attack', 15,'str', ['dex', 'wis'])
// const action6x = new Action('Investigate', 15,'int', ['dex', 'wis'])
// const action7x = new Action('Defend', 12,'con', ['dex', 'int'])
// const action8x = new Action('Move', 10,'dex', ['wis'])
// const action9x = new Action('Social Interaction', 17,'cha', ['int', 'str', 'wis'])
// const action10x = new Action('Kill Everyone all at once', 23,'str', ['dex', 'con', 'int', 'wis', 'cha'])
// const action11x= new Action('Attack', 15,'str', ['dex', 'wis'])

let statistics = {}
let dieResults = {}
for (let i = 0; i < 100;i++) {
    rollDiceInTray()
    
    const currentResult = action.result
    const currentValue = action.attemptValue
   
    if (statistics[String(currentResult)] !== undefined) {
        statistics[String(currentResult)]++
    } else {
        statistics[String(currentResult)] = 1
    }

    if (dieResults[String(currentValue)] !== undefined) {
        dieResults[String(currentValue)]++
    } else {
        dieResults[String(currentValue)] = 1
    }
    
}
console.log(statistics)
console.log(dieResults);

statistics = {}
dieResults = {}
for (let i = 0; i < 100;i++) {
    rollDiceInTray()
    
    const currentResult = action11.result
    const currentValue = action11.attemptValue
   
    if (statistics[String(currentResult)] !== undefined) {
        statistics[String(currentResult)]++
    } else {
        statistics[String(currentResult)] = 1
    }

    if (dieResults[String(currentValue)] !== undefined) {
        dieResults[String(currentValue)]++
    } else {
        dieResults[String(currentValue)] = 1
    }
    
}
console.log(statistics)
console.log(dieResults);