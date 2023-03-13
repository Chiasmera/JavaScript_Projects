// async2.js
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

async function main() {
    try {
        let resultat = await langvarig(1);
        console.log('Resultat: ' + resultat);
        resultat = await langvarig(2);
        console.log('og ' + resultat);
    }
    catch (e) {
        console.log('Fejl/exception: ' + e);
    }
}
main();