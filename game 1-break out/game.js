// PRomenlivi za igracha
let igrachX = 350, igrachY = 550, igrachShir = 100, igrachVis = 40, igrachDx = 0, brPatroni = 0, patronX = [], patronY = [], leftOrRigth, dx = [], dy = [],tipKartinka = [], kartinka = [], igrachCelX = igrachX, start = false, MaxPatrons = 5, win = false, death = false, areInCanvas = 0;

// Promenlivi za kashonite 
let kashonX = [], kashonY = [], kashonRazmer = 50, imaLiGo = [];

for(let x=0; x<16; x++) {
    imaLiGo[x] = [];
    kartinka[x] = [];
    for(let y=0; y<9; y++) {
        if((x*50 >= 600 && y*50 >= 200 && x*50 <= 700 && y*50 <= 300) || 
        (x >= 1 && x <= 4 && y == 2) || ((x == 7 && y >= 2 && y <= 3) || (x == 8 && y >= 3 && y <= 4))) {
            kartinka[x][y] = randomInteger(5);
            imaLiGo[x][y] = true;
        }
    }
}

tipKartinka[0] = 'tomato';
tipKartinka[1] = 'lawngreen';
tipKartinka[2] = 'deepskyblue';
tipKartinka[3] = 'hotpink';
tipKartinka[4] = 'yellow';

function init() {

}

function update() {
    igrachX += igrachDx;
    igrachDx /= 1.1;

    if(isKeyPressed[65]) {
        igrachDx -= 0.50;
    } else if(isKeyPressed[68]) {
        igrachDx += 0.50;
    }

    if(igrachX < 0) {
        igrachX = 0;
    } else if(igrachX > 800 - igrachShir) {
        igrachX = 800 - igrachShir;
    }

    let brBoxes = 0;
    for(j=0; j<brPatroni; j++) {
        patronX[j] += dx[j];
        patronY[j] += dy[j];

        if(patronY[j] < 0) {
            dy[j] = -dy[j];
        } else if(patronX[j] > 790 || patronX[j] < 0) {
            dx[j] = -dx[j];
        } else if(areColliding( patronX[j], patronY[j], 10, 10,  igrachX, igrachY, igrachShir, igrachVis) && dy[j] > 0) {
            let cX = igrachX + igrachShir/2
                cY = igrachY + igrachVis/2;
            igrachCelX = igrachCelX + 10*dx[j];

            dx[j] = (igrachCelX-igrachX)/75 + (patronX[j]-cX)/-75;
            dy[j] = -dy[j]
        }

        if(patronY[j] < 600) {
            areInCanvas++;
        }

        for(let x=0; x<16; x++) {
            for(let y=0; y<9; y++) {
                if(imaLiGo[x][y]) {
                    if(areColliding( patronX[j], patronY[j], 10, 10,  x*50, y*50, 5, 50) || areColliding( patronX[j], patronY[j], 10, 10,  x*50 + 50, y*50, 1, 50)) {
                        dx[j] = -dx[j];
                        imaLiGo[x][y] = false;
                    } else if(areColliding( patronX[j], patronY[j], 10, 1,  x*50, y*50 + 50, 50, 1) || areColliding( patronX[j], patronY[j] + 10, 10, 1,  x*50, y*50, 50, 1)) {
                        dy[j] = -dy[j];
                        imaLiGo[x][y] = false;
                    }
                }
            }
        }
    }

    for(let x=0; x<16; x++) {
        for(let y=0; y<9; y++) {
            if(imaLiGo[x][y]) {
                brBoxes++;
            }
        }
    }
    
    if(brBoxes <= 0) {
        win = true;
    } else if(brBoxes > 0 && brPatroni >= MaxPatrons && areInCanvas <= 0) {
        death = true;
    }

    areInCanvas = 0;
}

function draw() {
    if(!start) {
        if(mouseX > 325 && mouseX < 375 && mouseY > 295 && mouseY < 320) {
            context.fillStyle = 'OrangeRed';
        } else {
            context.fillStyle = 'orange';
        }

        context.font = '25px Arial';
        context.fillText("Play", 325, 300);
    } else if(win) {
        context.fillStyle = 'OrangeRed';
        context.font = '50px Arial';
        context.fillText("You WIN!!!", 200, 250);

        context.fillStyle = 'Orange';
        context.font = '25px Arial';
        context.fillText("To restart press R", 210, 325);
    } else if(death) {
        context.fillStyle = 'OrangeRed';
        context.font = '50px Arial';
        context.fillText("You supid!!!", 200, 250);

        context.fillStyle = 'Orange';
        context.font = '25px Arial';
        context.fillText("To restart press R", 210, 325);
    } else {
        drawImage(back3D, 0, 0, 800, 600);
        drawImage(boxAlienYellowSquare, igrachX, igrachY, igrachShir, igrachVis);

        for(j=0; j<brPatroni; j++) {
            drawImage(ballOrTree, patronX[j], patronY[j], 10, 10);
        }

        for(i=0; i<MaxPatrons - brPatroni; i++) {
            context.fillStyle = 'RoyalBlue';
            context.fillRect(765, 585 - i*15, 25, 10);
        }

        for(let x=0; x<16; x++) {
            for(let y=0; y<9; y++) {
                if(imaLiGo[x][y]) {
                    context.fillStyle = tipKartinka[kartinka[x][y]];
                    context.fillRect(x*50, y*50, 50, 50);
                }
            }
        }
    }
}

function mouseup() {
    if(mouseX > 325 && mouseX < 375  &&  mouseY > 295 && mouseY < 320  &&  !start) {
        start = true;
    }
}

function keyup(key) {
    if(key == 82) {
        if(win || death) {
            location.reload();
        }
    }

    if(key == 87) {
        if(brPatroni < MaxPatrons  &&  start) {
            patronX[brPatroni] = igrachX + 45;
            patronY[brPatroni] = igrachY;
            if(igrachX < 800/2 - igrachShir/2) {
                dx[brPatroni] = -3;
            } else {
                dx[brPatroni] = 3;
            }
            dy[brPatroni] = -3;
            brPatroni++;
        }
    }
}