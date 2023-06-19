//8.1
const persons = [
    {name: 'julius', number:'23801777', age:33},
    {name: 'julemanden', number:'51761834', age:961},
    {name: 'satan', number:'52483618', age:666},
    {name: 'peter', number:'96451837', age:17},
    {name: 'alexander', number:'32485167', age:29},
]

function findNumber(string) {
    return persons.find( person => person.number === string)
}
console.log(`find person med nummer: 23801777. Expected: Julius, Actual: ${findNumber('23801777').name}`);
console.log();

function findLeastAge() {
    const result = persons.reduce( (acc, curr) => curr.age < acc.age ? curr : acc)
    return result.age
}
console.log(`find mindste alder. Expected: 17, Actual: ${findLeastAge()}`);
console.log();

function generateID() {
    return persons.map( (person, index) => {
        person.id = index+1
        return person
    } )
}
console.log(`giv alle personer et ID. Expected første ID: 1, Actual: ${generateID()[0].id}`);
console.log();

function printNames() {
    return persons.map( (person) => person.name).sort()
}
console.log(`lav liste med personers navne sorterede. Expected: 'alexander, julemanden, julius, peter, satan', Actual: ${printNames()}`);
console.log();

function youngPersons() {
    return persons.filter( (person) => person.age < 30).map( (person) => {
        return {name: person.name,
                number: person.number}
    })
}
console.log(`lav array med navn og nummer på alle under 30. Expected: [{peter 96451837}, {alexander 32485167}], Actual: ${youngPersons()}`);
console.log();


//8.2 & 8.3
function compareSort(stringarray, compareFunction) {
    if (!Array.isArray(stringarray)) {
        throw new Error('Typeerror: First parameter must be an array')
    } else {
        stringarray.forEach(element => {
            if (typeof element !== 'string') {
                throw new Error('Typeerror: array must only contain strings')
            }
        });
    }
    if ( typeof compareFunction !== 'function') {
        throw new Error('Typeerror: Second parameter must be a function')
    }
    if (arguments.length !== 2) {
        throw new Error('Argument error: You must provide excactly two arguments: a string array and a comparing function')
    }
    
    return stringarray.sort(compareFunction)
}

function compareLen(s1, s2) {
    return s1.length - s2.length === 0 ? 0 : s1.length - s2.length > 0 ? 1 : -1
}

function compareIgnoreCase(s1, s2) {
    return s1.toLowerCase().localeCompare(s2.toLowerCase())
}

const sortByLength = (array) => compareSort(array, compareLen)
const sortByIgnoreCase = (array) => compareSort(array, compareIgnoreCase)

const array = ['Hej', 'med', 'dig', 'din', 'Frække', 'fyr']

console.log(sortByLength(array));
console.log(sortByIgnoreCase(array));

//8.4
function observer (name) {
    return {notify: () => console.log(`${name} is notified`)}

}

function subject () {
    const observers = []
    return {
        observers: observers,
        registerObserver: (observer) => observers.push(observer),
        notifyObservers: () => observers.forEach( (observer) => observer.notify())
    }
}

const observer1 = observer('1')
const observer2 = observer('2')
const subject1 = subject()

subject1.registerObserver(observer1)
subject1.registerObserver(observer2)
console.log(`Subscribing observers and printing observer list: expected 1 & 2, Actual: ${subject1.observers}`);
console.log(`notifying observers: expected response from 1 & 2, Actual: ${subject1.notifyObservers()}`);