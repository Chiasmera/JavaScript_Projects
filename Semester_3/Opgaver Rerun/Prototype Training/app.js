
function Legetøj (navn) {

    this.navn = navn,
    this.størrelse = 'medium',
    this.sjovhedsFaktor = 'medium',
    this.værdi = 'medium',
    this.farve = {
        primær: 'grå',
        sekundær: ''
    }
    this.tilgængelighed = 'medium'

    this.toString = function(){
        return `${this.navn}: ${this.sjovhedsFaktor} sjov, ${this.størrelse} størrelse, i ${this.farve.primær} ${this.farve.sekundær ? 'og ' + this.farve.sekundær : ''}`
    }
}

function Legoklods (navn, primærFarve) {
    this.prototype = new Legetøj(navn)
    Legetøj.call(this, navn)
    

    this.farve.primær =  primærFarve
    this.størrelse = 'lille'
    this.sjovhedsFaktor = 'meget'
    this.værdi = 'høj'

    return this
}

function Bil (navn, model, primærfarve, sekundærfarve) {
    let bil = new Legetøj()
    bil.navn = navn
    bil.model = model
    bil.farve.primær = primærfarve
    bil.farve.sekundær = sekundærfarve
    bil.sjovhedsFaktor = 'lidt'
    bil.værdi = 'stor'

    bil.kør = function () {
        return 'vroom vroom, siger bilen '+this.navn
    }
    return bil
}

function Skateboard (navn, model, primærfarve, sekundærfarve) {
    let skateboard = new Bil()
    skateboard.navn = navn
    skateboard.model = model
    skateboard.farve.primær = primærfarve
    skateboard.farve.sekundær = sekundærfarve
    return skateboard
}

console.log(new Legetøj('Bamse').toString())
console.log(new Legoklods('Rød Klods', 'rød'))
// console.log(new Legoklods('Blå Klods', 'blå').toString())
// console.log(new Bil('Jaguar', 'Jaguar', 'rød', 'sort').toString())
// const bil = new Bil('Gravko', 'Gravko', 'gul', 'sort')
// console.log(bil.toString())

// console.log(bil.kør());
// const skateboard = new Skateboard('Skatebaord', 'Zoomer', 'grøn', 'blå')
// console.log(skateboard.toString())
// console.log(skateboard.kør());

// console.log(skateboard.constructor);