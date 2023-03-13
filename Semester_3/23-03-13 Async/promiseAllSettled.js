// promiseAllSettled.js
function langvarig(nr) {
    return new Promise(function (resolve, reject) {
        let type = Math.trunc(Math.random() * 3);
        if (type === 0) throw new Error(`${nr} Slet ikke OK!`);
        setTimeout(afslut, 500);
        function afslut() {
            if (type === 1) resolve(`${nr} OK!`);
            else if (type === 2) reject(`${nr} Ikke OK!`);
        }
    });
}

Promise.allSettled([langvarig(1), langvarig(2)])
    .then((resultat) => {
        console.log('Resultater, fejl og exceptions:');
        console.log(resultat[0]);
        console.log(resultat[1]);
    });