//Lav et array med en række person objekter.
//Hver person skal have et navn, en e-mail og et mobilnummer.
//Afprøv CRUD på dette arrayet som vist på siden CRUD på arrays i arrays.pdf.

let persons = [
    {navn: 'julemanden', email: 'jul@gmail.com', tlf:82650184},
    {navn: 'Julius', email: 'juliusseeruo@gmail.com', tlf:2380177},
    {navn: 'Poul thomsen', email: 'pt@gmail.com', tlf:92274821},
    {navn: 'frikard ellemand', email: 'frikardellemand@gmail.com', tlf:66602618}
];


console.log(persons);
console.log('Opret satan')

persons[4] = {navn: 'Satan', email: '666@gmail.com', tlf:66666666};

console.log(persons);
console.log('Lav satan til jesus')

persons[4] = {navn: 'Jesus', email: '999@gmail.com', tlf:99999999};

console.log(persons);

console.log('delete julemanden');

delete persons[0];

console.log(persons);