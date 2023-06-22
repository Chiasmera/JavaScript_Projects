const button = document.getElementById('logout')
button.addEventListener('pointerdown', async ()=> {
    const response = await fetch('/logout', {
        method:"POST"
    })
    if(response.status === 250) {
        location.href = '/'
    }
    
})