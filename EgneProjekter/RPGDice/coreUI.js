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





//Main window contents

//Dice Pool contents

//Dice Tray contents

