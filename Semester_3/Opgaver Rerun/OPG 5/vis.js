const inputs = document.querySelectorAll('input').forEach( (input, index) => {

    const label = document.createElement('label')
    label.for = input.id
    label.textContent = input.id
    input.before(label)
    label.appendChild(input)

    input.addEventListener('click', (event)=> {
        if (event.target.id === 'tid') {
            event.target.value = new Date
        } else {
            event.target.value = Math.floor(Math.random()*100)
        }
        console.log('hej');
    })

})