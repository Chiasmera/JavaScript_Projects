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
