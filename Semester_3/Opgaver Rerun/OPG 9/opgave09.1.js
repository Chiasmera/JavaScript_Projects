// opgave10.1.js
class Person {
    constructor(navn) { this.navn = navn; }
    toString() { return this.navn; }
    equals(p) { return p.constructor.name === "Person" && p.navn === this.navn; }
    static compare(p1, p2) { return p1.navn.localeCompare(p2.navn); }
}
class Studerende extends Person {
    constructor(navn, id) { super(navn); this.id = id; }
    toString() { return super.toString() + ": " + this.id; };
    equals(s) { return s.constructor.name === "Studerende" && s.navn === this.navn; }
}

let p1 = new Person("Viggo");
let p2 = new Person("Børge");
let s1 = new Studerende("Ida", 123);
let s2 = new Studerende("Ole", 123);

let liste = [p1, p2, s1, s2];
liste.sort(Person.compare);
console.log(liste.map(p => p.navn))

class Kat {
    constructor(navn) { this.navn = navn; }
    toString() { return 'Kat: ' + this.navn; };
}

let k1 = new Kat('Garfield');
liste.push(k1);
liste.sort(Person.compare);
console.log(liste.map(p => p.navn))