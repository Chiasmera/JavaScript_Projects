const Objects = [
    {
        "type" : "Organisk Æble",
        "price" : 100,
        "weight" : 100,
        "organic" : true
    },
    {
        "type" : "Æble",
        "price" : 70,
        "weight" : 100,
        "organic" : false
    },
    {
        "type" : "Pære",
        "price" : 65,
        "weight" : 85,
        "organic" : false
    },
    {
        "type" : "Organisk Pære",
        "price" : 90,
        "weight" : 70,
        "organic" : true
    },
    {
        "type" : "Banan",
        "price" : 50,
        "weight" : 60,
        "organic" : true
    }
]

const frugtJSON = JSON.stringify(Objects)
 
const frugtArray = JSON.parse(frugtJSON)


const dyreste = frugtArray.reduce( (acc, cur) => cur.price > acc.price ? cur : acc ).type

let frugtCopy  = JSON.parse(frugtJSON)
const billigIkkeOrganiskFrugt = frugtCopy.map( (ele) => {
    if (!ele.organic) {
        ele.price = ele.price *0.7
    }
    return ele
})

const totalPris = frugtArray.reduce( (acc, cur) => { 
    acc += cur.price
    return acc
}, 0) 
const middelPris = totalPris / frugtArray.length

const totalvægt = frugtArray.reduce( (acc, cur) => { 
    acc += cur.weight
    return acc
}, 0)

const middelPrisPerVægt = totalPris / totalvægt

console.log(frugtArray);
console.log("dyreste pris: "+dyreste);
console.log(billigIkkeOrganiskFrugt);
console.log("middelpris for frugt: "+middelPris);
console.log("middelpris per vægt: "+middelPrisPerVægt);