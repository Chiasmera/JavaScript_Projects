//Configurations
const daysInWeek = 6
const daysInMonth = 20
const monthInYear = 4
const seasons = [
    {
        name:'Morias Ascent',
        tempHigh: 15,
        tempLow: -5,
        tempChange: 5,
        humAvg: 70,
        humLow: 28,
        humChange: 20
    }, 
    {
        name:'Morias Descent',
        tempHigh: 5,
        tempLow: -10,
        tempChange: 5,
        humAvg: 86,
        humLow: 39,
        humChange: 20
    },
    {
        name:'Silvas Ascent',
        tempHigh: 25,
        tempLow: 2,
        tempChange: 5,
        humAvg: 65,
        humLow: 16,
        humChange: 40
    },
    {
        name:'Silvas Descent',
        tempHigh: 27,
        tempLow: 12,
        tempChange: 5,
        humAvg: 63,
        humLow: 16,
        humChange: 40
    }
]
const wind = ['Windstill', 'Slight Beeze', 'Windy', 'Strong Wind', 'Stormwinds']
const weather = {
    sunny: {
        desc: 'Sunny',
        img: 'assets/sun.png'
    },
    drizzle: {
        desc: 'Slight Drizzle',
        img: 'assets/raining.png'
    },
    rain: {
        desc: 'Rain',
        img: 'assets/raining.png'
    },
    snow: {
        desc: 'Snow',
        img: 'assets/snowing.png'
    },
    snowstorm: {
        desc: 'Snowstorm',
        img: 'assets/snowing.png'
    },
    thunder: {
        desc: 'Thunderstorm',
        img: 'assets/lightning.png'
    },
    dryThunder: {
        desc: 'Dry Thunderstorm',
        img: 'assets/lightning.png'
    },
    overcast: {
        desc: 'Overcast',
        img: 'assets/cloud.png'
    },
    cloudy: {
        desc: 'Cloudy',
        img: 'assets/cloud.png'
    },
    partlyCloudy: {
        desc: 'Partly Cloudy',
        img: 'assets/cloud.png'
    },
    fog: {
        desc: 'Foggy',
        img: 'assets/fog.png'
    },
}

//Temp variables
let currentDay = 4
let currentSeason = seasons[3]
let currentTemperature = 19;
let currentHumidity = 63;
let currentWind = wind[3]
let currentWeather = weather.drizzle


//Functions
function generateOverview(){
    let container = document.getElementById('allStatsContainer')
    if (container === null) {
        container = document.createElement('div')
        container.id = 'allStatsContainer'
        document.body.appendChild(container)
    }

    displayDate(document.body)
    displayTemp(container)
    displayHum(container)
    displayWind(container)
    displayWeather(container)


}

function generateNavigationButtons() {
        //day navigation buttons
        const buttonLeft = document.createElement('button')
        buttonLeft.id = 'previousDayButton'
        buttonLeft.textContent = 'Previous'
        document.body.appendChild(buttonLeft)
        buttonLeft.addEventListener('pointerdown', ()=> {
            previousDay()
            generateOverview()
        })
    
        const buttonRight = document.createElement('button')
        buttonRight.id = 'nextDayButton'
        buttonRight.textContent = 'Next'
        document.body.appendChild(buttonRight)
        buttonRight.addEventListener('pointerdown', ()=> {
            nextDay()
            generateOverview()
        })
}

function displayDate(parent) {
    let dateContainer = document.getElementById('dateContainer')
    if (dateContainer === null) {
        dateContainer = document.createElement('div')
        dateContainer.id = 'dateContainer'
        parent.appendChild(dateContainer)
    }
    
    const displayText = `${getDayName()}, week ${Math.floor(currentDay/6+1)} of ${currentSeason.name}`
    dateContainer.textContent = displayText


}

function getDayName() {
    let result = ''
    let ending = 'th'
    if (currentDay%10 === 1) {
        ending = 'st'
    } else if (currentDay%10 === 2) {
        ending = 'nd'
    }

    switch (currentDay % 6) {
        case 1:  
            result = `Winsday ${currentDay}${ending}`
            break;
        case 2:  
            result = `Wittlesday ${currentDay}${ending}`
            break;
        case 3:  
            result = `Weathersday ${currentDay}${ending}`
            break;
        case 4:  
            result = `Vowsday ${currentDay}${ending}`
            break;
        case 5:  
            result = `Woodsday ${currentDay}${ending}`
            break;
        case 0:  
            result = `Moonsday ${currentDay}${ending}`
            break;
        default: result = `Unknown day ${currentDay}${ending}`
    } 
    return result;
}

