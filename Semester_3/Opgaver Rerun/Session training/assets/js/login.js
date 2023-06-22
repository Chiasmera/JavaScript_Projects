const button = document.body.querySelector('button')
const user = document.getElementById('user')
const pass = document.getElementById('pass')

button.addEventListener('pointerdown',async ()=> {
    let data = await JSON.stringify({user: user.value, pass: pass.value})

    const response = await fetch('/login', {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    } )

    user.value = ''
    pass.value = ''

    if (response.ok) {
        location.href = '/'
    }
})

