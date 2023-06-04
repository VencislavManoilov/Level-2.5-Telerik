// За кюфтетата
let brPatroni = 0, patronX = [], patronY = [], patronZ = [], patronShirochina = [], ekranPatronX = [], ekranPatronY = [], ekranPatronShirochina = [], maxPatroni = 50, showing = 0, howMuchMoney = 25;

// За враговете
let brVragove = 0, vragX = [], vragY = [], vragZ = [], vragShirochina = [], ekranVragX = [], ekranVragY = [], ekranVragShirochina = [], timeForVrag = 150, speedSpawn = randomInteger(250), tipKartinka = [], kartinka = [], udarenLiE = [], risuvaLiSe = [];

// others
let score = 0, death = false;

tipKartinka[0] = Cacodemon;
tipKartinka[1] = monster;
tipKartinka[2] = demon;

function update() {
    for(i=0; i<brPatroni; i++) {
        patronZ[i] += 0.1;

        if(patronZ[i] > 10) {
            risuvaLiSe[i] = false;
        }
    }

    timeForVrag++;
    if(timeForVrag > speedSpawn) {
        vragX[brVragove] = randomInteger(25) - randomInteger(25);
        vragY[brVragove] = randomInteger(10) - randomInteger(10);
        vragZ[brVragove] = 2;
        vragShirochina[brVragove] = 100;
        kartinka[brVragove] = randomInteger(3);
        udarenLiE[brVragove] = false;
        brVragove++;
        speedSpawn = randomInteger(250);

        timeForVrag = 0;
    }

    for(j=0; j<brVragove; j++) {
        if(vragZ[j] > 0) {
            vragZ[j] -= 0.005;
        }

        if(vragZ[j] <= 0) {
            vragZ[j] = -10000;
        }

        for(i=0; i<brPatroni; i++) {
            if(areColliding(vragX[j], vragY[j], vragShirochina[j]/vragZ[j], vragShirochina[j]/vragZ[j],  patronX[i], patronY[i], patronShirochina[i]/patronZ[i], patronShirochina[i]/patronZ[i]) &&
            vragZ[j] >= patronZ[i] - 0.5 && vragZ[j] <= patronZ[i] + 0.5 && !udarenLiE[j] && !risuvaLiSe[i]) {
                udarenLiE[j] = true;
                score += randomInteger(5) + 1;
            }
        }
    }

    if(brPatroni >= maxPatroni) {
        if(showing <= 100) {
            showing++;
        }
    } else {
        showing = 0;
    }
}

function draw() {
    if(!death) {
        drawImage(back3D, 0, 0 , 800, 600);

        for(j=0; j<brVragove; j++) {
            ekranVragX[j] = orkex(vragX[j] - vragShirochina[j]/2, vragZ[j]);
            ekranVragY[j] = orkey(vragY[j] - vragShirochina[j]/2, vragZ[j]);
            ekranVragShirochina[j] = vragShirochina[j]/vragZ[j];

            if(!udarenLiE[j]) {
                drawImage(tipKartinka[kartinka[j]], ekranVragX[j], ekranVragY[j], ekranVragShirochina[j], ekranVragShirochina[j]);
            }
        }

        for(i=0; i<brPatroni; i++) {
            if(risuvaLiSe[i]) {
                ekranPatronX[i] = orkex(patronX[i] - patronShirochina[i]/2, patronZ[i]);
                ekranPatronY[i] = orkey(patronY[i] - patronShirochina[i]/2, patronZ[i]);
                ekranPatronShirochina[i] = patronShirochina[i]/patronZ[i];

                drawImage(kufte, ekranPatronX[i], ekranPatronY[i], ekranPatronShirochina[i], ekranPatronShirochina[i]);
            }
            
        }

        context.fillStyle = 'silver';
        context.font = '25px Arial';

        if(brPatroni >= maxPatroni) {
            if(score >= howMuchMoney) {
                context.globalAlpha = showing/100;
                drawImage(tendvera, 600, 25, 60, 45);

                context.fillText("= " + howMuchMoney + " coins", 660, 35);

                context.fillStyle = 'orange';
                context.fillText("Buy", 650, 75);

                context.globalAlpha = 1;
            } else {
                death = true;
            }
        }

        context.fillStyle = 'silver';
        drawImage(coin, 325, 10, 50, 50);
        context.fillText("x" + score, 380, 25);

        drawImage(crosshairBlue, mouseX - 25, mouseY - 25, 50, 50);
    } else {
        context.fillStyle = 'black';
        context.font = "25px Arial";
        context.fillText("You ded", 375, 275);

        context.fillText("Your kufteta are gone", 300, 25);

        context.font = '15px Arial';
        context.fillText('"Press R to restart"', 365, 310);
    }

    for(v=0; v<maxPatroni - brPatroni; v++) {
        context.fillStyle = 'cyan';
        context.fillRect(765, 590 - v*10, 25, 7.5);
    }
}

function mousedown() {
    if(brPatroni < maxPatroni) {
        patronX[brPatroni] = mouseX - 400;
        patronY[brPatroni] = mouseY - 300;
        patronZ[brPatroni] = 1;
        patronShirochina[brPatroni] = 50;
        risuvaLiSe[brPatroni] = true;
        brPatroni++;
    }

    if(areColliding(650, 75, 42.5, 25,  mouseX, mouseY, 1, 1) && brPatroni >= maxPatroni) {
        brPatroni = 0;
        score -= howMuchMoney;
    }
}

function keydown(key) {
    if(key == 82 && death) {
        location.reload();
    }
}

function orkex(rX, rZ) {
    return rX/rZ + 400;
}

function orkey(rY, rZ) {
    return rY/rZ + 300;
}