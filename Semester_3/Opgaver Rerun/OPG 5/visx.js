// visx.js
document.body.innerHTML = '';  // ryd body

const talHandler = event => event.target.value = Math.trunc(Math.random() * 100) + 1;
const tidHandler = event => event.target.value = new Date().toLocaleTimeString();
const rydHandler = () => { ids.tal.element.value = ''; ids.tid.element.value = ''; }

const ids = { // element property tilføjes nedenfor
    tal: { type: 'input', tekst: "Tal:", onclick: talHandler },
    tid: { type: 'input', tekst: "Tid:", onclick: tidHandler },
    ryd: { type: 'button', tekst: "Ryd", onclick: rydHandler },
}

for (id in ids) {
    if (ids[id].type === 'input') {
        document.body.innerHTML +=
            '<label id="' + id + '-label" for="' + id + '">' +
            ids[id].tekst + '</label><input id="' + id + '">';
    }
    else { // button
        document.body.innerHTML +=
            '<button id="' + id + '">' + ids[id].tekst + '</button>';
    }
}

elements = document.querySelectorAll('input, button');
for (element of elements) {
    ids[element.id].element = element;
    element.onclick = ids[element.id].onclick;
}