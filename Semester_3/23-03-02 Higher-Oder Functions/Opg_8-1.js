let persons = [
    {name:'Julemanden', age:700, phone:58028105},
    {name:'Satan', age:6000, phone:84027501},
    {name:'Oberon', age:1468, phone:72849178},
    {name:'Harry Potter', age:11, phone:38265495},
    {name:'Julius', age:32, phone:23801777},
]

console.log(persons)
console.log(`Person med tlf 23801777: ${persons.filter( (element) => element.phone === 23801777 )[0].name}`)

console.log(`mindste alder: ${persons.reduce( (min, user) => user.age < min ? user.age : min, persons[0].age )}`)

let idStart = 0;
persons.forEach( (element, index, array) => element.id = ++idStart )
console.log(`alle personer tildelt et id:`)
persons.forEach( (el) => console.log(el.name+': id='+el.id))

console.log(`Array indeholder navne: `+ persons.map( (person) => person.name) 
                                               .sort()
                                                .reduce( (acc, name) => acc+name+", "  , ""))


let under30Array = persons.filter((person) => person.age < 30 ).map( (person) => ({name:person.name, phone:person.phone}) )
console.log(`Navn og nummer på dem under 30:`)
under30Array.forEach((element) => console.log(element.name + ": " + element.phone))
