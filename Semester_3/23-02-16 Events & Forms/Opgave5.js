// opgave 5.1
function addLabelsBeforeInput () {

    let labelTal = document.createElement('label');
    labelTal.textContent = 'Tal';
    labelTal.for = 'tal';
    document.body.insertBefore(labelTal, document.querySelector('#tal'));



    let labelTid = document.createElement('label');
    labelTid.textContent = 'Tid';
    labelTid.for = 'tal';
    document.body.insertBefore(labelTid, document.querySelector('#tid'));
}  

addLabelsBeforeInput();

let talBox = document.querySelector('#tal');
talBox.addEventListener('click', () => talBox.value = Math.floor(Math.random()*100))


let tidBox = document.querySelector('#tid');
tidBox.addEventListener('click', () => tidBox.value = Date().toLocaleTimeString())



// Opgave 5.2