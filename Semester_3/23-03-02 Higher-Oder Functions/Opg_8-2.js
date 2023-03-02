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

class TypeError extends Error{};

function compareSort (comparatorFunc) {
    return sortFunc = function (stringArray) {
        try {
            if (stringArray instanceof Array) {
                return stringArray.sort( (s1, s2) => comparatorFunc(s1, s2))
            } else {
                throw new TypeError(`Wrong parameter type. Expected array, got: ${typeof stringArray}`)
            }
        } catch (e) {
            if (e instanceof TypeError ) {
                console.log(e.message)
            } else {
                throw e;
            }

        }
        

    } 
}

let strings = ['Hallo', 'med', 'dig','Satan', 'din','frække','fyr']


let lenSort = compareSort(compareLen);
let ignoreCaseSort = compareSort(compareIgnoreCase);

console.log(strings);
console.log(`Sorted by length:`);
for (let string of lenSort(strings)) {
    console.log(string)
}
console.log(`Sorted by ignoreCase:`);
for (let string of ignoreCaseSort(strings)) {
    console.log(string)
}

try {
    console.log(`Sorted with wrong parameter:`);
    for (let string of ignoreCaseSort('forkert type')) {
        console.log(string)
    }
} catch (e) {
    console.log('Caught an error with message: '+e.message)

}
