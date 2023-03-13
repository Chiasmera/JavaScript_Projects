// callback2.js
function langvarig(nr, callback) {
    let type = Math.trunc(Math.random() * 3);
    if (type === 0) throw new Error(`${nr} Slet ikke OK!`);
    setTimeout(afslut, 500);
    function afslut() {
        if (type === 1) callback(false, `${nr} OK!`);
        else if (type === 2) callback(`${nr} Ikke OK!`);
    }
}

try {
    langvarig(1, slut1);
}
catch (e) {
    console.log('Exception: ' + e);
}

function slut1(fejl, resultat) {
    if (fejl)
        console.log('Fejl: ' + fejl);
    else {
        console.log('Resultat: ' + resultat);
        try {
            langvarig(2, slut2);
        }
        catch (e) {
            console.log('Exception: ' + e);
        }
    }
}

function slut2(fejl, resultat) {
    if (fejl)
        console.log('Fejl: ' + fejl);
    else
        console.log('Resultat: ' + resultat);
}