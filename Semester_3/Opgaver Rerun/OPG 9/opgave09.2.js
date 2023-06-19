// opgave10.2.js

class StringStackError extends Error {}

class StringStack { // default constructor
    #stack = [];
    push(s) {
        if (typeof s !== 'string') throw new StringStackError('s er ikke en string!');
        this.#stack.push(s);
    }
    pop() { return this.#stack.pop(); }
}
const stringStack = new StringStack();
stringStack.push("Test af StringStack!");
console.log(stringStack.pop());
console.log(stringStack.pop());
stringStack.push(123);