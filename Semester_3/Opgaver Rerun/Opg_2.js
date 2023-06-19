//__________ OPG 2.1 ______________________________________________________________________
console.log('OPG 2.1 ----------------------');
const numbersArray =[12, 57, 95, 64, 10, 13, 14, 57, 90, 64, 31, 87, 64, 81, 64, 75, 91, 1, 6, 47, 12, 4, 75]

function max(array) {
    return array.reduce( (acc, curr) => curr>acc? curr : acc)
}

function contains(array, element){
    return array.includes(element)
}

function sum(array){
    return array.reduce( (acc, curr) => acc += curr);
}

console.log(`Expected: 95, actual: ${max(numbersArray)}`)
console.log(`Expected: True, actual: ${contains(numbersArray, 31)}`)
console.log(`Expected: 1114, actual: ${sum(numbersArray)}`)


//__________ OPG 2.3 ______________________________________________________________________
console.log();
console.log('OPG 2.3 ----------------------');

function compare(s1, s2) {
    return s1.localeCompare(s2)
}

function compareLen(s1, s2) {
    return s1.length - s2.length === 0 ? 0 : s1.length - s2.length > 0 ? 1 : -1
}

function compareIgnoreCase(s1, s2) {
    return s1.toLowerCase().localeCompare(s2.toLowerCase())
}

console.log(`sammenligner "Hej" med "Hallo"`);
console.log(`Forventet resultat leksografisk: 1, aktuelt: ${compare('Hej', 'hallo')}`);
console.log(`Forventet resultat længde: -1, aktuelt: ${compareLen('Hej', 'hallo')}`);
console.log(`Forventet resultat ignore case: 1, aktuelt: ${compareIgnoreCase('Hej', 'hallo')}`);

//__________ OPG 2.4 ______________________________________________________________________
console.log();
console.log('OPG 2.4 ----------------------');

const longString =  'Dette er en string variabel med lang tekst. Den beskriver hvordan Julemanden slås med '+ 
                    'Satan om hvem der får en slikkepind. Den beskriver også hvordan Anders And i virkeligheden '+ 
                    'er en superskurk som arbejder på at få alle til at undervurdere ham'

function mapStringToObject (string) {
    const stringArray = string.split(' ')
    const object = {}
    stringArray.forEach(element => {
        const e = String(element.toLowerCase())
        if(object[`${e}`] === undefined) {
            object[`${e}`] = 1
        } else {
            object[`${e}`]++
        }
    });
    return object
}
const mappedStringObject = mapStringToObject(longString)

console.log(`Mapper en streng til et objekt`);
console.log(`forventet antal af ordet 'den' i objektet: 2, aktuelt: ${mappedStringObject.den}`);
console.log(`forventet antal af ordet 'som' i objektet: 1, aktuelt: ${mappedStringObject.som}`);
console.log(`forventet antal af ordet 'en' i objektet: 3, aktuelt: ${mappedStringObject.en}`);

//__________ OPG 2.5 ______________________________________________________________________
console.log();
console.log('OPG 2.5 ----------------------');

const persons = [
    {   name: 'Julemanden',
        email: 'julemand@gmail.com',
        mobil: '23819452'},
    {   name: 'Satan',
        email: 'satan@gmail.com',
        mobil: '66666666'}
]

console.log(`Persons array:`)
persons.forEach( (person) => console.log(person) )
console.log(`Adding a person: 'Julius'`);
persons.push(       {   name: 'Julius',
                        email: 'juliusseerup@gmail.com',
                        mobil: '23801777'})
console.log(`Updating mobile number on 'Julemanden'`);
persons[0].mobil = '12345678'
console.log(`Deleting 'Satan`);
delete persons[1]
persons.forEach( (person) => console.log(person) )


//__________ OPG 2.6 ______________________________________________________________________
console.log();
console.log('OPG 2.6 ----------------------');

const codestring = "function mapStringToObject (string) {const stringArray = string.split(' ')const object = {}stringArray.forEach(element => {const e = String(element.toLowerCase())"+
                    "if(object[`${e}`] === undefined) {object[`${e}`] = 1} else {object[`${e}`]++});return object}const mappedStringObject = mapStringToObject(longString)"

function isBalanced(string) {
    stringArray = string.split('')
    let balanced = true;
    const stack = []
    stringArray.forEach( (char) => {
        switch (char) {
            case '(' :
                stack.push(char)
                break;
            case '{' :
                stack.push(char)
                break;
            case '[' :
                stack.push(char)
                break;
            case ')' :
                balanced = '(' === stack.pop()
                break;
            case '}' :
                balanced = '{' === stack.pop()
                break;
            case ']' :
                balanced = '[' === stack.pop()
                break;
            default:
        }
        if (!balanced) {
            return balanced
        }
    })
    return balanced
}

console.log(`Checking if string is balanced. Expected: True, Actual: ${isBalanced(codestring)}`);


//__________ OPG 2.7 ______________________________________________________________________
console.log();
console.log('OPG 2.7 ----------------------');

numbersArray.max = max
numbersArray.contains = contains
numbersArray.sum = sum

console.log(`Expected: 95, actual: ${numbersArray.max(numbersArray)}`)
console.log(`Expected: True, actual: ${numbersArray.contains(numbersArray, 31)}`)
console.log(`Expected: 1114, actual: ${numbersArray.sum(numbersArray)}`)