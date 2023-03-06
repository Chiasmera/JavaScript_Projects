class StringStack {
    constructor () {
        this.stack = [];
        this.index = 0;
    }

    push(obj) {
        this.stack[this.index] = obj;
        this.index++
    }

    pop (obj) {
        if (this.index >= 0) {
            this.index--;
            return this.stack[this.index]
        }
    }
}


let testStack = new StringStack();

testStack.push('hej')
testStack.push('med')
testStack.push('dig')


console.log(testStack.pop());
console.log(testStack.pop());
console.log(testStack.pop());
console.log(testStack.pop());
