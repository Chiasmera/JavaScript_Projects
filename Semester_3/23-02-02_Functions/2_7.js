//Lav et array med tal.
//Modificer dernæst max(), contains() og sum() funktionerne fra opgave 2.1, så de bliver metoder på dette
//array.

let numberArray = [7, 12, 13, 3, 6, 2, 2, 9, 7, 13, 26, 3, 9];

numberArray.max = function () {
    
    let currentMax = -1;

    for (const element of numberArray) {
            if (element > currentMax) {
                currentMax = element;
            }
    };
    return currentMax;
};

numberArray.contains = function (element) {
    for ( const value of numberArray) {
        if (value === element) {
            return true;
        }
    }
    return false;

}

numberArray.sum = function () {
    let sum = 0;
    for (const value of numberArray) {
        sum += value;
    }
    return sum;
}

console.log(`array er: ${numberArray}`)
console.log(`array indeholder ${numberArray.max()} som max tal`)
console.log(`array indeholder tallet 2: ${numberArray.contains(2)}`)
console.log(`array indeholder tallet 1: ${numberArray.contains(1)}`)
console.log(`summen af array er: ${numberArray.sum()}`)
