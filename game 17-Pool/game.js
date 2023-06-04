let ball = [], ballR = 10, holeR = ballR + 5, tableSize = new Vector2(500, 250), tablePosition = new Vector2(windowSizeX/2 - tableSize.x/2, windowSizeY/2 - tableSize.y/2), deg, deg2, canShoot = true, score = 0;

class Ball {
    constructor(posision, color, index) {
        this.posision = posision;
        this.color = color;
        this.dx = 0;
        this.dy = 0;
        this.index = index;
        this.mass = 1;
        this.slowDown = 1.01;
        this.deleted = false;
    }

    update() {
        this.dx /= this.slowDown;
        this.dy /= this.slowDown;

        this.posision.x +=  this.dx;
        this.posision.y +=  this.dy;

        // for(let i = 0; i < ball.length; i++) {
        //     if(this.index != i) {
        //         if(distance(this.posision, ball[i].posision) < ballR * 2) {
        //             let angle = angleFrom2Points(this.posision, ball[i].posision);
        //             let angle2 = angleFrom2Points(ball[i].posision, this.posision);

        //             while(distance(this.posision, ball[i].posision) < ballR * 2) {
        //                 this.posision.x -=  Math.cos(angle);
        //                 this.posision.y -=  Math.sin(angle);

        //                 ball[i].posision.x -=  Math.cos(angle2);
        //                 ball[i].posision.y -=  Math.sin(angle2);
        //             }

        //             let o1 = Math.atan2(this.dy, this.dx);
        //             let o2 = Math.atan2(ball[i].dy, ball[i].dx);
        //             let y = Math.atan2(ball[i].posision.y - this.posision.y, ball[i].posision.x - this.posision.x);
        //             let v1 = distance(new Vector2(0, 0), new Vector2(this.dx, this.dy));
        //             let v2 = distance(new Vector2(0, 0), new Vector2(ball[i].dx, ball[i].dy));

        //             this.dx = ((v1 * Math.cos(o1 - y) * (this.mass - ball[i].mass) + 2 * ball[i].mass * v2 * Math.cos(o2 - y)) * Math.cos(y)) / (this.mass + ball[i].mass) + v1 * Math.sin(o1 - y) * Math.cos(y + Math.PI/2);
        //             this.dy = ((v1 * Math.cos(o1 - y) * (this.mass - ball[i].mass) + 2 * ball[i].mass * v2 * Math.cos(o2 - y)) * Math.sin(y)) / (this.mass + ball[i].mass) + v1 * Math.sin(o1 - y) * Math.sin(y + Math.PI/2);

        //             ball[i].dx = ((v2 * Math.cos(o2 - y) * (ball[i].mass - this.mass) + 2 * this.mass * v1 * Math.cos(o1 - y)) * Math.cos(y)) / (ball[i].mass + this.mass) + v2 * Math.sin(o2 - y) * Math.cos(y + Math.PI/2);
        //             ball[i].dy = ((v2 * Math.cos(o2 - y) * (ball[i].mass - this.mass) + 2 * this.mass * v1 * Math.cos(o1 - y)) * Math.sin(y)) / (ball[i].mass + this.mass) + v2 * Math.sin(o2 - y) * Math.sin(y + Math.PI/2);
        //         }
        //     }
        // }

        if(this.posision.y - ballR < 0) {
            this.dy = -this.dy;
            this.posision.y = ballR;
        }

        if(this.posision.y + ballR > tableSize.y) {
            this.dy = -this.dy;
            this.posision.y = tableSize.y - ballR;
        }

        if(this.posision.x - ballR < 0) {
            this.dx = -this.dx;
            this.posision.x = ballR;
        }

        if(this.posision.x + ballR > tableSize.x) {
            this.dx = -this.dx;
            this.posision.x = tableSize.x - ballR;
        }
    }

    draw() {
        fillArc(new Vector2(this.posision.x + tablePosition.x, this.posision.y + tablePosition.y), ballR, this.color);
    }
}

ball[0] = new Ball(new Vector2(tableSize.x/4, tableSize.y/2 - ballR), "white", 0);
for(let i = 1; i < 9; i++) {
    ball[i] = new Ball(new Vector2(randomInteger(ballR, tableSize.x - ballR), randomInteger(ballR, tableSize.y - ballR)), "red", i);
}

for(let i = 1; i <ball.length; i++) {
    for(let j = 1; j <ball.length; j++) {
        if(i != j) {
            while(distance(ball[i].posision, ball[j].posision) < ballR * 2) {
                ball[i].posision = new Vector2(randomInteger(ballR, tableSize.x - ballR), randomInteger(ballR, tableSize.y - ballR));
                ball[j].posision = new Vector2(randomInteger(ballR, tableSize.x - ballR), randomInteger(ballR, tableSize.y - ballR));
            }
        }
    }
}

changeBg("black");

