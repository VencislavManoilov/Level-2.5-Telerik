let grid = [], size = 21, hexR = 25, moveDirection = 0, moveDeg = 0, opashka = [], brOpashki = 1, ded = false, time = 0, score = 0, camX = 0, camY = 0;

let player = {
    position: new Vector2(size/2 - 0.5, size/2 - 0.5)
}
opashka[0] = new Vector2(player.position.x, player.position.y);

for(let x = 0; x < size; x++) {
    grid[x] = [];
    for(let y = 0; y < size; y++) {
        grid[x][y] = 1;

        halfSize = Math.floor(size/2);
        if(x > halfSize && y - x + size < halfSize + 1) {
            grid[x][y] = 0;
        }

        if(x < halfSize && y > size - y && y - x > size - y + x) {
            grid[x][y] = 0;
        }
    }
}

// let appleX = randomInteger(0, size-1), appleY = randomInteger(0, size-1);
brAllApples = 100;
let appleX = [], appleY = [];

for(let j = 0; j < brAllApples; j++) {
    MakeApple(j);
}

changeBg("black");

function update() {
    time++;

    if(!Input.GetKey(KeyCode.Shift) && time%75 == 0) {
        move();
    } if(Input.GetKey(KeyCode.Shift) && time%25 == 0) {
        move();
    }

    // camX = player.position.x * height*2 - windowSizeX/2;
    // camY = player.position.y * height*2 - windowSizeY/2;

    camX = player.position.x * hexR * 1.5 - windowSizeX/2 + height;
    camY = size * hexR/2 + player.position.y * height * 2 - player.position.x * height - windowSizeY/2 + height;
}

function move() {
    for(let i = opashka.length; i > 0; i--) {
        opashka[i] = new Vector2(opashka[i - 1].x, opashka[i - 1].y);
    }

    opashka[0] = new Vector2(player.position.x, player.position.y);

    if(moveDirection == 0) {
        player.position.y--;
    } if(moveDirection == 1) {
        player.position.x++;
    } if(moveDirection == 2) {
        player.position.x++;
        player.position.y++;
    } if(moveDirection == 3) {
        player.position.y++;
    } if(moveDirection == 4) {
        player.position.x--;
    } if(moveDirection == 5) {
        player.position.x--;
        player.position.y--;
    }

    if(player.position.x < 0 || player.position.x >= size || player.position.y < 0 || player.position.y >= size || grid[player.position.x][player.position.y] == 0) {
        ded = true;
    }

    for(let i = 0; i < appleX.length; i++) {
        if(player.position.x == appleX[i] && player.position.y == appleY[i]) {
            brOpashki++;
            grid[appleX[i]][appleY[i]] = 1;
            MakeApple(i);
            score++;
        }
    }
}

function draw() {
    fillText("Score: " + score, new Vector2(windowSizeX/2 - 50, 10), 25, "Arial", "white");

    if(!ded) {
        s = hexR/2;
        height = Math.sqrt(hexR*hexR - s*s);

        context.save();
        context.translate(player.position.x * hexR * 1.5 - camX, size * hexR/2 + player.position.y * height * 2 - player.position.x * height - camY);
        context.rotate(-moveDirection * Math.PI*2/6);
        context.translate(-(player.position.x * hexR * 1.5 - camX), -(size * hexR/2 + player.position.y * height * 2 - player.position.x * height - camY));

        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                if(grid[x][y]) {
                    context.strokeStyle = "white";
                    drawHex(new Vector2(x * hexR * 1.5 - camX, size * hexR/2 + y * height * 2 - x * height - camY), hexR);
                } if(grid[x][y] == 2) {
                    context.fillStyle = "red";
                    context.strokeStyle = "none";
                    drawHex(new Vector2(x * hexR * 1.5 - camX, size * hexR/2 + y * height * 2 - x * height - camY), hexR);
                    context.fill();
                }
            }
        }

        context.fillStyle = "lime";
        drawHex(new Vector2(player.position.x * hexR * 1.5 - camX, size * hexR/2 + player.position.y * height * 2 - player.position.x * height - camY), hexR)
        context.fill();

        context.fillStyle = "lime";
        for(let i = 0; i < opashka.length; i++) {
            drawHex(new Vector2(opashka[i].x * hexR * 1.5 - camX, size * hexR/2 + opashka[i].y * height * 2 - opashka[i].x * height - camY), hexR);
            context.fill();
        }

        drawLine(new Vector2(player.position.x * hexR * 1.5 + hexR - camX, size * hexR/2 + player.position.y * height * 2 - player.position.x * height + hexR - camY), new Vector2(player.position.x * hexR * 1.5 + hexR - MoveForwardX(moveDirection*60 + 90, hexR - 2) - camX, size * hexR/2 + player.position.y * height * 2 - player.position.x * height + hexR - MoveForwardY(moveDirection*60 + 90, hexR - 2) - camY), 7.5, "white");
    } else {
        fillText("You DED!!! Haha", new Vector2(windowSizeX/2 - 100, windowSizeY/2 - 12.5), 25, "Arial", "White");
    }
    context.restore();

    UpdateParticles();
}

function drawHex(position, r) {
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(position.x + r + MoveForwardX(60, r), position.y + r + MoveForwardY(60, r));
    for(let i = 0; i <= 6; i++) {
        context.lineTo(position.x + r + MoveForwardX(60 * i, r), position.y + r + MoveForwardY(60 * i, r));
    }
    // context.fill();
    context.stroke();
}

function keyup(key) {
    if(key == KeyCode.A) {
        moveDirection--;
    } if(key == KeyCode.D) {
        moveDirection++;
    }

    if(moveDirection > 5) {
        moveDirection = 0;
    }
    if(moveDirection < 0) {
        moveDirection = 5;
    }
}

function MakeApple(index) {
    if(index == undefined) {
        index = 0;
    }

    appleX[index] =randomInteger(0, size-1), appleY[index] =randomInteger(0, size-1);
    while(grid[appleX[index]][appleY[index]] == 0) {
        appleX[index] = randomInteger(0, size-1), appleY[index] = randomInteger(0, size-1);
    }
    grid[appleX[index]][appleY[index]] = 2;
}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}