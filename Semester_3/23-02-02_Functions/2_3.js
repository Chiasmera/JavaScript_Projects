//Svarende til Java’s Comparator#compare(…) metode, skal der her laves nogle compare-funktioner, der
//tager to parametre, og returnerer -1, 0 eller 1 alt efter om den første parameter er mindre end, lig med
//eller større en den anden parameter.
//Der skal laves følgende compare-funktioner:
//• compare(s1, s2): Sammenligner de to tekststrenge leksikografisk.
//• compareLen(s1, s2): Sammenligner de to tekststrenge på deres længde
//• compareIgnoreCase(s1, s2): Sammenligner to tekststrenge leksikografisk uden at tage hensyn til
//store og små bogstaver
//Modificer dernæst bubbleSort funktionen fra opgave 2.2, så den nu får en compare-funktion som ekstra
//parameter. Sammenligningen i bubbleSort funktionen skal nu ske med denne compare-funktion


function compare (s1, s2) {
    let result = 0;
    if (s1 > s2) {
        result = 1;
    } else if (s1 < s2) {
        result = -1;
    }
    return result;
}

function compareLen (s1, s2) {
    let result = 0;
    if (s1.length > s2.length) {
        result = 1;
    } else if (s1.length < s2.length) {
        result = -1;
    }
    return result;
}

function compareIgnoreCase (s1, s2) {
    let result = 0;
    if (s1.toLowerCase() > s2.toLowerCase()) {
        result = 1;
    } else if (s1.toLowerCase() < s2.toLowerCase()) {
        result = -1;
    }
    return result;
}

const string1 = "Allan";
const string2 = "Ulla";
const string3 = "jensen";

console.log(compare(string1, string2));
console.log(compare(string1, string3));

console.log(compareLen(string1, string2));
console.log(compareLen(string1, string3));

console.log(compareIgnoreCase(string1, string2));
console.log(compareIgnoreCase(string2, string3));



let array = ['Emil', 'Anders', 'Bjarke', 'Coolio','Daniel'];

let bubbleSort = function (array, comparator) {
    for (let i = array.length - 1; i >= 0; i--) {
     for (let j = 0; j <= i - 1; j++) {
        if (comparator(array[j], array[j + 1]) > 0) {
            swap(j, j+1);
         }
        }
    }

    function swap (first, second) {
        let temp = array[first];
            array[first] = array[second];
            array[second] = temp;
    }
}

bubbleSort(array, compare)
console.log(array);