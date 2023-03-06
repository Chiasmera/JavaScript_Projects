class Person {
    constructor(navn) {
        this.navn = navn;
    }

    toString() { return this.navn; }

    tilfoejTilGruppe (gruppe) {
        if (!gruppe instanceof Gruppe) {
            throw Error('argument er ikke en gruppe')            
        } else {
            if (this.gruppe !== gruppe) {
                let oldgroup = this.group;
                if (oldgroup != null) {
                    oldgroup.fjernMedlem(this)
                }
                this.gruppe = gruppe;
                if (gruppe != null) {
                    gruppe.tilfoejMedlem(this)
                }
            }
        }
    }
}


class Gruppe {
    constructor(navn) {
        this.navn = navn;
        this.medlemmer = []
    }

    toString() { return this.navn; }

    tilfoejMedlem (person) {
        if (!person instanceof Person) {
            throw Error('argument er ikke en person')
        } else {
            if (!this.medlemmer.includes(person)) {
                this.medlemmer.push(person)
                person.tilfoejTilGruppe(this)
            }
        }
    }

    fjernMedlem(person) {
        if (!person instanceof Person) {
            throw Error('argument er ikke en person')
        } else {
            if (this.medlemmer.includes(person)) {
                delete this.medlemmer[this.medlemmer.indexOf(person)]
                person.tilfoejTilGruppe(null)
            }
        }
    }


}

let satan = new Person("Satan");
let julemanden = new Person("Julemanden");
let xavier = new Person("Xavier")

let eliten = new Gruppe("eliten")


eliten.tilfoejMedlem(satan)
eliten.tilfoejMedlem(julemanden)
xavier.tilfoejTilGruppe(eliten)
console.log();
eliten.medlemmer.forEach( (medlem) => console.log(medlem.navn + " : " + medlem.gruppe))
eliten.fjernMedlem(satan)
console.log();
eliten.medlemmer.forEach( (medlem) => console.log(medlem.navn + " : " + medlem.gruppe))
console.log(satan.navn + " : " + satan.gruppe);