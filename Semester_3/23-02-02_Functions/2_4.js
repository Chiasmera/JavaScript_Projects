//Lav en string variabel med en længere tekst.
//Anvend dernæst et objekt som en map til at beregne antallet af de forskellige ord i teksten.
//Brug metoden split() til at opdele teksten i ord.
//→ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split


let saetning = 'Julemanden deler gaver ud til dem som ikke har tævet andre for deres religion, hudfarve eller seksuelle orientering';

function splitStringToObject (string) {
    let object = {...string.split(' ')};
    return object;
}

console.log(splitStringToObject(saetning));
