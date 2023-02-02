//Modificer løsningen til opgave 1.3, så algoritmerne nu pakkes ind i funktioner med signaturerne:
//• bubbleSort(array)
//• binarySearch(array, element)
//Gør desuden swap-delen af bubbleSort til en lokal funktion swap(i, j).

// bubbleSort.js
let array = [7, 13, 9, 8, 4, 1, 2, 16, 0];

let bubbleSort = function (array) {
    for (let i = array.length - 1; i >= 0; i--) {
     for (let j = 0; j <= i - 1; j++) {
        if (array[j] > array[j + 1]) {
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

bubbleSort(array);
console.log(array.toString()); // => 0,1,2,4,7,8,9,13,16A



//Binary search function
let binarySearch = function (array, target) {
    
for (let i = array.length - 1; i >= 0; i--) {
    for (let j = 0; j <= i - 1; j++) {
        if (array[j] > array[j + 1]) {
            let temp = array[j];
            array[j] = array[j+1];
            array[j+1] = temp;
        }
    }
}

let start = 0;
let end = array.length-1;
let result = -1;

while (result === -1 && start < end) {
   let middle = parseInt( (start + end)  / 2);
    if (array[middle] === target) {
        result = middle;
        found = true;
    } else if (target > array[middle]) {
        start = middle;
    } else {
        end = middle;
    }
}
return result;


}

console.log(binarySearch(array, 7));