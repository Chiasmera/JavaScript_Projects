const contentDiv = document.getElementById('content')
let activeContainers = 0;
let currentID = 0;

class Timer {
    constructor(id, targetSeconds) {
        this.id = id,
        this.targetTime = (Date.now() + (targetSeconds*1000)) /1000
        this.initTime = Date.now() / 1000
        this.state = 'started'
    }

    togglePause = function() {
        if (this.state === 'started') {
            this.state = this.getCurrentTime()
            this.stop()
        } else {
            this.targetTime = (Date.now() + (this.state*1000)) /1000
            this.state = 'started'
            this.start()
        }
    }

    getCurrentTime = function () {
        return Math.round(this.targetTime - Date.now() / 1000) > 0 ? Math.round(this.targetTime - Date.now() / 1000) : 0
    }

    start = function () {
        this.intervalID = setInterval( ()=> this.container.firstChild.textContent = this.getCurrentTime())
    }

    stop = function () {
        clearInterval(this.intervalID)
    }

}

function createContainer(timer) {
    const div = document.createElement('div')
    div.setAttribute('class', 'container')
    div.setAttribute('id', timer.id)
    contentDiv.prepend(div)
    
    const number = document.createElement('p')
    number.textContent = '0'
    div.appendChild(number)

    activeContainers++
    reassignColumns()

    return div
}

function createPauseButton(div, timer){
    const togglePauseButton = document.createElement('button')
    togglePauseButton.textContent = '>>|'
    togglePauseButton.setAttribute('class', 'togglePause')
    div.appendChild(togglePauseButton)
    togglePauseButton.addEventListener('click', ()=>{timer.togglePause()})
}

function createDeleteButton (div) {
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Slet'   
    deleteButton.setAttribute('class', 'delete') 
    div.appendChild(deleteButton)
    deleteButton.addEventListener('click', ()=>{
        div.remove()
        activeContainers--
        reassignColumns()
    })
}

function reassignColumns() {
    let columns = '';
    if (activeContainers > 5) {
        columns = '1fr 1fr 1fr 1fr 1fr'
    } else {
        for (let i = 0; i < activeContainers; i++) {
            columns = columns + ' 1fr'
        }
    }

    contentDiv.style.gridTemplateColumns = columns
}

function createTimer(id, time) {
    const timer = new Timer(id, time)
    const container = createContainer(timer)
    createPauseButton(container, timer)
    createDeleteButton(container)
    timer.container = container
    timer.start()
    return timer
}

function addTimerButton(){
    const div = document.createElement('div')
    div.setAttribute('class', 'addTimerButton')
    
    const text = document.createElement('p')
    text.textContent = '+'
    div.appendChild(text)

    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    input.setAttribute('value', '60')
    div.appendChild(input)

    div.addEventListener('click', (event)=> {
        if (event.target !== input ) {
            createTimer(++currentID, input.value)
        }
    })

    contentDiv.appendChild(div)
    activeContainers++
    reassignColumns()
}

addTimerButton()
