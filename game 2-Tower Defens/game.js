let imaLiblock = [],
    brPaveta = 0,
    paveX = [],
    paveY = [],
    brVragove = 1,
    playerX = [],
    playerY = [],
    timer = [],
    doKoePaveE = [],
    brDefens = 0,
    defensX = [],
    defensY = [],
    MaxDefenes = 3,
    damage = [],
    showDamage =[],
    maxDamage = [],
    timeForNewVrag = 0,
    speed = [],
	kojIgrachEPryv = [],
	kolkoIgrachaSaVytre = [],
	patronX = [],
	patronY = [],
    target = [],
	brPatroni = [],
    time = [],
    tipKartinka = [],
    kartinka = [],
    vidTrase = randomInteger(3),
    start = false,
    udarenLiE = []
;

function init() {
    
}

for(let j=0; j<brVragove; j++) {
    doKoePaveE[j] = 0;
    playerX[j] += paveX[doKoePaveE[j]]*25 - playerX[j];
    playerY[j] += paveY[doKoePaveE[j]]*25 - playerY[j];
    maxDamage[j] = 100 + randomInteger(5)*25;
    damage[j] = maxDamage[j];
    showDamage[j] = 30;
    timer[j] = 0;
    speed[j] = 100 - randomInteger(6)*10;
    kartinka[j] = randomInteger(3);
}

if(vidTrase == 0) {
    brPaveta =  40;
    paveX = [ 0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    paveY = [ 8, 8, 8, 8, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 20, 19, 18, 17, 16, 15, 14, 14, 14, 14, 14];
} else if(vidTrase == 1) {
    brPaveta =  33;
    paveX = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    paveY = [ 10, 10, 10, 10, 9, 8, 8, 8, 8, 9, 10, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 19, 19, 18, 17, 16];
} else if(vidTrase == 2) {
    brPaveta =  30;
    paveX = [ 12, 12, 12, 12, 12, 13, 14, 14, 14, 14, 15, 16, 17, 18, 19, 20, 21, 21, 21, 21, 20, 19, 18, 18, 18, 17, 16, 15, 15, 15];
    paveY = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 9, 9, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
}



tipKartinka[0] = bird;
tipKartinka[1] = bee;
tipKartinka[2] = femaleWalk1;

function update() {
    if(start) {
        for(j=0; j<brVragove; j++) {
            timer[j]++;

            if(timer[j] >= speed[j]) {
                doKoePaveE[j]++;
                timer[j] = 0
            }

            playerX[j] = paveX[doKoePaveE[j]]*25;
            playerY[j] = paveY[doKoePaveE[j]]*25;

            showDamage[j] += (damage[j] - showDamage[j]) / 25;

            if(damage[j] >= maxDamage[j]) {
                damage[j] = maxDamage[j];
            }

            if(damage[j] <= 0) {
                doKoePaveE[j] = doKoePaveE[brVragove];
                playerX[j] = playerX[brVragove];
                playerY[j] = playerY[brVragove];
                maxDamage[j] = maxDamage[brVragove];
                damage[j] = damage[brVragove];
                showDamage[j] = showDamage[brVragove];
                timer[j] = timer[brVragove];
                speed[j] = speed[brVragove];
                brVragove--;
            }

            for(d=0; d<brDefens; d++) {
                time[d]++;

                if(time[d] >= 50) {
                    if(areColliding( defensX[d] - 50, defensY[d] - 50, 150, 150,  playerX[j], playerY[j], 50, 50)) {
                        patronX[brPatroni[d]] = defensX[d];
                        patronY[brPatroni[d]] = defensY[d];
                        udarenLiE[brPatroni[d]] = false;
                        target[brPatroni[d]] = j;
                        brPatroni[d]++;
                    }

                    time[d] = 0;
                }

                for(p=0; p<brPatroni[d]; p++){
                    patronX[p] += (playerX[target[p]] - patronX[p]) / 30;
                    patronY[p] += (playerY[target[p]] - patronY[p]) / 30;
    
                    if(udarenLiE[p]) {
                        patronX[p] = -10000;
                    }
                    
                    if(areColliding( patronX[p], patronY[p], 25, 25,  playerX[j], playerY[j], 50, 50)) {
                        udarenLiE[p] = true;
    
                        damage[j] -= 10;
                    }
                }
            }
        }

        timeForNewVrag++;
        if(timeForNewVrag >= 500) {
            doKoePaveE[brVragove] = 0;
            playerX[brVragove] += paveX[doKoePaveE[brVragove]]*25 - playerX[brVragove];
            playerY[brVragove] += paveY[doKoePaveE[brVragove]]*25 - playerY[brVragove];
            maxDamage[brVragove] = 100 + randomInteger(5)*25;
            damage[brVragove] = maxDamage[brVragove];
            showDamage[brVragove] = 30;
            timer[brVragove] = 0;
            speed[brVragove] = 100 - randomInteger(6)*10;
            kartinka[brVragove] = randomInteger(3);
            brVragove++;

            timeForNewVrag = 0;
        }
    }
}

function draw() {
    if(!start) {
        if(!areColliding(mouseX, mouseY, 1, 1,  350, 200, 60, 25)) {
            context.fillStyle = 'OrangeRed';
        } else {
            context.fillStyle = 'orange';
        }
        context.font = '25px Arial';
        context.fillText("Start", 350, 200);

        context.fillStyle = 'OrangeRed';
        context.fillText("Are you ready?", 300, 150);
    } else {
        drawImage(grass, 0, 0, 800, 600);

        for(let i=0; i<brPaveta; i++) {
            drawImage(kufte, paveX[i]*25, paveY[i]*25, 50, 50);
        }

        for(d=0; d<brDefens; d++) {
            context.fillStyle = 'red';
            context.globalAlpha = 0.25;
            context.fillRect(defensX[d] - 50, defensY[d] - 50, 150, 150);

            context.globalAlpha = 1;

            context.strokeStyle = 'black';
            context.strokeRect(defensX[d] - 50, defensY[d] - 50, 150, 150);
            drawImage(towerGreen1, defensX[d], defensY[d], 50, 75);


            for(p = 0; p<brPatroni[d]; p++) {
                drawImage(ballOrTree, patronX[p], patronY[p], 25, 25);
            }
        }

        drawImage(towerGreen1, 675, 515, 50, 75);
        context.fillStyle = 'black';
        context.font = '25px Arial';
        context.fillText('x' + (MaxDefenes - brDefens), 750, 550);
        
        for(j=0; j<brVragove; j++) {
            context.fillStyle = 'red'; context.strokeStyle = 'black';

            context.fillRect((playerX[j] + 50) - maxDamage[j]/2, playerY[j] - 25, showDamage[j]*0.75, 15);
            context.strokeRect((playerX[j] + 50) - maxDamage[j]/2, playerY[j] - 25, maxDamage[j]*0.75, 15);
            drawImage(tipKartinka[kartinka[j]], playerX[j], playerY[j], 50, 50);
        }

    }
}

function mouseup() {
    if(brDefens < MaxDefenes && start) {
        defensX[brDefens] = mouseX - 25;
        defensY[brDefens] = mouseY - 37.5;
        brPatroni[brDefens] = 0;
        time[brDefens] = 0;
        brDefens++;
    }

    if(areColliding(mouseX, mouseY, 1, 1,  350, 200, 60, 25) && start == false) {
        start = true;
    }
}