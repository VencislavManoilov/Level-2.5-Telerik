let myX = mouseX - windowSizeX/2, myY = mouseY - windowSizeY/2, camX = 1, camY = 1, camZ = 1, camSpeed = 1, gridSize = 100, grid = [], gridSizeX = windowSizeX/gridSize, gridSizeY = windowSizeY/gridSize, boxZ = 5, ded = false, score = 0;

emptyX = randomInteger(0, gridSizeX - 1);
emptyY = randomInteger(0, gridSizeY - 1);
for(let x = 0; x < gridSizeX; x++) {
    grid[x] = [];
    for(let y = 0; y < gridSizeY; y++) {
        if(x != emptyX || y != emptyY) {
            grid[x][y] = true;
        } else {
            grid[x][y] = false;
        }
    }
}

function orkex(rX, rZ) {
    return rX/rZ + windowSizeX/2;
}

function orkey(rY, rZ) {
    return rY/rZ + windowSizeY/2;
}

function orkeyp(position) {
    return new Vector2(position.x/position.z + windowSizeX/2, position.y/position.z + windowSizeY/2);
}

function orkesizeX(rSizeX, rZ) {
    return rSizeX/rZ;
}

function orkesizeY(rSizeY, rZ) {
    return rSizeY/rZ;
}

function orkesize(rSize, rZ) {
    return rSize/rZ;
}

function update() {
    if(boxZ > 1) {
        boxZ -= 0.01;
    } else if(!ded) {
        m = get3DValues(new Vector3(myX, myY, 1), new Vector2(gridSize/2, gridSize/2));
        for(let x = 0; x < gridSizeX; x++) {
            for(let y = 0; y < gridSizeY; y++) {
                if(!grid[x][y]) {
                    b = get3DValues(new Vector3(-windowSizeX/2 + x * gridSize, -windowSizeY/2 + y * gridSize, boxZ), new Vector2(gridSize, gridSize));
                    if(areColliding(m.position, m.size,  b.position, b.size)) {
                        emptyX = randomInteger(0, gridSizeX - 1);
                        emptyY = randomInteger(0, gridSizeY - 1);
                        for(let x = 0; x < gridSizeX; x++) {
                            for(let y = 0; y < gridSizeY; y++) {
                                if(x != emptyX || y != emptyY) {
                                    grid[x][y] = true;
                                } else {
                                    grid[x][y] = false;
                                }
                            }
                        }
                        boxZ = 5;
                        score++;
                    } else {
                        ded = true;
                    }
                }
            }
        }
    }

    myX = mouseX - windowSizeX/2;
    myY = mouseY - windowSizeY/2;

    MoveCam();
}

function draw() {
    if(!ded) {
        for(let i = 0; i < 10; i++) {
            a = get3DValues(new Vector3(0, 0, i), new Vector2(windowSizeX * 2 - 750, windowSizeY * 2 - 250));
            strokeRect(a.position, a.size, 2, "black");
        }

        for(let x = 0; x < gridSizeX; x++) {
            for(let y = 0; y < gridSizeY; y++) {
                if(grid[x][y]) {
                    draw3D(box, new Vector3(-windowSizeX/2 + x * gridSize, -windowSizeY/2 + y * gridSize, boxZ), new Vector2(gridSize, gridSize), 0);
                }
            }
        }

        // draw3D(ballOrTree, new Vector3(myX, myY, 1), new Vector2(gridSize/2, gridSize/2), 0);
        draw3DCube(new Vector3(myX - gridSize/4, myY - gridSize/4, 1), gridSize/2);

        fillText("Score: " + score, new Vector2(5, 5), 25, "Arial", "black");
    } else {
        fillText("You DED! hahaha", new Vector2(windowSizeX/2 - 75, windowSizeY/2 - 12.5), 25, "Arial", "Red");
        fillText("Your score is: " + score, new Vector2(windowSizeX/2 - 75, windowSizeY/2 + 12.5), 25, "Arial", "Red");
    }

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

function MoveCam() {
    if(Input.GetKey(KeyCode.A)) {
        camX += camSpeed;
    }
    if(Input.GetKey(KeyCode.D)) {
        camX -= camSpeed;
    }
    if(Input.GetKey(KeyCode.W)) {
        camY += camSpeed;
    }
    if(Input.GetKey(KeyCode.S)) {
        camY -= camSpeed;
    }
    if(Input.GetKey(KeyCode.Q)) {
        camZ += camSpeed;
    }
    if(Input.GetKey(KeyCode.E)) {
        camZ -= camSpeed;
    }
}

function draw3DCube(position, size) {
    sizeZ = 0.05;

    point1 = orkeyp(position);
    point2 = orkeyp(new Vector3(position.x + size, position.y, position.z));
    point3 = orkeyp(new Vector3(position.x, position.y + size, position.z));
    point4 = orkeyp(new Vector3(position.x + size, position.y + size, position.z));
    point5 = orkeyp(new Vector3(position.x, position.y, position.z + sizeZ));
    point6 = orkeyp(new Vector3(position.x + size, position.y, position.z + sizeZ));
    point7 = orkeyp(new Vector3(position.x, position.y + size, position.z + sizeZ));
    point8 = orkeyp(new Vector3(position.x + size, position.y + size, position.z + sizeZ));

    if(point5.x >= windowSizeX/2) {
        // Right
        draw3DFace(point1, point3, point7, point5, "red");
    }
    if(point6.x <= windowSizeX/2) {
        // Left
        draw3DFace(point6, point2, point4, point8, "orange");
    }
    if(point5.y >= windowSizeY/2) {
        // Up
        draw3DFace(point1, point2, point6, point5, "gray");
    }
    if(point7.y <= windowSizeY/2) {
        // Down
        draw3DFace(point7, point8, point4, point3, "yellow");
    }

    // draw3DFace(point5, point6, point8, point7, "red");
    draw3DFace(point1, point3, point4, point2, "blue");
}

function draw3DFace(point1, point2, point3, point4, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.lineTo(point3.x, point3.y);
    context.lineTo(point4.x, point4.y);
    context.fill();
}