function displayTemp(parent) {
    let tempContainer = document.getElementById('tempContainer')
    if (tempContainer === null) {
        tempContainer = document.createElement('div')
        tempContainer.id = 'tempContainer'
        tempContainer.setAttribute('class', 'statContainer')

        const image = document.createElement('img')
        image.src = 'assets/thermometer.png'  
        tempContainer.appendChild(image)
        const text = document.createElement('p')
        tempContainer.appendChild(text)
        parent.appendChild(tempContainer)
    }

    tempContainer.lastChild.textContent = `${currentTemperature} C`
}

function displayHum (parent) {
    let humContainer = document.getElementById('humContainer')
    if (humContainer === null) {
        humContainer = document.createElement('div')
        humContainer.id = 'humContainer'
        humContainer.setAttribute('class', 'statContainer')

        const image = document.createElement('img')
        image.src = 'assets/drop.png'
        humContainer.appendChild(image)
    
        const text = document.createElement('p')
        humContainer.appendChild(text)
        parent.appendChild(humContainer)
    }

    humContainer.lastChild.textContent = `${currentHumidity}%`


}

function displayWind(parent) {
    let windContainer = document.getElementById('windContainer')
    if (windContainer === null) {
        windContainer = document.createElement('div')
        windContainer.id = 'windContainer'
        windContainer.setAttribute('class', 'statContainer')

        const image = document.createElement('img')
        image.src = 'assets/windsock.png'
        windContainer.appendChild(image)
        const text = document.createElement('p')
        windContainer.appendChild(text)
        parent.appendChild(windContainer)
    }

    windContainer.lastChild.textContent = `${currentWind}`


}

function displayWeather(parent) {
    let weatherContainer = document.getElementById('weatherContainer')
    if (weatherContainer === null) {
        weatherContainer = document.createElement('div')
        weatherContainer.id = 'weatherContainer'
        weatherContainer.setAttribute('class', 'statContainer')

        const image = document.createElement('img')
        
        weatherContainer.appendChild(image)

        const text = document.createElement('p')
        weatherContainer.appendChild(text)
        parent.appendChild(weatherContainer)
    }
    weatherContainer.firstChild.src = `${currentWeather.img}`
    weatherContainer.lastChild.textContent = `${currentWeather.desc}`
}

function previousDay() {
    currentDay--
    if (currentDay < 1) {
        currentDay = daysInMonth
        seasonIndex =seasons.indexOf(currentSeason) -1
        if (seasonIndex < 1) {
            seasonIndex = seasons.length-1
        }
        currentSeason = seasons[seasonIndex]
    }
    currentTemperature = currentSeason.dayArray[currentDay-1].temp
    currentHumidity = currentSeason.dayArray[currentDay-1].hum
    currentWind = currentSeason.dayArray[currentDay-1].wind
    currentWeather = currentSeason.dayArray[currentDay-1].weather
}

function nextDay() {
    currentDay++
    if (currentDay > daysInMonth) {
        currentDay = 1
        seasonIndex = seasons.indexOf(currentSeason) +1
        if (seasonIndex > seasons.length-1) {
            seasonIndex = 0
        }
        currentSeason = seasons[seasonIndex]
    }
    currentTemperature = currentSeason.dayArray[currentDay-1].temp
    currentHumidity = currentSeason.dayArray[currentDay-1].hum
    currentWind = currentSeason.dayArray[currentDay-1].wind
    currentWeather = currentSeason.dayArray[currentDay-1].weather
    console.log(currentSeason.dayArray[currentDay-1].weather);
}

function initialize () {
    let previousDay = undefined
    for (let season of seasons) {
        season.dayArray = []

        for (let i = 0; i < daysInMonth; i++) {
            const day = {
                temp: generateTemp(previousDay),
                hum: generateHum(previousDay),
                wind: generateWind(previousDay)
            }
            day.weather = generateWeather(day.temp, day.hum, day.wind)
            previousDay = day
            season.dayArray[i] = day
        }
    }
    currentTemperature = currentSeason.dayArray[currentDay-1].temp
    currentHumidity = currentSeason.dayArray[currentDay-1].hum
    currentWind = currentSeason.dayArray[currentDay-1].wind
    currentWeather = currentSeason.dayArray[currentDay-1].weather
}

