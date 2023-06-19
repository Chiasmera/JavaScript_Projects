// Tilføj kode for opgave 4.1 - 4.5 her!

// opgave 4.1
const all = document.querySelectorAll('*')
all.forEach( (element) => { element.style.color = 'red'})

// opgave 4.2
const secondAfterHeadline = document.querySelectorAll('h1+*+*')
secondAfterHeadline.forEach( (element) => { element.style.color = 'brown'})


// opgave 4.3
const oddListelements = document.querySelectorAll('li:nth-child(odd)')
    .forEach( (element) => { element.style.background = 'lightgrey'})

// opgave 4.4
const toBeSubheaders = document.querySelectorAll('h1+p').forEach( (element) => {
    const subheader = document.createElement('h2')
    subheader.textContent = element.textContent
    
    element.after(subheader)
    element.remove()

})

// opgave 4.5
const list = document.createElement('ul')
document.body.prepend(list)
const headlines = document.querySelectorAll('h1').forEach( (element, index) => {
    element.id = index+1

    const listItem = document.createElement('li')
    const linkElement = document.createElement('a')
    linkElement.href = '#'+element.id
    linkElement.textContent = element.textContent
    listItem.appendChild(linkElement)
    list.appendChild(listItem)
})

