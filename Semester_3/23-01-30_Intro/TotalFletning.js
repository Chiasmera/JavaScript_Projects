let listOdd = [1, 3, 5, 7, 9];
let listEven = [0, 2, 4, 6, 8];

let oddIndex = 0;
let evenIndex = 0;

let result = [];

while (oddIndex < listOdd.length && evenIndex < listEven.length) {
    if (listOdd[oddIndex] < listEven[evenIndex]) {
        result.push(listOdd[oddIndex]);
        oddIndex++;
    } else {
        result.push(listEven[evenIndex]);
        evenIndex++;
    }
}

while (oddIndex < listOdd.length) {
    result.push(listOdd[oddIndex]);
    oddIndex++;
}

while (evenIndex < listEven.length) {
    result.push(listEven[evenIndex]);
    evenIndex++;
}

console.log(result)
