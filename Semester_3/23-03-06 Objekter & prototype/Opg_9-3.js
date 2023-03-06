//Anvendes der Polimorfi i Observer pattern (opg 8.4)

//Ikke lige med min løsning, men i teorien skal hver observer jo reagere forskelligt på notify beskeden. 
//Dvs subject løber igennem sine observers og kalder den samme metode på alle, og den metode kan godt ligge forskellige steder (fx i en prototype)

function subject () {
    let observers = [];

    const registerObserver = function (observer) {
        observers.push(observer);
    }

    const notifyObservers = function(data) {
        observers.forEach( observer => observer(data))
    }

    return {register: registerObserver, notify:notifyObservers}

}

function observer (data) {
    console.log('Jeg er blevet notified om: '+data)
}

let observer1 = observer;
let observer2 = observer;
let mySubject = subject();

mySubject.register(observer1)
mySubject.register(observer2)
console.log(mySubject.notify('du er på listen'))