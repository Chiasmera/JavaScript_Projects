class Car {
    constructor (maerke, model) {
        this.maerke = maerke,
        this.model = model
    }

    toString() {
        let praesentation =''
        for (let property in this) {
            praesentation += `${property} : ${this[property]+''}\n`
        }
        return praesentation

    }

}

class RentalCar extends Car{
    constructor(maerke, model, rentPrDay) {
        super(maerke, model)
        if (rentPrDay % 1 !== 0) {
            throw new Error('Rent per day must be a whole number')
        } else {
            this.rentPrDay = rentPrDay
        }
        
    }
}

class ForSaleCar extends Car {
    constructor(maerke, model, price) {
        super(maerke, model)
        if (price % 1 !== 0) {
            throw new Error('Rent per day must be a whole number')
        } else {
            this.price = price
        }
    }

}



function main () {
    let provebil = new Car('toyota', 'T19')
    let proveLejeBil = new RentalCar('Skoda', 'Citigo', 90000)

    console.log(provebil.toString());
    console.log(proveLejeBil);
}

main();