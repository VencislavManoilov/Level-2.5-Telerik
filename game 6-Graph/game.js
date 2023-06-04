let clicked = false, izbrano1 = -1, izbrano2 = -1, time = 0, secret = false, hideCells = false;

let graph = {
    br: 10,
    x: [],
    y: [],
    sizeX: [],
    sizeY: [],
    svyrzani: [[1, 3, 5, 9], [5, 2, 8], [7, 4], [3, 9], [8, 6], [6, 7]],
    izbran: -1,
    distance: 2.5,
    needToGoX: [],
    needToGoY: [],
    fixedUpdateTime: 25
}

let rules = {
    scale: 0,
    speed: 2,
    tipDejstvie: []
}

showRules = false;

rules.tipDejstvie[-1] = 'S: show/hide rules'
rules.tipDejstvie[0] = 'Space: connect';
rules.tipDejstvie[1] = 'D: disconnect all cells';
rules.tipDejstvie[2] = 'Enter: new cell';
rules.tipDejstvie[3] = 'Hold P: spam new cells';
rules.tipDejstvie[4] = 'Backspace: delete cell';
rules.tipDejstvie[5] = 'H: hide cells';
rules.tipDejstvie[6] = 'A: connect ALL';
rules.tipDejstvie[7] = 'R: reset';
rules.tipDejstvie[8] = 'Shift: reset really fast';
rules.tipDejstvie[9] = 'Q: reload page';

for(let i=0; i<graph.br; i++) {
    graph.sizeX[i] = randomInteger(25, 50);
    graph.sizeY[i] = graph.sizeX[i];

    graph.x[i] = randomInteger(graph.sizeX[i], windowSizeX - graph.sizeX[i]*2);
    graph.y[i] = randomInteger(graph.sizeY[i], windowSizeY - graph.sizeY[i]*2);

    graph.needToGoX[i] = graph.x[i];
    graph.needToGoY[i] = graph.y[i];

    if(graph.svyrzani[i] == undefined) {
        graph.svyrzani[i] = [];
    }
}

function update() {
    time++;

    if(clicked) {
        graph.x[graph.izbran] = mouseX - graph.sizeX[graph.izbran]/2;
        graph.y[graph.izbran] = mouseY - graph.sizeY[graph.izbran]/2;
    }

    if(secret) {
        for(c=0; c<3; c++) {
            createNew();
        }
    }

    if(izbrano1 != -1 && izbrano2 != -1) {
        if(graph.svyrzani[izbrano1].length != 0) {
            graph.svyrzani[izbrano1] += ',' + izbrano2;
        } else {
            graph.svyrzani[izbrano1] += izbrano2;
        }

        izbrano1 = -1;
        izbrano2 = -1;
    }

    if(time%graph.fixedUpdateTime == 0) {
        FixedUpdate();
    }

    for(let i=0; i<graph.br; i++) {
        graph.x[i] += (graph.needToGoX[i] - graph.x[i])/25;
        graph.y[i] += (graph.needToGoY[i] - graph.y[i])/25;

        if(graph.svyrzani[i] == undefined) {
            graph.svyrzani[i] = [];
        }
    }

    if(isKeyPressed[16]) {
        reloadGen();
    }

    if(showRules) {
        if(rules.scale < 25) {
            rules.scale += rules.speed;
        }
    } else {
        rules.scale = 0;
    }
}

function FixedUpdate() {
    for(i=0; i<graph.br; i++) {
        graph.needToGoX[i] += randomInteger(-graph.distance, graph.distance);
        graph.needToGoY[i] += randomInteger(-graph.distance, graph.distance);
    }
}

function draw() {
    for(x=0; x<windowSizeX/50; x++) {
        for(y=0; y<windowSizeY/50; y++) {
            strokeRect(x*50, y*50, 50, 50, 1, 'black');
        }
    }

    for(let i=0; i<graph.br; i++) {
        if(!hideCells) {
            drawImage(ballOrTree, graph.x[i], graph.y[i], graph.sizeX[i], graph.sizeY[i]);
        }

        for(j=0; j<graph.svyrzani[i].length; j++) {
            drawLine(graph.x[i] + graph.sizeX[i]/2, graph.y[i] + graph.sizeY[i]/2, graph.x[graph.svyrzani[i][j]] + graph.sizeX[graph.svyrzani[i][j]]/2, graph.y[graph.svyrzani[i][j]] + graph.sizeY[graph.svyrzani[i][j]]/2, 1, 'white');
        }

        if(!hideCells) {
            if(graph.svyrzani[i].length != 0) {
                fillText('sysedi: ' + graph.svyrzani[i], graph.x[i] + graph.sizeX[i], graph.y[i] + graph.sizeY[i], 20, 'Arial', 'DarkGrey');
            }

            fillText(i, graph.x[i] + graph.sizeX[i]/3.75, graph.y[i] + graph.sizeY[i]/3.75, 25, 'Arial', 'GhostWhite');
        }
    }

    fillText(rules.tipDejstvie[-1], 10, 5, 25, 'Arial', 'OrangeRed');
    if(showRules) {
        for(v=0; v<rules.tipDejstvie.length; v++) {
            fillText(rules.tipDejstvie[v], 10, v*rules.scale + 30, 25, 'Arial', 'Orange');
        }
    }

    UpdateParticles();
}

