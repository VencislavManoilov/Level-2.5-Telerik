let size = 100, myX = -size/2, myY = -size/2, myZ = 1, speed = 3, object = 0;

changeBg("black");

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
    if(Input.GetKey(KeyCode.Q)) {
        size -= speed;
    }
    if(Input.GetKey(KeyCode.E)) {
        size += speed;
    }


    myX = mouseX - windowSizeX/2 - size/2;
    myY = mouseY - windowSizeY/2 - size/2;
}

function draw() {
    if(!object) {
        draw3DCube(new Vector3(myX, myY, myZ), size);
    } else {
        draw3DTriangle(new Vector3(myX, myY, myZ), size);
    }

    UpdateParticles();
}

function draw3DCube(position, size) {
    point1 = orkeyp(position);
    point2 = orkeyp(new Vector3(position.x + size, position.y, position.z));
    point3 = orkeyp(new Vector3(position.x, position.y + size, position.z));
    point4 = orkeyp(new Vector3(position.x + size, position.y + size, position.z));
    point5 = orkeyp(new Vector3(position.x, position.y, position.z + 0.075));
    point6 = orkeyp(new Vector3(position.x + size, position.y, position.z + 0.075));
    point7 = orkeyp(new Vector3(position.x, position.y + size, position.z + 0.075));
    point8 = orkeyp(new Vector3(position.x + size, position.y + size, position.z + 0.075));

    if(point5.x >= windowSizeX/2) {
        draw3DFace4(point1, point3, point7, point5, "green");
    }
    if(point6.x <= windowSizeX/2) {
        draw3DFace4(point6, point2, point4, point8, "hotpink");
    }
    if(point5.y >= windowSizeY/2) {
        draw3DFace4(point1, point2, point6, point5, "white");
    }
    if(point7.y <= windowSizeY/2) {
        draw3DFace4(point7, point8, point4, point3, "yellow");
    }

    // draw3DFace4(point5, point6, point8, point7, "red");
    draw3DFace4(point1, point3, point4, point2, "blue");
}

function draw3DFace4(point1, point2, point3, point4, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.lineTo(point3.x, point3.y);
    context.lineTo(point4.x, point4.y);
    context.fill();
}

function draw3DTriangle(position, size) {
    sizeZ = 0.075;
    point1 = orkeyp(new Vector3(position.x + size/2, position.y, position.z + sizeZ/2));
    point2 = orkeyp(new Vector3(position.x, position.y + size, position.z));
    point3 = orkeyp(new Vector3(position.x + size, position.y + size, position.z));
    point4 = orkeyp(new Vector3(position.x, position.y + size, position.z + sizeZ));
    point5 = orkeyp(new Vector3(position.x + size, position.y + size, position.z + sizeZ));

    if(point1.x + size/2 > windowSizeX/2) {
        draw3DFace3(point1, point2, point4, "green");
    }
    if(point1.x - size/2 < windowSizeX/2) {
        draw3DFace3(point1, point3, point5, "hotpink");
    }
    if(point3.y < windowSizeY/2) {
        draw3DFace4(point2, point3, point5, point4, "yellow");
    }

    draw3DFace3(point1, point2, point3, "blue");
}

function draw3DFace3(point1, point2, point3, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.lineTo(point3.x, point3.y);
    context.fill();
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

function keyup(key) {
    if(key == KeyCode.Space) {
        object++;

        if(object >= 2) {
            object = 0;
        }
    }
}