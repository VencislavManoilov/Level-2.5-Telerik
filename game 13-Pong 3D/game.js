let camX = 1, camY = 1, cheatCode = false;

let ball = {
    position: new Vector3(randomInteger(-300, 300), 0, 2.51),
    size: new Vector2(50, 50),
    deg: 0,
    delta: new Vector3(randomInteger(-10, 10), randomInteger(-5, 5), 0.025)
}

let platform = {
    position: new Vector3(0, 0, 1),
    size: new Vector2(250, 150),
}

function orkex(rX, rZ) {
    return rX/rZ * camX + windowSizeX/2;
}

function orkey(rY, rZ) {
    return rY/rZ * camY + windowSizeY/2;
}

function orkesizeX(rSizeX, rZ) {
    return rSizeX/rZ;
}

function orkesizeY(rSizeY, rZ) {
    return rSizeY/rZ;
}

function update() {
    if(Input.GetKey(KeyCode.A)) {
        camX -= 0.01;
    } if(Input.GetKey(KeyCode.D)) {
        camX += 0.01;
    } if(Input.GetKey(KeyCode.W)) {
        camY -= 0.01;
    } if(Input.GetKey(KeyCode.S)) {
        camY += 0.01;
    }

    if(!cheatCode) {
        platform.position.x = mouseX - windowSizeX/2;
        platform.position.y = mouseY - windowSizeY/2;
    } else {
        platform.position.x = ball.position.x;
        platform.position.y = ball.position.y;
    }

    ball.position.x += ball.delta.x;
    ball.position.y += ball.delta.y;
    ball.position.z += ball.delta.z;

    if(ball.position.x < -windowSizeX + 750 - ball.size.x) {
        ball.delta.x = -ball.delta.x;
    }
    if(ball.position.y < -windowSizeY + 250 - ball.size.y) {
        ball.delta.y = -ball.delta.y;
    }
    if(ball.position.x + ball.size.x > windowSizeX - 750 + ball.size.x) {
        ball.delta.x = -ball.delta.x;
    }
    if(ball.position.y + ball.size.y > windowSizeY - 250) {
        ball.delta.y = -ball.delta.y;
    } else {
        ball.delta.y += 0.25;
    }
    if(ball.position.z > 7) {
        ball.delta.z = -ball.delta.z;
    }

    b = get3DValues(ball.position, ball.size);
    p = get3DValues(platform.position, platform.size);
    if(ball.position.z < 1 && areColliding(b.position, b.size,  p.position, p.size)) {
        ball.delta.z = -ball.delta.z;
    }
}

function draw() {
    b = get3DValues(new Vector3(0, 0, 9), new Vector2(windowSizeX * 2 - 750, windowSizeY * 2 - 250));
    fillRect(b.position, b.size, "red");

    for(let i = 0; i < 10; i++) {
        a = get3DValues(new Vector3(0, 0, i), new Vector2(windowSizeX * 2 - 750, windowSizeY * 2 - 250));
        strokeRect(a.position, a.size, 2, "black");
    }

    draw3D(ballOrTree, ball.position, ball.size, ball.deg);
    // b = get3DValues(new Vector3(ball.position.x, windowSizeY - 200 - ball.size.y, ball.position.z), ball.size);
    // fillRect(b.position, b.size, 'black');

    transparent(25);
    c = get3DValues(platform.position, platform.size);
    fillRect(c.position, c.size, "blue");
    transparent(100);

    UpdateParticles();
}

function draw3D(image, position, size, angle) {
    eX = orkex(position.x - size.x/2, position.z);
    eY = orkey(position.y - size.y/2, position.z);
    eSize = new Vector2(orkesizeX(size.x, position.z), orkesizeY(size.y, position.z));
    drawImage(image, new Vector2(eX, eY), eSize, angle);
}

function get3DValues(position, size) {
    eX = orkex(position.x - size.x/2, position.z);
    eY = orkey(position.y - size.y/2, position.z);
    eSize = new Vector2(orkesizeX(size.x, position.z), orkesizeY(size.y, position.z));
    return {
        position: new Vector2(eX, eY),
        size: eSize
    }
}

function keydown(key) {
    if(key == KeyCode.Enter) {
        cheatCode = !cheatCode;
    }
}