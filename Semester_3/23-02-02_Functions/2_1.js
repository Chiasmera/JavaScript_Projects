//Programmer nedenstående funktioner, hvor array indeholder nogle tal:
//• max(array): returnerer det største element i arrayet.
//• contains(array, element): returnerer true hvis elementet findes i arrayet, ellers false
//• sum(array): returnerer summen af elementerne i arrayet.

/**
 * returnerer største ellement i det givne array
 * @param {Array} array 
 */
let max = function (array) {
    
    let currentMax = -1;

    for (const element of array) {
            if (element > currentMax) {
                currentMax = element;
            }
    };
    return currentMax;
};

let anArray = [5, 2, 8, 1, 0, 3, 7, 12, 78, 12, 5, 3];
console.log(`àrray er: ${anArray}`)
console.log(`Højeste tal er: ${max(anArray)}`);





/**
 * returnerer true hvis elementet findes i arrayet, ellers false
 * @param {Array} array 
 * @param {*} element 
 */
let contains = function (array, element) {
    for ( const value of array) {
        if (value === element) {
            return true;
        }
    }
    return false;

}

console.log(`Tallet 7 findes i arrayet?: ${contains(anArray, 7)}`)




/**
 * returnerer summen af elementerne i arrayet
 * @param {*} array 
 */
let sum = function (array) {
    let sum = 0;
    for (const value of array) {
        sum += value;
    }
    return sum;
}

console.log(`Summen af arrayet er: ${sum(anArray)}`)