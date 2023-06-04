let start = false, red = 255, green = 255, blue = 255, overIt = false, isGameStarted = false, dateWidth = 0, win = false, DNA = 0;

// c from center
let c = {
    x: windowSizeX/2,
    y: windowSizeY/2
}

let countries = [
    {
        name: 'Spirit Bligth',
        x: -65,
        y: 125,
        r: [2, 3, 5, 6],
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 50000000 + randomInteger(-104924, 104839)
    },
    {
        name: 'Sunset Domain',
        r: [0, 2, 4],
        x: 195,
        y: 110,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 7650000 + randomInteger(-24353, 18302)
    },
    {
        name: 'New Westem Republic',
        r: [4, 5, 6],
        x: 110,
        y: 95,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 9000000 + randomInteger(-149294, 120293)
    },
    {
        name: 'Wasteland',
        r: [5, 6, 4],
        x: -90,
        y: 0,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 15000000 + randomInteger(-193294, 293209)
    },
    {
        name: 'Fire Nation',
        r: [5, 6],
        x: 235,
        y: 25,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 8250000 + randomInteger(-129322, 129203)
    },
    {
        name: 'Earth City-States',
        r: [6],
        x: -60,
        y: -55,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 9000000 + randomInteger(-129032, 102934)
    },
    {
        name: 'Rainstorm Island',
        r: [],
        x: 80,
        y: -110,
        infected: true,
        sick: 0,
        deathes: 0,
        red: 1,
        radios: 15,
        population: 15000000 + randomInteger(-102934, 123394)
    },
    {
        name: 'Zhu Li',
        r: [6, 5, 3],
        x: - 105,
        y : -105,
        population: 9000000 + randomInteger(-120394, 19340)
    }
];

let widthestTask = 0;
let widthestUpdate = 0;
let widthestPrice = 0;

let tasks = [
    {
        title: 'Choose start country'
    }
];

let updates = [
    {
        title: 'Really big virus update',
        price: 999
    }
];

let time = {
    deltaTime: 0,
    day: new Date().getUTCDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    monthsWith31Days: [1, 3, 5, 7, 8, 10, 12],
    speed: 150,
    allDays: 1
}

function init() {
    for(i = 0; i < countries.length; i++) {
        countries[i].originalPopulation = countries[i].population;

        countries[i].idi = 1;
        countries[i].percentSickers = 0;
        countries[i].infected = true;
        countries[i].sick = 0;
        countries[i].deathes = 0;
        countries[i].red = 1;
        countries[i].radios = 15;
        countries[i].nextTimeForInfected = randomInteger(5, 15);

        for(j = 0; j < countries.length; j++) {
            if(i != j) {
                for(k = 0; k < countries[j].r.length; k++) {
                    if(countries[j].r[k] == i) {
                        let test = 0;

                        for(t = 0; t < countries[i].r.length; t++) {
                            if(countries[i].r[t] != j) {
                                test++;
                            }
                        }

                        if(test != countries[i].r.length - 1) {
                            countries[i].r.length++;
                            countries[i].r[countries[i].r.length - 1] = j;
                        }
                    }
                }
            }
        }
    }

    for(k = 0; k < tasks.length; k++) {
        if(tasks[k].done == undefined) {
            tasks[k].done = false;
        }
    }

    for(g = 0; g < updates.length; g++) {
        if(updates[g].buy == undefined) {
            updates[g].buy = false;
        }
    }
}

