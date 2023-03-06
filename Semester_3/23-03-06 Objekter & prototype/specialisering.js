// specialisering.js
class Person {
    constructor(navn) {
        this.navn = navn;
    }
    toString() { return this.navn; }

    equals(object) {
        if (!(object instanceof Person)) {
            return false;
        } else if (object.navn === this.navn) {
            return true;            
        } else {
            return false;
        }
    }

    static compare(p1, p2) {
        if (p1.navn > p2.navn) {
            return 1;
        } else if (p1.navn < p2.navn) {
            return -1;
        } else {
            return 0;
        }
    }
}
class Studerende extends Person {
    constructor(navn, id) {
        super(navn);
        this.id = id;
    }
    toString() { return super.toString() + ": " + this.id; };

    equals(object) {
        if (!(object instanceof Studerende)) {
            return false;
        } else if (object.navn === this.navn && object.id === this.id) {
            return true;            
        } else {
            return false;
        }
    }
}

class Kat {
    constructor(navn) { this.navn = navn; }
    toString() { return 'Kat: ' + this.navn; };
}

let person = new Person("Viggo");
let studerende = new Studerende("Ida", 123);
console.log(person instanceof Person); // => true
console.log(person instanceof Studerende); // => false
console.log(studerende instanceof Person); // => true
console.log(studerende instanceof Studerende); // => true

let satan = new Person("Satan");
let julemanden = new Person("Julemanden");
let harryPotter = new Studerende("Harry Potter", 13)
let ender = new Studerende("Ender Wiggins", 42)
let malfoy = new Studerende("Malfoy", 314)
let xavier = new Person("Xavier")
let hades = new Kat("Hades")
let inviterede = [satan, harryPotter, julemanden, ender, malfoy, xavier, hades ]

console.log(inviterede.sort( (p1, p2) => Person.compare(p1, p2)));