const bodyNode = document.body;

const countries = [
    "Denmark",
    "France",
    "poland",
    "Germany",
    "Norway"
]

console.log(countries);

//list er et array af string
//type er en enum "ul" eller "ol"
function addList(ItemArray, type, parentNode) {
    //Tjek først om typen er en form for liste
    if (type !== "ol" && type !== "ul") {
        //i så fald er der fejl og funktion afprydes
        return;
    }

    //Opret liste af den angivne type
    let listNode = document.createElement(type);

    //løb igennem den givne liste
    for (value of ItemArray) {
        addListItem(value, listNode);
    }

    parentNode.appendChild(listNode);

}

/**
 * 
 * @param {*} itemText Teksten som listitem skal indeholde
 * @param {*} parentNode den liste som denne item skal tilføjes til
 */
function addListItem(itemText, parentNode) {
            //opret en listitem og tilføj til parent node
        let currentItem = document.createElement("li");
        let textNode = document.createTextNode(itemText);
        currentItem.appendChild(textNode);
        parentNode.appendChild(currentItem);
}

addList(countries, "ol", bodyNode);