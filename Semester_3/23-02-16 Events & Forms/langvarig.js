// langvarig.js
function langvarig() {
    let start = Date.now();
    console.log(start % 100000);
    while (true){
        let nu = Date.now();
        if ((nu - start) >= 2000) return;
    }
}

let h3 = document.querySelector("button");
h3.onclick = langvarig;