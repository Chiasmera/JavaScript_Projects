const spans = document.querySelectorAll('span')
const headlines = document.querySelectorAll('h1')

spans.forEach( (span, spanIndex) => {
    span.addEventListener('click', (event) => {
        headlines.forEach( (headline, hIndex)=> {
            if (hIndex === spanIndex) {
                headline.style.display = 'block'
            } else {
                headline.style.display = 'none'
            }
        })
    })
})

headlines.forEach( (headline) => {
    headline.style.display = 'none'
})
headlines[0].style.display = 'block'
