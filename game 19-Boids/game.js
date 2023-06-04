let boids = [];

class Boid {
    constructor(position, size, isLider, angle) {
        this.position = position;
        this.size = size;
        this.isLider = isLider;
        this.angle = angle;
        this.color = "CornflowerBlue";
    }

    update() {
        this.position.x += MoveForwardX(this.angle, 3);
        this.position.y += MoveForwardY(this.angle, 3);

        if(this.position.x < distanceFromWall) {
            this.angle += (needAngle - this.angle) / 1;
        }
        if(this.position.x > windowSizeX - this.size - distanceFromWall) {
            this.angle += (needAngle - this.angle) / 1;
        }
        if(this.position.y < distanceFromWall) {
            this.angle += (needAngle - this.angle) / 1;
        }
        if(this.position.y > windowSizeY - this.size - distanceFromWall) {
            this.angle += (needAngle - this.angle) / 1;
        }
    }

    draw() {
        drawTriangle(this.position, this.size, this.angle, this.color);
    }
}

for(let i = 0; i < 25; i++) {
    let size = 25
    boids[i] = new Boid(new Vector2(randomInteger(0, windowSizeX - size), randomInteger(0, windowSizeY - size)), size, false, randomInteger(0, 360));
}

function update() {
    for(let i = 0; i < boids.length; i++) {
        boids[i].update();
    }
}

function draw() {
    for(let i = 0; i < boids.length; i++) {
        boids[i].draw();
    }

    UpdateParticles();
}

function drawTriangle(position, size, angle, color) {
    let deg = angle * Math.PI / 180;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(position.x + Math.cos(deg) * size, position.y + Math.sin(deg) * size);
    context.lineTo(position.x + Math.cos(deg + 145 * Math.PI/180) * size, position.y + Math.sin(deg + 145 * Math.PI/180) * size);
    context.lineTo(position.x + Math.cos(deg - 145 * Math.PI/180) * size, position.y + Math.sin(deg - 145 * Math.PI/180) * size);
    context.lineTo(position.x + Math.cos(deg) * size, position.y + Math.sin(deg) * size);
    context.fill();
}

function getAngleFrom2Points(position1, position2) {
    return Math.atan2(position2.y - position1.y, position2.x - position1.x) * 180 / Math.PI;
}