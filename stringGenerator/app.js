function constructArray(size) {
    let array = []
    for (let i = 0; i<size; i++) {
        const innerarray = []
        for (let i = 0; i<size;i++) {
            innerarray.push(0)
        }
        array.push(innerarray)
    }
    return array
}

function fillArray(array, amount) {
    const filledArray = array
    let blocks = amount

    let coordinates = [generateRandomNumber(5),generateRandomNumber(5)]
    // const randomStartCoordinates = [2, 2]
    while (blocks > 0) {
        if (fillOutSpace(filledArray, coordinates)) {
            blocks--
        }
        let next =  generateValidNextCoordinate(filledArray, coordinates)
        if (next.length > 0) {
            coordinates = next
        } else {
            console.log('no valid coordinate found');
            break;
        }
      
        
    }
    return filledArray  
}

function fillOutSpace(array, coordinateArray) {
    let result = true
    if (array[coordinateArray[0]][coordinateArray[1]] === 0) {
        array[coordinateArray[0]][coordinateArray[1]] = 1
    }else {
        result= false
    }
    return result
}

function generateRandomNumber(max) {
    return Math.floor(Math.random()*max)
}

function generateValidNextCoordinate (array, originCoordinates) {
    const directions = generateDirections(originCoordinates)
 

    for (direction of directions) {
        
        if (direction === 'up' && ( originCoordinates[1] <= 1 || array[originCoordinates[0]][originCoordinates[1] -1] === 1 )) {
            directions.splice(directions.indexOf(direction), 1)
        } else if (direction === 'down' && (originCoordinates[1] >= 4 ||  array[originCoordinates[0]][originCoordinates[1]+1] === 1)) {
            directions.splice(directions.indexOf(direction), 1)
        } else if (direction === 'left' && (originCoordinates[0] <= 0 ||  array[originCoordinates[0]-1][originCoordinates[1]] === 1)) {
            directions.splice(directions.indexOf(direction), 1)
        } else if (direction === 'right' && (originCoordinates[0] >= 4 ||  array[originCoordinates[0]+1][originCoordinates[1]] === 1)) {
            directions.splice(directions.indexOf(direction), 1)
        }
    }

    let result = []

    if (directions.length > 0) {
        const newDirection = directions[generateRandomNumber(directions.length)]
        let newCoordinates = originCoordinates
        if (newDirection === 'up') {
            newCoordinates[1]--
        } else if (newDirection === 'down') {
            newCoordinates[1]++
        } else if (newDirection === 'left') {
            newCoordinates[0]--
        } else if (newDirection === 'right') {
            newCoordinates[0]++
        } else {
            console.log('invalid new direction selected')
        }

        result = newCoordinates

    } else {
        console.log('no valid directions');
    }

    return result
    
}

function generateDirections(coordinates) {
    const directionArray = []
    if (coordinates[0] > 0) {
        directionArray.push('left')
    }
    if (coordinates[0] < 4) {
        directionArray.push('right')
    }
    if (coordinates[1] > 0) {
        directionArray.push('up')
    }
    if (coordinates[1] < 4) {
        directionArray.push('down')
    }
    return directionArray
}

function isWithinBounds(coordinate, direction) {
    let result = false
    if (direction === 'up') {
        if (coordinate[1] > 0) {
            result = true
        } 
    } else if (direction === 'right') {
        if (coordinate[0] < 4) {
            result = true
        } 
    } else if (direction === 'down') {
        if (coordinate[1] < 4) {
            result = true
        } 
    } else if (direction === 'left') {
        if (coordinate[0] > 0) {
            result = true
        } 
    } else {
        console.log('unknown direction selected:' + direction);
    }
    return result
}

function printArrayAsString(array) {
    let result = ''
    for (let column = 0; column < array.length; column++) {
        for (let row = 0; row < array[column].length; row++) {
            result += array[column][row]
        }
    }
    console.log(result);

}


// for (i = 0; i< 20; i++) {
    printArrayAsString(fillArray(constructArray(5), 12))
// } 