function update() {
    // start = true;

    if(red > 225) {
        red += (0 - red)/500;
    } if(green > 105) {
        green += (0 - green)/75;
    } if(blue > 17) {
        blue += (0 - blue)/25;
    }

    if(!start) {
        if(areColliding(mouseX, mouseY, 1, 1,  c.x - 75, c.y - 50, context.measureText('start').width, 40)) {
            overIt = true;
        } else {
            overIt = false;
        }
    } else if(!win) {
        time.deltaTime++;

        if(time.deltaTime%time.speed == 0) {
            time.day++;
            time.allDays++;

            for(i = 0; i < countries.length; i++) {
                if(time.allDays%countries[i].idi == 0 && time.allDays != 1 && countries[i].sick > 0) {
                    let originalSickers = countries[i].sick;
                    
                    for(j = 0; j < originalSickers; j++) {
                        let willItInfectOlthers = randomInteger(0, 100);
                        
                        if(willItInfectOlthers < 25 && countries[i].sick <= countries[i].population) {
                            countries[i].sick++;
                        } if(willItInfectOlthers < 2 && countries[i].sick > 9999) {
                            countries[i].deathes++;
                        }
                    }

                    if(time.allDays%countries[i].nextTimeForInfected == 0 && time.allDays != 1 && countries[i].sick > 0) {
                        countries[i].infected = true;
                        countries[i].nextTimeForInfected = randomInteger(5, 15);
                    }
                }
            }
        }
        
        let brCountriesWithAllDeaths = 0;
        for(i = 0; i < countries.length; i++) {
            countries[i].population = countries[i].originalPopulation - countries[i].deathes;

            countries[i].percentSickers = countries[i].sick/(countries[i].population/100);
            countries[i].red = countries[i].percentSickers/100*255;

            if(countries[i].deathes > countries[i].originalPopulation) {
                countries[i].deathes = countries[i].originalPopulation;
            }

            if(countries[i].sick > countries[i].population) {
                countries[i].sick = countries[i].population;
            }

            if(countries[i].deathes == countries[i].originalPopulation) {
                brCountriesWithAllDeaths++;
            }
        }

        if(brCountriesWithAllDeaths == countries.length - 1) {
            win = true;
        }

        for(t = 0; t < time.monthsWith31Days.length; t++) {
            if(time.month == time.monthsWith31Days[t]) {
                if(time.day > 31) {
                    time.day = 1;
                    time.month++;
                }
            } else {
                if(time.day > 30) {
                    time.day = 1;
                    time.month++;
                }
            }
        }

        if(time.month > 12) {
            time.month = 1;
            time.year++;
        }
    }

    for(k = 0; k < tasks.length; k++) {
        let widthOfText = context.measureText(tasks[k].title).width;
        if(widthOfText > widthestTask) {
            widthestTask = widthOfText/2;
        }
    }

    for(g = 0; g < updates.length; g++) {
        let widthOfText = context.measureText(updates[g].title).width/2;
        let widthOfText2 = context.measureText(updates[g].price).width/2;

        if(widthOfText > widthestUpdate) {
            widthestUpdate = widthOfText;
        }

        if(widthOfText2 > widthestPrice) {
            widthestPrice = widthOfText2;
        }
    }

    // for(i = 0; i < countries.length; i++) {
    //     countries[i].red++;
    // }

    c.x = windowSizeX/2;
    c.y = windowSizeY/2;
    // Reload();
}

