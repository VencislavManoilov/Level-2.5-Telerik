let brKolkoni = 25,
    tipKartinka = [],    
    kartinka = [],
    brCvetove = 9,
    cvqt = -1,
    winner = false,
    particalX = [],
    particalY = [],
    dx = [],
    dy = [],
    brParticals = 25,
    particalCvqt = [],
    particalSize = 20
;

for(x=0; x<brKolkoni; x++) {
    kartinka[x] = [];
    for(y=0; y<brKolkoni; y++) {
        kartinka[x][y] = randomInteger(brCvetove);
    }
}

for(i=0; i<brParticals; i++) {
    particalCvqt[i] = randomInteger(brCvetove);

    particalX[i] = 400 - particalSize/2;
    particalY[i] = 600 - particalSize;
    
    dx[i] = randomInteger(15) - randomInteger(15);
    dy[i] = -randomInteger(15) - 5;
}

tipKartinka[0] = "red";
tipKartinka[1] = "Chartreuse";
tipKartinka[2] = "cyan";
tipKartinka[3] = "yellow";
tipKartinka[4] = "blue";
tipKartinka[5] = "purple";
tipKartinka[6] = "hotpink";
tipKartinka[7] = "tomato";
tipKartinka[8] = "LightGreen";

function update() {
    if(winner) {
        for(i=0; i<brParticals; i++) {
            particalX[i] += dx[i];
            particalY[i] += dy[i];

            dx[i] /= 1.025;
            dy[i] += 0.25;
        }
    }
}

function draw() {
    context.rotate(0);
    if(!winner) {
        let specheLiLi = 0;
        for(x=0; x<brKolkoni; x++) {
            for(y=0; y<brKolkoni; y++) {
                context.fillStyle = tipKartinka[kartinka[x][y]];
                context.fillRect(x*50 + 50, y*50 + 50, 50, 50);

                if(kartinka[x][y] == kartinka[0][0]) {
                    specheLiLi++;
                }
            }
        }

        if(specheLiLi == brKolkoni*brKolkoni) {
            winner = true;
        }

        for(i=0; i<brCvetove; i++) {
            context.fillStyle = tipKartinka[i];
            context.fillRect(brKolkoni*50 + 150 + i*75, 100, 50, 50);
        }

        context.fillStyle = 'Black';
        context.font = '25px Arial';
        context.fillText("Избери:", brKolkoni*50 + 250, 50);

        context.fillStyle = 'Chartreuse';
        context.font = '50px Arial';
        context.fillText("Drench", brKolkoni*50 + 225, 250);
    } else {
        context.fillStyle = 'Orange';
        context.font = '25px Arial';
        context.fillText("You WIN!!!", 350, 250);

        context.fillStyle = 'black';
        context.font = "15px Arial";
        context.fillText("Press SPACE to make pratical effect!", 300, 300);

        for(i=0; i<brParticals; i++) {
            context.fillStyle = tipKartinka[particalCvqt[i]];
            context.fillRect(particalX[i], particalY[i], particalSize, particalSize);
        }
    }
}

function mouseup() {
    for(i=0; i<brCvetove; i++) {
        if(areColliding(brKolkoni*50 + 150 + i*75, 100, 50, 50,  mouseX, mouseY, 1, 1) && kartinka[0][0] != i) {
            cvqt = kartinka[0][0];
            ocveti(0, 0 , i);
        }
    }
}

function keyup(key) {
    if(key - 49 >= 0 && key - 49 <= brCvetove - 1) {
        cvqt = kartinka[0][0];
        ocveti(0, 0, key-49);
    }

    if(winner && key == 32) {
        ParticalEffect();
    }
}

function ParticalEffect() {
    let spownX = randomInteger(800);
    let spownY = randomInteger(600);
    for(i=brParticals; i<brParticals + 25; i++) {
        particalCvqt[i] = randomInteger(brCvetove);
    
        particalX[i] = spownX;
        particalY[i] = spownY;

        dx[i] = randomInteger(15) - randomInteger(15);
        dy[i] = randomInteger(15) - randomInteger(15);
    }
    brParticals += 25;
}

function ocveti(x, y, i) {
    kartinka[x][y] = i;
    for(let di = -1; di<2; di++){
        for(let dj=-1; dj<2; dj++){
            if(x+di>=0 && x+di<brKolkoni && y+dj>=0 && y+dj<brKolkoni && kartinka[x+di][y+dj] == cvqt){
                ocveti(x + di, y + dj, i);
            }
        }
    }
}