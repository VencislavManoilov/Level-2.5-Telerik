let snake = {
    position: new Vector2(0, 0),
    scale: new Vector2(25, 25),
    speed: 1.5,
    boostSpeed: 3,
    deg: 0,
    rotateSpeed: 3,

    tail: {
        br: 0,
        position: [],
        color: [],

        add: function() {
            if(this.br == 0) {
                this.position[this.br] = new Vector2(snake.position.x, snake.position.y);
            } else {
                this.position[this.br] = new Vector2(snake.tail.position[this.br - 1].x, snake.tail.position[this.br - 1].y);
            }

            this.color[this.br] = 'rgb(' + randomInteger(0, 254) + ', ' + randomInteger(0, 254) + ', ' + randomInteger(0, 254) + ')';

            this.br++;
        }
    }
}

let points = {
    br: 25,
    position: [],
    scale: new Vector2(5, 5),

    delete: function(index) {
        this.position[index] = new Vector2(randomInteger(0, windowSizeX - points.scale.x), randomInteger(0, windowSizeY - points.scale.y));
    }
}

function init() {
    snake.position.x = windowSizeX/2 - snake.scale.x/2;
    snake.position.y = windowSizeY/2 - snake.scale.y/2;

    for(j = 0; j < points.br; j++) {
        points.position[j] = new Vector2(randomInteger(0, windowSizeX - points.scale.x), randomInteger(0, windowSizeY - points.scale.y));
    }
}

function update() {
    snake.deg = Math.atan2(mouseY - snake.position.y - snake.scale.y/2, mouseX - snake.position.x - snake.scale.x/2) * 180 / Math.PI;

    if(distance(new Vector2(mouseX, mouseY), new Vector2(snake.position.x + snake.scale.x/2, snake.position.y + snake.scale.y/2)) >= snake.scale.x/2) {
        if(Input.GetKey(KeyCode.Space)) {
            snake.position.x += MoveForwardX(snake.deg, snake.boostSpeed);
            snake.position.y += MoveForwardY(snake.deg, snake.boostSpeed);
        } else {
            snake.position.x += MoveForwardX(snake.deg, snake.speed);
            snake.position.y += MoveForwardY(snake.deg, snake.speed);
        }
    }

    for(i = 0; i < snake.tail.br; i++) {
        if(distance(new Vector2(mouseX, mouseY), new Vector2(snake.position.x + snake.scale.x/2, snake.position.y + snake.scale.y/2)) >= snake.scale.x/2) {
            if(i == 0) {
                snake.tail.position[i].x += (snake.position.x - snake.tail.position[i].x)/5;
                snake.tail.position[i].y += (snake.position.y - snake.tail.position[i].y)/5;
            } else {
                snake.tail.position[i].x += (snake.tail.position[i - 1].x - snake.tail.position[i].x)/5;
                snake.tail.position[i].y += (snake.tail.position[i - 1].y - snake.tail.position[i].y)/5;
            }
        }
    }

    for(j = 0; j < points.br; j++) {
        if(areColliding(snake.position, snake.scale,  points.position[j], points.scale)) {
            points.delete(j);
            snake.tail.add();
        }
    }
}

function draw() {
    for(j = 0; j < points.br; j++) {
        drawImage(tail, points.position[j], points.scale, 0);
    }

    for(i = 0; i < snake.tail.br; i++) {
        // fillArc(snake.tail.position[i], snake.scale.x/2, snake.tail.color[i]);
        drawImage(kufte, snake.tail.position[i], snake.scale, 0);
    }

    drawImage(kufte, snake.position, snake.scale, snake.deg);

    // Don't delete this!!! (It's for particles)
    UpdateParticles();
}

function mouseup() {
    snake.tail.add();
}