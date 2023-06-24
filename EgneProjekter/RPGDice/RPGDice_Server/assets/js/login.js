const playerName = document.getElementById('playerName')
const password = document.getElementById('gmPassword')
const button = document.getElementById('logInButton')

async function login () {
    const data = await JSON.stringify( {
        name: playerName.value,
        pass: password.value
        } )
    const response = await fetch('/login', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: data
    })
    if (response.status === 302) {
        location.href = '/'
    } else {
        alert('At least input a name!')
    }
    
}

button.addEventListener('pointerdown', ()=> login())