function generateTemp(previousDay) {
    let result = 0;
    if (previousDay === undefined) {
        const range = currentSeason.tempHigh - currentSeason.tempLow
        result =  Math.round(Math.random()*range)+currentSeason.tempLow
    } else {
        let adjustment = 0
        if (previousDay.weather === weather.drizzle
            || previousDay.weather === weather.rain
            || previousDay.weather === weather.thunder
            || previousDay.weather === weather.snow
            || previousDay.weather === weather.snowstorm
            || previousDay.temp >= currentSeason.tempHigh ) {
            adjustment = adjustment - Math.round( Math.random() * currentSeason.tempChange )
        } else if (previousDay.weather === weather.sunny
            ||previousDay.weather === weather.overcast
            || previousDay.temp <= currentSeason.tempLow) {
            adjustment = Math.round( Math.random() * currentSeason.tempChange )
        } else {
            adjustment = Math.round( Math.random() * currentSeason.tempChange * 2 )
            adjustment = adjustment - Math.round( currentSeason.tempChange )
        }
        result = previousDay.temp + adjustment
        if (result < currentSeason.tempLow) {
            result = currentSeason.tempLow
        } else if (result > currentSeason.tempHigh) {
            result = currentSeason.tempHigh
        }
    }
    return result
}

function generateHum (previousDay) {
    let result = 0;
    if (previousDay === undefined) {
        result = currentSeason.humAvg + (Math.round(Math.random()*30) - 15 )
    } else {
        let adjustment = 0;
        if (previousDay.weather === weather.drizzle
            || previousDay.weather === weather.rain
            || previousDay.weather === weather.thunder
            || previousDay.weather === weather.snow
            || previousDay.weather === weather.snowstorm) {

            adjustment = adjustment -  Math.round( Math.random() * currentSeason.humChange)
        } else if (previousDay.weather === weather.sunny
                ||previousDay.weather === weather.overcast
                || previousDay.hum <= currentSeason.humLow) {
            adjustment = Math.round( Math.random() * currentSeason.humChange)
        } else {
            adjustment = Math.round( Math.random() * currentSeason.humChange * 2 ) - currentSeason.humChange
        }
        result = previousDay.hum + adjustment

        if (result < currentSeason.humLow) {
            result = currentSeason.humLow
        } else if (result > 100) {
            result = 100
        } else if (result - 30 > currentSeason.humAvg ) {
            result = result - 5
        } else if (result + 30 < currentSeason.humAvg < -30) {
            result = result + 5
        }
    }
    return result
}

function generateWind(previousDay) {
    let result = 0;
    if (previousDay === undefined) {
        result = wind[ Math.floor(Math.random()*wind.length)]
    } else {
        let adjustment = Math.round(Math.random()) > 0.5 ? 1 : -1 
        let index = wind.indexOf(previousDay.wind) + adjustment
        if (index < 0) {
            index = 0
        } else if (index > wind.length-1) {
            index = wind.length-1
        }
        result = wind[index]        
    }
    return result
}

function generateWeather(temp, hum, wind){
    const raindomizer = Math.floor(Math.random()*15 + 85)
    let result = weather.sunny
    if (hum > raindomizer) {
        if (temp <= 1) {
            if (raindomizer > 95) {
                //snowstorm
                result = weather.snowstorm
            } else {
                //snow
                result = weather.snow
            }
        } else {
            if (raindomizer > 95 ) {
                //thunderstorm
                result = weather.thunder
            } else if (raindomizer > 90) {
                //rain
                result = weather.rain
            } else {
                //drizzle
                result = weather.drizzle
            }
        }
    } else if (hum > 50 && (wind === 'Windstill' || wind === 'Slight Beeze') && raindomizer > 92 ) {
        //Foggy
        result = weather.fog

    } else if (hum > 75) {
        if (raindomizer > 95) {
            //dry thunder
            result = weather.dryThunder
        } else {
            //overcast
            result = weather.overcast
        }
    } else if (hum > 65) {
        //Cloudy
        result = weather.cloudy
    } else if (hum > 50) {
        //Partly Cloudy
        result = weather.partlyCloudy
    }
    return result
}

//Main
initialize()
generateOverview()
generateNavigationButtons()
