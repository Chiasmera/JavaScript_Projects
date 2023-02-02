//Lav en string variabel der indeholder noget kode med nogle parenteser – (), {} og [].
//Lav dernæst en funktion, der skal afgøre, om parenteserne i koden er balancerede.
//Som datastruktur anvendes en stak (et array). Når der mødes en venstre parenteser i koden, skal den
//sættes på stakken – og når der mødes en højre parentes, skal det kontrolleres, om den tilsvarende venstre
//parentes er øverst på stakken. Brug metoderne push() og pop().
//→ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

let trueCode = 'let sum = function (array){ let sum = 0; for (const value of array) { sum += value; } return sum;}';
let falseCode = 'let sum = function (array){ let sum = 0; for (const value of array}) sum += value; } return sum;}}}}}';

function isBalanced(codeSnippet) {
    let returnValue = true;
    let balanceStack = [];
    const beginners = ['(', '{', '['];
    const enders = [')', '}', ']'];
    for (const value of codeSnippet.split('')) {
        if (beginners.includes(value)) {
            balanceStack.push(value);

        } else if (enders.includes(value)) {
            let popped = balanceStack.pop();
            if (typeof popped === 'undefined' || enders.indexOf(popped) != beginners.indexOf(value)) {
                returnValue = false;
                break;
            }
        }
    }
    if (balanceStack.length > 0) {
        returnValue = false;
    }
    return returnValue;
}

console.log(isBalanced(trueCode));
console.log(isBalanced(falseCode));
