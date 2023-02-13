// Tilføj kode for opgave 4.1 - 4.5 her!



/**
 * Opgave 4.1
 * @param {*} tag tagnavn for elementet der skal skifte farve
 * @param {*} colour farven elementet skal have
 */
function changeTagColor (tag, color) {
   let elements = document.getElementsByTagName(tag);
   for (let element of elements) {
    element.style.color = color;
   }
}

changeTagColor('p', 'red');

/**
 * Opgave 4.2 - lav det andet element efter en overskrift brun
 * @param {*} baseTagName Base element(s) from where to count
 * @param {*} N number of elements to count after base element
 * @param {*} color colour to change element to
 */
function colorizeNthElementAfterElement(baseTagName, N, color) {
    let elements = document.getElementsByTagName(baseTagName);

    for (let element of elements) {
        let target = element;
        for (let i = 0; i < N; i++) {
            target = target.nextElementSibling;
        }
        target.style.color = color;
    }
}

colorizeNthElementAfterElement('h1', 2, 'brown');

/**
 * Opgave 4.3 - Lav bagrunden på hver andet listeelement lysegrå
 * @param {*} N number of elements to count when changing
 * @param {*} backgroundcolor target color
 */
function changeEvenListelementBackground (backgroundcolor) {
    let list = document.querySelectorAll('li:nth-child(even)');

    for (let element of list) {
        element.style.backgroundColor = backgroundcolor;
    }
    
}

changeEvenListelementBackground('lightgray');


/**
 * Opgave 4.4 - lav den første paragraph efter hver h1 til en h2
 * @param {*} fromTag 
 * @param {*} toTag 
 */
function changeFirstTagAfterHeadline (fromTag, toTag) {
    //Find alle h1 elementer
    let list = document.getElementsByTagName('h1');
    for (let element of list) {
        //Check om næste element er en p før der gøres noget
        let target = element.nextElementSibling;
        if (target.tagName.toLowerCase === fromTag.toLowerCase) {
            //Get tekst fra p
            let tagContent = target.textContent;
            //Lav et nyt element af h2 type
            let newTag = document.createElement(toTag);
            //indsæt gammel text på nyt element
            newTag.textContent = tagContent;
            //Udskift gammel node
            target.parentNode.replaceChild(newTag, target);
        }
       }

}

changeFirstTagAfterHeadline('p', 'h2');





function internallyLinkEveryHeadline () {

    

    let headlines = document.querySelectorAll('h1');
    let idCounter = 1;

    let list = document.createElement('ul');

    for (let headline of headlines) {

        headline.id = 'h1_' + idCounter;      

        let link = document.createElement('a');
        link.href = '#'+headline.id;
        link.textContent = headline.textContent;

        let listItem = document.createElement('li');
        listItem.appendChild(link);

        list.appendChild(listItem);

        idCounter++;
    }

    document.body.prepend(list);

    console.log(list);
}

internallyLinkEveryHeadline();