function update() {
    let areStopped = 0;
    for(let i = 0; i < ball.length; i++) {
        ball[i].update();

        for(let j = 0; j < ball.length; j++) {
            if(ball[i].index != j) {
                if(distance(ball[i].posision, ball[j].posision) < ballR * 2) {
                    let angle = angleFrom2Points(ball[i].posision, ball[j].posision);
                    let angle2 = angleFrom2Points(ball[j].posision, ball[i].posision);

                    while(distance(ball[i].posision, ball[j].posision) < ballR * 2) {
                        ball[i].posision.x -=  Math.cos(angle);
                        ball[i].posision.y -=  Math.sin(angle);

                        ball[j].posision.x -=  Math.cos(angle2);
                        ball[j].posision.y -=  Math.sin(angle2);
                    }

                    let o1 = Math.atan2(ball[i].dy, ball[i].dx);
                    let o2 = Math.atan2(ball[j].dy, ball[j].dx);
                    let y = Math.atan2(ball[j].posision.y - ball[i].posision.y, ball[j].posision.x - ball[i].posision.x);
                    let v1 = distance(new Vector2(0, 0), new Vector2(ball[i].dx, ball[i].dy));
                    let v2 = distance(new Vector2(0, 0), new Vector2(ball[j].dx, ball[j].dy));

                    ball[i].dx = ((v1 * Math.cos(o1 - y) * (ball[i].mass - ball[j].mass) + 2 * ball[j].mass * v2 * Math.cos(o2 - y)) * Math.cos(y)) / (ball[i].mass + ball[j].mass) + v1 * Math.sin(o1 - y) * Math.cos(y + Math.PI/2);
                    ball[i].dy = ((v1 * Math.cos(o1 - y) * (ball[i].mass - ball[j].mass) + 2 * ball[j].mass * v2 * Math.cos(o2 - y)) * Math.sin(y)) / (ball[i].mass + ball[j].mass) + v1 * Math.sin(o1 - y) * Math.sin(y + Math.PI/2);

                    ball[i].dx = ((v2 * Math.cos(o2 - y) * (ball[j].mass - ball[i].mass) + 2 * ball[i].mass * v1 * Math.cos(o1 - y)) * Math.cos(y)) / (ball[j].mass + ball[i].mass) + v2 * Math.sin(o2 - y) * Math.cos(y + Math.PI/2);
                    ball[i].dy = ((v2 * Math.cos(o2 - y) * (ball[j].mass - ball[i].mass) + 2 * ball[i].mass * v1 * Math.cos(o1 - y)) * Math.sin(y)) / (ball[j].mass + ball[i].mass) + v2 * Math.sin(o2 - y) * Math.sin(y + Math.PI/2);
                }
            }
        }

        areStopped += distance(new Vector2(0, 0), new Vector2(ball[i].dx, ball[i].dy));

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 2; y++) {
                if(distance(ball[i].posision, new Vector2(holeR + (tableSize.x - holeR*2)/2 * x, holeR + (tableSize.y - holeR*2) * y)) < holeR) {
                    score++;
                    ball[i].deleted = true;
                }
            }
        }
    }

    let newBall = [];
    for(let i = 0; i < ball.length; i++) {
        if(!ball[i].deleted) {
            newBall.push(ball[i]);
        }
    }
    ball = newBall;

    if(areStopped <= 0.005) {
        canShoot = true;
    }

    tablePosition = new Vector2(windowSizeX/2 - tableSize.x/2, windowSizeY/2 - tableSize.y/2);
}

function draw() {
    fillRect(tablePosition, tableSize, "green");

    for(let x = 0; x < 3; x++) {
        for(let y = 0; y < 2; y++) {
            fillArc(new Vector2(holeR + (tableSize.x - holeR*2)/2 * x + tablePosition.x, holeR + (tableSize.y - holeR*2) * y + tablePosition.y), holeR, "grey");
        }
    }

    for(let i = 0; i < ball.length; i++) {
        ball[i].draw();
    }

    deg = angleFrom2Points(new Vector2(ball[0].posision.x + tablePosition.x, ball[0].posision.y + tablePosition.y), new Vector2(mouseX, mouseY));

    if(canShoot) {
        let cueLenght = 100;
        let deg2 = angleFrom2Points(new Vector2(mouseX, mouseY), new Vector2(ball[0].posision.x + tablePosition.x, ball[0].posision.y + tablePosition.y));
        drawLine(new Vector2(ball[0].posision.x + tablePosition.x + Math.cos(deg2) * (cueLenght + 10 + ballR), ball[0].posision.y + tablePosition.y + Math.sin(deg2) * (cueLenght + 10 + ballR)), new Vector2(ball[0].posision.x + tablePosition.x + Math.cos(deg2) * (10 + ballR), ball[0].posision.y + tablePosition.y + Math.sin(deg2) * (10 + ballR)), 6, "brown");

        context.lineCap = "round";
        drawLine(new Vector2(ball[0].posision.x + tablePosition.x, ball[0].posision.y + tablePosition.y), new Vector2(ball[0].posision.x + tablePosition.x + MoveForwardX(deg, ballR + 5), ball[0].posision.y + tablePosition.y + MoveForwardY(deg, ballR + 5)), 5, "black");
        drawLine(new Vector2(ball[0].posision.x + tablePosition.x, ball[0].posision.y + tablePosition.y), new Vector2(ball[0].posision.x + tablePosition.x + MoveForwardX(deg, ballR + 5), ball[0].posision.y + tablePosition.y + MoveForwardY(deg, ballR + 5)), 3, "white");
    }

    fillText("Score: " + score, new Vector2(5, 5), 25, "Arial", "white");

    UpdateParticles();
}

function mouseup() {
    let speed = 5;
    ball[0].dx = Math.cos(deg) * speed;
    ball[0].dy = Math.sin(deg) * speed;
    canShoot = false;
}

function angleFrom2Points(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}