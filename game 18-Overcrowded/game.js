let guys = [], r = 25, arrows = [], boxes = [], money = 0, attractions = [];

let arrowsImage = [arrowDown, arrowDownLeft, arrowDownRight, arrowLeft, arrowUp, arrowUpLeft, arrowUpRight];

class Guy {
    constructor(position, dx, dy, happinessLevel) {
        this.position = position;
        this.dx = dx;
        this.dy = dy;
        this.happinessLevel = happinessLevel;
        this.busy = false;
        this.timer = 0;
        this.color = "BurlyWood";
    }

    update() {
        if(!this.busy) {
            this.timer = 0;

            this.position.x += this.dx;
            this.position.y += this.dy;

            for(let i = 0; i < arrows.length; i++) {
                if(areColliding(this.position, new Vector2(r*2, r*2),  arrows[i].position, new Vector2(arrows[i].size, arrows[i].size))) {
                    if(arrows[i].index == 0) {
                        this.dx += (0 - this.dx) / 50 / arrows[i].value;
                        this.dy += (2 - this.dx) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 1) {
                        this.dx += (-2 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (2 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 2) {
                        this.dx += (2 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (2 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 3) {
                        this.dx += (-2 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (0 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 4) {
                        this.dx += (0 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (-2 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 5) {
                        this.dx += (-2 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (-2 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                    if(arrows[i].index == 6) {
                        this.dx += (2 * arrows[i].value - this.dx) / 50 / arrows[i].value;
                        this.dy += (-2 * arrows[i].value - this.dy) / 50 / arrows[i].value;
                    }
                }
            }

            if(this.position.x - r < 0) {
                this.position.x = r;
            } if(this.position.x + r > windowSizeX) {
                this.position.x = windowSizeX - r;
            } if(this.position.y - r < 0) {
                this.position.y = r;
            } if(this.position.y + r > windowSizeY) {
                this.position.y = windowSizeY - r;
            }

            for(let i = 0; i < boxes.length; i++) {
                while(areCollidingCirclSquare(this.position, boxes[i].position, boxes[i].size)) {
                    let angle = angleFrom2Points(this.position, new Vector2(boxes[i].position.x + boxes[i].size.x/2, boxes[i].position.y + boxes[i].size.y/2));
                    this.position.x -= MoveForwardX(angle, 1);
                    this.position.y -= MoveForwardY(angle, 1);
                }
            }

            for(let i = 0; i < attractions.length; i++) {
                if(areCollidingCirclSquare(this.position, attractions[i].position, new Vector2(75, 75))) {
                    this.busy = true;
                    this.indexOfAttraction = i;
                    money += attractions[i].value;
                }
            }
        } else {
            this.timer++;

            if(this.timer%attractions[this.indexOfAttraction].timeInIt == 0) {
                let centerOfStore = new Vector2(attractions[this.indexOfAttraction].position.x + 37.5, attractions[this.indexOfAttraction].position.y + 37.5);

                let angle = angleFrom2Points(this.position, centerOfStore)
                while(areCollidingCirclSquare(this.position, attractions[this.indexOfAttraction].position, new Vector2(75, 75))) {
                    this.position.x += MoveForwardX(angle, 1);
                    this.position.y += MoveForwardY(angle, 1);
                }

                this.busy = false;
            }
        }
    }

    draw() {
        if(!this.busy) {
            context.strokeStyle = "black";
            fillArc(this.position, r, this.color);
            context.stroke();
        }
    }
}

class Arrow {
    constructor(position, index, size, value) {
        this.position = position;
        this.index = index;
        this.size = size;
        this.value = value;
    }

    draw() {
        drawImage(arrowsImage[this.index], this.position, new Vector2(this.size, this.size), 0);
    }
}

class Box {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    draw() {
        drawImage(box, this.position, this.size, 0);
    }
}

class Attraction {
    constructor(position, value, timeInIt) {
        this.position = position;
        this.value = value;
        this.timeInIt = timeInIt;
        this.size = new Vector2(75, 75);
    }

    draw() {
        drawImage(paddle, this.position, this.size, 0);
    }
}

for(let i = 0; i < 10; i++) {
    guys[i] = new Guy(new Vector2(windowSizeX/2 - r + randomOddInteger(-r * 1.5, r * 1.5), windowSizeY - 100 + randomOddInteger(-r * 1.5, r * 1.5)), randomOddInteger(0, 0), randomOddInteger(-2.5, -2.5), randomOddInteger(0, 1));
}

for(let j = 0; j < 25; j++) {
    let size = randomInteger(50, 125);
    arrows[j] = new Arrow(new Vector2(randomInteger(0, windowSizeX - size), randomInteger(0, windowSizeY - size)), randomInteger(0, arrowsImage.length - 1), size, randomInteger(1, 2));
}

for(let b = 0; b < 7; b++) {
    let sizeX = randomInteger(50, 100);
    let sizeY = randomInteger(50, 100);
    boxes[b] = new Box(new Vector2(randomInteger(0, windowSizeX - sizeX), randomInteger(0, windowSizeY - sizeY)), new Vector2(sizeX, sizeY));
}

for(let l = 0; l < 10; l++) {
    attractions[l] = new Attraction(new Vector2(randomInteger(0, windowSizeX - 75), randomInteger(0, windowSizeY - 75)), 1, 1000);
}

function update() {
    for(let i = 0; i < guys.length; i++) {
        guys[i].update();

        for(let j = 0; j < guys.length; j++) {
            if(i != j) {
                let angle = angleFrom2Points(guys[i].position, guys[j].position);
                let angle2 = angleFrom2Points(guys[j].position, guys[i].position);

                while(distance(guys[i].position, guys[j].position) < r * 2) {
                    guys[i].position.x -=  Math.cos(angle);
                    guys[i].position.y -=  Math.sin(angle);

                    guys[j].position.x -=  Math.cos(angle2);
                    guys[j].position.y -=  Math.sin(angle2);
                }
            }
        }
    }
}

function draw() {
    for(let j = 0; j < arrows.length; j++) {
        arrows[j].draw();
    }

    for(let i = 0; i < guys.length; i++) {
        guys[i].draw();
    }

    for(let b = 0; b < boxes.length; b++) {
        boxes[b].draw();
    }

    for(let l = 0; l < attractions.length; l++) {
        attractions[l].draw();
    }

    fillText("Money: " + money, new Vector2(5, 5), 25, "Arial", "black");

    UpdateParticles();
}

function dist(x1,y1,x2,y2) {
    let a=x1-x2,b=y1-y2;
    return Math.sqrt(a*a + b*b);
}

function areC(Ax, Ay, Awidth, Aheight, Bx, By, Bwidth, Bheight) {
    if (Bx <= Ax + Awidth) {
        if (Ax <= Bx + Bwidth) {
            if (By <= Ay + Aheight) {
                if (Ay <= By + Bheight) {
                    return 1;
                }
            }
        }
    }
    return 0;
}

function areCollidingCirclSquare(circlePosition, position, size) {
    let cX = circlePosition.x, cY = circlePosition.y, x = position.x, y = position.y, sizeX = size.x, sizeY = size.y;
    return dist(cX, cY, x, y) < r || dist(cX, cY, x + sizeX, y) < r || dist(cX, cY, x, y + sizeY) < r || dist(cX, cY, x + sizeX, y + sizeY) < r
        || areC(cX, cY, 1, 1, x, y - r, sizeX, sizeY + r * 2) || areC(cX, cY, 1, 1, x - r, y, sizeX + r * 2, sizeY);
}

function angleFrom2Points(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function mousedown() {
    guys.push(new Guy(new Vector2(mouseX, mouseY), 0, 0, randomOddInteger(0, 1)));
}