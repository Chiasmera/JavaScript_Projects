// propagation.js
let h3 = document.querySelector("h3");

h3.onclick = propagation;
document.body.onclick = propagation;

function propagation(event) {
    console.log('target: ' + event.target.tagName);
    console.log('currentTarget: ' + event.currentTarget.tagName);
    event.stopPropagation();
}