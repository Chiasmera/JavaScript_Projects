// JSON.js
let json = '{"x":1,"a":[true, null, "test"]}';
let objekt = JSON.parse(json);
console.log(objekt); // => { x: 1, a: [ true, null, 'test' ] }

objekt = { x: 1, m: function () { }, a: [true, undefined, 'test'] };
json = JSON.stringify(objekt);
console.log(json); // => {"x":1,"a":[true,null,"test"]}