function draw() {
    context.textAlign = "start";
    
    if(!start) {
        fillText("WARNING", windowSizeX/2 - textWidth("The updates aren't ready yet")/2 - 10, windowSizeY - 200, 30, 'Arial', 'red');
        fillText("The updates aren't ready yet", windowSizeX/2 - textWidth("The updates aren't ready yet")/2 - 10, windowSizeY - 150, 30, 'Arial', 'white');

        fillText('Plague Inc', c.x - 100, c.y - 150, 35, 'Arial', 'rgb('+red+','+green+','+blue+',1)');
        fillText('Scuffed edition', c.x - 85, c.y - 110, 20, 'Arial', 'rgb('+red+','+green+','+blue+',1)');
        
        if(!overIt) {
            fillText('start', c.x - 75, c.y - 50, 50, 'Arial', 'Orange');
        } else {
            fillText('start', c.x - 75, c.y - 50, 50, 'Arial', 'OrangeRed');
        }

    } if(win) {
        let winText = 'Your virus KILLED the WORLD!!!';
        let restartText = 'Press R to restart';
        
        context.textAlign = "center";
        fillText(winText, windowSizeX/2, windowSizeY/2 - 100, 35, 'Arial', 'Orange');
        fillText(restartText, windowSizeX/2, windowSizeY/2 - 50, 25, 'Arial', 'OrangeRed');
        context.textAlign = "start";
    } if(start && !win) {
        drawImage(map, c.x - 250, c.y - 250, 500, 500);
        
        fillText("Alive ", 10, 10, 25, 'Arial', 'white');
        fillText(" Sick ", 10 + context.measureText('Alive ').width, 10, 25, 'Arial', 'red');
        fillText(" Deaths ", 10 + context.measureText('Alive  Sick ').width, 10, 25, 'Arial', 'black');
        for(i = 0; i < countries.length; i++) {
            if(countries[i].aircraftToI != -1) {
                fillArc(countries[i].aX, countries[i].aY, 5, 'white');
            }

            let sickRadios = countries[i].radios + countries[i].percentSickers;
            transparent(50);
            fillArc(c.x - countries[i].x + countries[i].radios, c.y - countries[i].y + countries[i].radios, sickRadios/2, 'red');
            transparent(100);

            fillText(i + '. ' + countries[i].population, 10, 50 + i*30, 25, 'Arial', 'white');
            fillText(countries[i].sick, context.measureText(i + '. ' +countries[i].population).width + 25, 50 + i*30, 25, 'Arial', 'red');
            fillText(countries[i].deathes, context.measureText(i + '. ' +countries[i].population + countries[i].sick).width + 50, 50 + i*30, 25, 'Arial', 'black');

            for(j = 0; j < countries[i].r.length; j++) {
                drawLine(countries[i].radios + c.x - countries[i].x, countries[i].radios + c.y - countries[i].y, countries[i].radios + c.x - countries[countries[i].r[j]].x, countries[i].radios + c.y - countries[countries[i].r[j]].y, 1, 'rgb('+countries[i].red+',1,1,1)')
            }

            fillArc(c.x - countries[i].x + countries[i].radios, c.y - countries[i].y + countries[i].radios, countries[i].radios, 'rgb('+countries[i].red+',1,1,1)');
            context.strokeStyle = 'Black';
            context.stroke();

            if(countries[i].infected) {
                drawImage(infected, c.x - countries[i].x + 2, c.y - countries[i].y - 30, 25, 35);
            }

            fillText(i, c.x - countries[i].x + countries[i].radios/1.8, c.y - countries[i].y + countries[i].radios/1.8, 20, 'Arial', 'white');
        }

        dateWidth = textWidth('Year: ' + time.year + 'Month: ' + time.month + 'Day: ' + time.day);

        strokeRect(windowSizeX/2 - dateWidth/2 - 60, -1, dateWidth + 130, 40, 1, 'black');

        fillText('Year: ' + time.year, windowSizeX/2 - dateWidth/2 - 50, 10, 25, 'Arial', 'black');
        fillText('Month: ' + time.month, windowSizeX/2 - 25, 10, 25, 'Arial', 'black');
        fillText('Day: ' + time.day, windowSizeX/2 + dateWidth/2 - 25, 10, 25, 'Arial', 'black');

        fillText('DNA: ' + DNA, 10, windowSizeY - 30, 25, 'Arial', 'black');

        strokeRect(windowSizeX - widthestTask - 20, -1, widthestTask + 20, 50 +  tasks.length*30, 1, 'black');
        fillText('Tasks:', windowSizeX - widthestTask/2 - 50, 10, 25, 'Arial', 'black');
        for(k = 0; k < tasks.length; k++) {
            context.textAlign = "end";
            fillText(tasks[k].title, windowSizeX - 10, 50 + k*30, 25, 'Arial', 'white');

            if(tasks[k].done) {
                context.lineCap = "round";
                drawLine(windowSizeX - 10, 62.5 + k*30, windowSizeX - 10 - textWidth(tasks[k].title), 62.5 + k*30, 3, 'black');
            }
        }
        
        strokeRect(windowSizeX - widthestUpdate - widthestPrice - 40, windowSizeY - updates.length*30 - 50, windowSizeX - 1, windowSizeY - 1, 1, 'black');
        fillText('Updates:', windowSizeX - (widthestUpdate + widthestPrice)/2 + 40, windowSizeY - updates.length*30 - 40, 25, 'Arial', 'black');
        for(g = 0; g < updates.length; g++) {
            fillText(updates[g].price + '-', windowSizeX - context.measureText(updates[g].title).width - 20, windowSizeY - updates.length*30 + g*30 - 10, 25, 'Arial', 'red');
            fillText(updates[g].title, windowSizeX - 10, windowSizeY - updates.length*30 + g*30 - 10, 25, 'Arial', 'white');
        }

        context.textAlign = "start";
    }

    UpdateParticles();
}

function mouseup() {
    if(areColliding(mouseX, mouseY, 1, 1,  c.x - 75, c.y - 50, context.measureText('start').width, 40) && !start) {
        start = true;
    }

    if(start) {
        // console.log(c.x - mouseX, c.y - mouseY)
        for(i = 0; i < countries.length; i++) {
            if(areMouseColliding(c.x - countries[i].x + 2, c.y - countries[i].y - 30, 25, 35)) {
                ParticleEffect(c.x - countries[i].x + 2 + countries[i].radios, c.y - countries[i].y - 30 + countries[i].radios, 5, 5, 25, -5, -2, 5, -15, 100, 0, 2, true, 'red');
    
                countries[i].sick++;
                countries[i].infected = false;

                if(!isGameStarted) {
                    tasks[0].done = true;
                    DNA = 3;
    
                    for(j = 0; j < countries.length; j++) {
                        countries[j].infected = false;
                    }
    
                    isGameStarted = true;
                } else {
                    DNA += randomInteger(1, 5);
                }
            }
        }
    }

}

function keyup(key) {
    // console.log(key);

    if(key == 32) {
        // win = true;
    }

    if(win && key == 82) {
        Reload();
    }
}