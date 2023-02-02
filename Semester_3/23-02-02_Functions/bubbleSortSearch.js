// bubbleSort.js
let list = [7, 13, 9, 8, 4, 1, 2, 16, 0];
let target = 7;

for (let i = list.length - 1; i >= 0; i--) {
    for (let j = 0; j <= i - 1; j++) {
        if (list[j] > list[j + 1]) {
            let temp = list[j];
            list[j] = list[j+1];
            list[j+1] = temp;
        }
    }
}

let start = 0;
let end = list.length-1;
let result = -1;

while (result === -1 && start < end) {
   let middle = parseInt( (start + end)  / 2);
    if (list[middle] === target) {
        result = middle;
        found = true;
    } else if (target > list[middle]) {
        start = middle;
    } else {
        end = middle;
    }
}

console.log(result);