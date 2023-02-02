// bubbleSort.js
let list = [7, 13, 9, 8, 4, 1, 2, 16, 0];

for (let i = array.length - 1; i >= 0; i--) {
    for (let j = 0; j <= i - 1; j++) {
        if (array[j] > array[j + 1]) {
            let temp = array[j];
            array[j] = array[j+1];
            array[j+1] = temp;
        }
    }
}
console.log(array.toString()); // => 0,1,2,4,7,8,9,13,16Ano