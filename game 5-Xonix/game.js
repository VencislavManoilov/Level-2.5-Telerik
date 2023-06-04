// This code is made with level-2.5 engine V3, which is not public for now!!!
let poleSize = 10,
    playerX = 400 - poleSize,
    playerY = 0,
    playerDx = 0,
    playerDy = 0,
    pole = [],
    screenX = 800/poleSize,
    screenY = 600/poleSize,
    tochkaX1 = -1,
    tochkaY1 = -1,
    tochkaX2 = -1,
    tochkaY2 = -1,
    brVragove = prompt("Колко врага искаш? (Не могат да са по-малко от 1)"),
    vragX = [],
    vragY = [],
    dx = [],
    dy = [],
    time = 0,
    boost = 5,
    isInIt = true,
    tipKletka = [],
    maxBoost = 150,
    boostNum = 150,
    boostShow = 30,
    boostEnd = false,
    death = false
;

if(brVragove <= 0 || !isNumber(brVragove)) {
    brVragove = 1;
}

for(x=0; x<screenX; x++) {
    pole[x] = []
    for(y=0; y<screenY; y++) {
        if(x < 3 || y < 3 || x > screenX-5 || y > screenY-5) {
            pole[x][y] = 0;
        } else {
            pole[x][y] = 1;
        }
    }
}

for(i=0; i<brVragove; i++) {
    vragX[i] = (normalRandomInteger(screenX-2) + normalRandomInteger(2))*poleSize;
    vragY[i] = (normalRandomInteger(screenY-2) + normalRandomInteger(2))*poleSize;

    dx[i] = (normalRandomInteger(2) - normalRandomInteger(2))*poleSize/2;
    dy[i] = (normalRandomInteger(2) - normalRandomInteger(2))*poleSize/2;
}

tipKletka[0] = 'blue';
tipKletka[1] = 'darkBlue';
tipKletka[2] = 'pink';
tipKletka[3] = 'red';
tipKletka[4] = 'green';

function init() {
    boostNum = maxBoost;
}

function update() {
    time++;
    boostShow += (boostNum - boostShow) / 10;

    if(isKeyPressed[16] && !boostEnd) {
        boost = 1;
        boostNum--;
    } else {
        boost = 5;
        boostNum += 0.25;
    }

    if(boostNum > maxBoost) {
        boostNum = maxBoost;
    } else if(boostNum < 0) {
        boostNum = 0;
        boostEnd = true
    }

    if(boostEnd && boostNum > 50) {
        boostEnd = false;
    }

    if(time%boost == 0) {
        playerX += playerDx;
        playerY += playerDy;

        if(isKeyPressed[65] || isKeyPressed[37]) {
            playerDx = -poleSize;
            playerDy = 0;
        } else if(isKeyPressed[68] || isKeyPressed[39]) {
            playerDx = poleSize;
            playerDy = 0
        } else if(isKeyPressed[83] || isKeyPressed[40]) {
            playerDy = poleSize;
            playerDx = 0;
        } else if(isKeyPressed[87] || isKeyPressed[38]) {
            playerDy = -poleSize;
            playerDx = 0;
        }
    }

    if(time%5 == 0) {
        for(i=0; i<brVragove; i++) {
            if(dx[i] == 0) {
                dx[i] = (normalRandomInteger(2) - normalRandomInteger(2))*poleSize/2;
            } else if(dy[i] == 0) {
                dy[i] = (normalRandomInteger(2) - normalRandomInteger(2))*poleSize/2;
            }

            vragX[i] += dx[i];
            vragY[i] += dy[i];
        }
    }

    if(playerX < 0) {
        playerX = 0;
    } else if(playerX > screenX*poleSize - poleSize) {
        playerX = screenX*poleSize - poleSize;
    } else if(playerY < 0) {
        playerY = 0;
    } else if(playerY > screenY*poleSize - poleSize) {
        playerY = screenY*poleSize - poleSize;
    }

    for(x=0; x<screenX; x++) {
        for(y=0; y<screenY; y++) {
            if(areColliding(x*poleSize + 1, y*poleSize + 1, poleSize - 2, poleSize - 2,  playerX, playerY, poleSize, poleSize)) {
                if(pole[x][y] == 0) {
                    if(!isInIt) {
                        brDupkaiProverka(x, y);
                    } else {
                        isInIt = true;
                    }
                } else {
                    isInIt = false;
                    pole[x][y] = 2;
                }
            }
        }
    }

    for(i=0; i<brVragove; i++) {
        for(x=0; x<screenX; x++) {
            for(y=0; y<screenY; y++) {
                if(pole[x][y] == 0) {
                    if(areColliding(vragX[i] + poleSize - 1, vragY[i] + 1, 1, poleSize - 2,  x*poleSize, y*poleSize, poleSize, poleSize) ||
                    areColliding(vragX[i] + 1, vragY[i] + 1, 1, poleSize - 2,  x*poleSize, y*poleSize, poleSize, poleSize)) {
                        dx[i] = -dx[i];
                    }
                    
                    if(areColliding(vragX[i] + 1, vragY[i], poleSize - 2, 1,  x*poleSize, y*poleSize, poleSize, poleSize) ||
                    areColliding(vragX[i] + 1, vragY[i] + poleSize, poleSize - 2, 1,  x*poleSize, y*poleSize, poleSize, poleSize)) {
                        dy[i] = -dy[i];
                    }
                }

                if(areColliding(x*poleSize + 1, y*poleSize + 1, poleSize - 2, poleSize - 2,  vragX[i], vragY[i], poleSize, poleSize) && pole[x][y] == 2) {
                    death = true;
                }
            }
        }
    }
}

