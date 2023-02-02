// bubbleSort.js
let list = [7, 13, 9, 8, 4, 1, 2, 16, 0];
let target = 7;

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

console.log(result);