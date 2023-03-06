function Player(firstName, lastName, team, position) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.team = team;
    this.position = position;
}

Player.prototype = {};

Player.prototype.toString = function () { 
    return `${this.firstName} ${this.lastName} (${this.position}) ${this.team}`
}

let firstPlayer = new Player('Lucifer', 'Satan', 'Helvede', 'Øverst')
let secondPlayer = new Player ('Buddha', 'the Enlightened', 'Nirvana', 'Midten')



console.log(firstPlayer)