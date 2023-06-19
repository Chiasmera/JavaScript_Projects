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

stats.forEach( (element, index, array) => {
    const stat = document.createElement('div')
    stat.setAttribute('id', element)
    stat.setAttribute('class', 'attribute')
    

    const statText = document.createElement('div')
    statText.textContent = element.toUpperCase()
    stat.appendChild(statText)

    const statNumber = document.createElement('input')
    statNumber.setAttribute('type', 'number')
    statNumber.value = 0;
    statNumber.style.backgroundColor = `rgb(${(255/array.length*(index+1))}, ${(255-(255/array.length*(index+1)))}, ${150})`
    stat.appendChild(statNumber)

    stat.style.backgroundColor = `rgb(${(255/array.length*(index+1))}, ${(255-(255/array.length*(index+1)))}, ${150})`
    statusBar.appendChild(stat)
})





//Main window contents

//Dice Pool contents

//Dice Tray contents