function draw() {
    if(!death) {
        for(x=0; x<screenX; x++) {
            for(y=0; y<screenY; y++) {
                fillRect(x*poleSize, y*poleSize, poleSize, poleSize, tipKletka[pole[x][y]]);
            }
        }
    
        for(i=0; i<brVragove; i++) {
            fillRect(vragX[i], vragY[i], poleSize, poleSize, 'red');
        }
    
        fillRect(playerX, playerY, poleSize, poleSize, 'hotpink');
    
        if(!boostEnd) {
            fillText("Hold Shift for more speed!!! (It is not recommended for slow people)", 10, 610, 25, 'Arial', 'black');
            fillRect(10, 650, boostShow, 25, 'Chartreuse');
        } else {
            fillText("Wait for boost to recharge", 10, 610, 25, 'Arial', 'black');
            fillRect(10, 650, boostShow, 25, 'red');
        }
    } else {
        fillText('You Lose', windowSizeX/2 - 150, windowSizeY/2 - 25, 50, 'Arial', 'orange');
        fillText('Press R to restart', windowSizeX/2 - 140, windowSizeY/2 + 25, 25, 'Arial', 'orangered');
    }
}

function keyup(key) {
    if(key == 82) {
        location.reload();
    }
}

function mouseup() {
    console.log(zapulni(Math.floor(mouseX/poleSize), Math.floor(mouseY/poleSize), 0));
}

function brDupkaiProverka(x, y) {
    let brDupki = 0, dupkaX = [], dupkaY = [], brPrazniDupki = [];
    isInIt = true;

    bezDiriq();

    for(let di = -1; di <= 1; di++){
        for(let dj = -1; dj <= 1; dj++){
            if(x+di>=0 && x+di<screenX-1 && y+dj>=0 && y+dj<screenY-1){
                if(pole[x+di][y+dj] == 1) {
                    if(x != 0 || y != 0 || x != screenX-1 || y != screenY-1) {
                        brDupki++;
                        dupkaX[brDupki] = x + di;
                        dupkaY[brDupki] = y + dj;
                    }
                }
            }
        }
    }

    for(i=0; i<brDupki; i++) {
        for(j=0; j<brDupki; j++) {
            if(i != j) {
                if(brPrazniDupki[i] > brPrazniDupki[j]) {
                    // zapulni(dupkaX[i], dupkaY[i]);
                } else {
                    // zapulni(dupkaX[j], dupkaY[j]);
                }
            }
        }
    }
}

function zapulni(x, y, brDupki) {
    let imaLiOshte = 0
    pole[x][y] = 0;

    for(di = -1; di <= 1; di++) {
        for(dj = -1; dj <= 1; dj++) {
            if(x+di >= 0 && x+di < screenX-1 && y+dj >= 0 && y+dj < screenY-1 && pole[x + di][y + dj] == 1) {
                zapulni(x + di, y + dj, brDupki++);
                return brDupki;
                imaLiOshte++;
            }
        }
    }

    if(imaLiOshte == 0) {
        
    }
}

function brPoleta(x, y, brDupki) {
    let imaLiOstanali = 0;

    for(di=-1; di<=1; di++) {
        for(dj=-1; dj<=1; dj++) {
            if(x+di>=0 && x+di<screenX-1 && y+dj>=0 && y+dj<screenY-1) {
                if(pole[x + di][y + dj] == 1) {
                    imaLiOstanali++;
                    brPoleta(x + di, y + dj, brDupki++);
                }
            }
        }
    }

    if(imaLiOstanali == 0) {
        return brDupki;
    }
}

function bezDiriq() {
    for(x=0; x<screenX; x++) {
        for(y=0; y<screenY; y++) {
            if(pole[x][y] == 2) {
                pole[x][y] = 0;
            }
        }
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}