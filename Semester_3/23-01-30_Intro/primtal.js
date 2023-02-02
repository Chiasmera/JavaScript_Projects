let target = 20;

let result = [];

for (let i = 0; i<=target; i++) {
    let primtal = true;
    for (let j = 2; j< i; j++) {
        
        if ( i % j === 0) {
            primtal = false;
        }
    }
    if (primtal) {
        result.push(i);
    }
}


console.log(result);

