// const statusBar
// const mainWindow
// const diceTray
// const dicePool
//const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha']

class Die {
    constructor (sideArray, parent) {
        this.sides = sideArray
        this.parent = parent

        const randIndex = Math.floor(Math.random() * this.sides.length)

        const dieElement = document.createElement('div')
        
        
        this.element = dieElement 
        this.result = this.sides[randIndex][0]
        const img = document.createElement('img')
        img.setAttribute('src', this.result)
        this.element.appendChild(img)       
        this.color = this.sides[randIndex][1][1]

        dieElement.setAttribute('class', 'die')
        dieElement.style.backgroundColor = this.sides[randIndex][1][0]
        dieElement.addEventListener('click', ()=> {
            if (this.parent === dicePool) {
                this.parent = diceTray
                diceTray.appendChild(dieElement)
            } else {
                this.parent = dicePool
                dicePool.appendChild(dieElement)
            }
        })

        this.parent.appendChild(dieElement)
    }

    roll = function () {
        const randIndex = Math.floor(Math.random() * this.sides.length)
        this.result = this.sides[randIndex][0]
        this.element.textContent = this.result
        dieElement.style.backgroundColor = this.sides[randIndex][1][0]
        this.color = this.sides[randIndex][1][1]
    }
}

function fillSideArrayBasedOnStats() {
    const statDivs = document.querySelectorAll('#statusBar > div > input')
    
    const stats = [...statDivs].map( element => element.value)

    const sideArray = []
    for (let index in stats) {
        for (let i = 0; i < Number(stats[index]); i++) {
            switch (Number(index)) {
                case 0:
                    sideArray.push(statColours.str)
                    break;
                case 1:
                    sideArray.push(statColours.dex)
                    break;
                case 2:
                    sideArray.push(statColours.con)
                    break;
                case 3:
                    sideArray.push(statColours.int)
                    break;
                case 4:
                    sideArray.push(statColours.wis)
                    break;
                case 5:
                    sideArray.push(statColours.cha)
                    break;
                default: throw new Error('Too many arguments in fillSideArrayBasedOnStats functions'+' index: '+index);

            }
        }
    }
    return sideArray
}

const actualSides = fillSideArrayBasedOnStats()
const poolDice = []
const trayDice = []

for (let i = 0; i < 10; i++) {
    poolDice.push( new Die(actualSides, dicePool) )
}


