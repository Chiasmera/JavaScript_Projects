//Opgave 5.2
// Skriv kode i tabs.js, som viser <p> elementet svarende til det <span> element, der klikkes på. Fra starten
// skal den første tab vises. Brug CSS display propertien til at vise og skjule indholdet af en tab.

let spans = document.querySelectorAll('span');
let texts = document.querySelectorAll('h1');

console.log(spans)


document.querySelector('h2').addEventListener('click', showOnlyThis)


for (let text of texts) {
    text.style.display = 'none';
}
texts[0].style.display = 'block'

function showOnlyThis (element) {
    for (let spanIndex in spans) {
        if (spans[spanIndex] === element.target) {
            texts[spanIndex].style.display = 'block';
        } else {
            texts[spanIndex].style.display = 'none';
        }
    }

}