function mousedown() {
    clicked = true;

    for(let i=0; i<graph.br; i++) {
        if(areColliding(mouseX, mouseY, 1, 1,  graph.x[i], graph.y[i], graph.sizeX[i], graph.sizeY[i])) {
            graph.izbran = i;
            return;
        } else {
            graph.izbran = -1;
        }
    }
}

function mouseup() {
    clicked = false;

    graph.needToGoX[graph.izbran] = graph.x[graph.izbran];
    graph.needToGoY[graph.izbran] = graph.y[graph.izbran];
}

function keyup(key) {
    for(let i=0; i<graph.br; i++) {
        if(areColliding(mouseX, mouseY, 1, 1,  graph.x[i], graph.y[i], graph.sizeX[i], graph.sizeY[i])) {
            if(key == 32) {
                if(izbrano1 == -1) {
                    izbrano1 = i;
                } else if(izbrano2 == -1) {
                    izbrano2 = i;
                }
            }

            if(key == 8) {
                Delete(i);
            }
        }
    }

    if(key == 13) {
        createNew();
    } if(key == 80) {
        secret = false;
    } if(key == 82) {
        reloadGen();
    } if(key == 83) {
        showRules = !showRules;
    } if(key == 81) {
        location.reload();
    } if(key == 72) {
        hideCells = !hideCells;
    } if(key == 68) {
        disconnectAll();
    }

    if(key == 65) {
        for(let i=0; i<graph.br; i++) {
            for(j=0; j<=graph.svyrzani[i].length; j++) {
                if(graph.svyrzani[i].length != 0) {
                    graph.svyrzani[j] += ',' + i;
                } else {
                    graph.svyrzani[j] += i;
                }
            }
        }
    }
}

function keydown(key) {
    if(key == 80) {
        secret = true;
    }

    console.log(key)
}

function reloadGen() {
    for(let i=0; i<graph.br; i++) {
        graph.sizeX[i] = randomInteger(25, 50);
        graph.sizeY[i] = graph.sizeX[i];
    
        graph.x[i] = randomInteger(graph.sizeX[i], windowSizeX - graph.sizeX[i]*2);
        graph.y[i] = randomInteger(graph.sizeY[i], windowSizeY - graph.sizeY[i]*2);
    
        graph.needToGoX[i] = graph.x[i];
        graph.needToGoY[i] = graph.y[i];
    
        if(graph.svyrzani[i] == undefined) {
            graph.svyrzani[i] = [];
        }
    }
}

function disconnectAll() {
    for(let i=0; i<graph.br; i++) {
        if(graph.svyrzani[i].length > 0) {
            graph.svyrzani[i] = [];
        }
    }
}

function createNew() {

    graph.sizeX[graph.br] = randomInteger(25, 50);
    graph.sizeY[graph.br] = graph.sizeX[graph.br];

    graph.x[graph.br] = randomInteger(graph.sizeX[graph.br], windowSizeX - graph.sizeX[graph.br]*2);
    graph.y[graph.br] = randomInteger(graph.sizeY[graph.br], windowSizeY - graph.sizeY[graph.br]*2);

    graph.needToGoX[graph.br] = graph.x[graph.br];
    graph.needToGoY[graph.br] = graph.y[graph.br];

    if(graph.svyrzani[graph.br] == undefined) {
        graph.svyrzani[graph.br] = [];
    }

    ParticleEffect(graph.x[graph.br], graph.y[graph.br], 10, 10, 5, -10, -5, 10, -25, 100, 3, true);

    graph.br++;
}

function Delete(i) {

    ParticleEffect(graph.x[i], graph.y[i], 10, 10, 5, -10, -5, 10, -25, 100, 0, true, 'red');

    graph.sizeX[i] = graph.sizeX[graph.br-1];
    graph.sizeY[i] = graph.sizeX[graph.br-1];

    graph.x[i] = graph.x[graph.br-1];
    graph.y[i] = graph.y[graph.br-1];

    graph.needToGoX[i] = graph.needToGoX[graph.br-1];
    graph.needToGoY[i] = graph.needToGoY[graph.br-1];

    if(graph.svyrzani[graph.br-1] == undefined) {
        graph.svyrzani[graph.br-1] = [];
    }

    graph.br--;
}