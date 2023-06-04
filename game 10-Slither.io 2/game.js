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

            this.colorFriquency = 2*Math.PI/24;

            this.color[this.br] = makeColorGradient(this.colorFriquency, this.colorFriquency, this.colorFriquency, 0, 2, 4, 128, 127, this.br);
            this.br++;
        }
    }
}

class Enemy {
    constructor(position, deg, color) {
        this.position = position;
        this.deg = deg;
        this.color = color;
    }
}

function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, index) {
    if (center == undefined) {
        center = 128;
    } if (width == undefined) {
        width = 127;
    } if (index == undefined) {
        index = 1;
    }

    var red = Math.sin(frequency1*index + phase1) * width + center;
    var grn = Math.sin(frequency2*index + phase2) * width + center;
    var blu = Math.sin(frequency3*index + phase3) * width + center;

    return RGB2Color(red, grn, blu);
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
        fillArc(snake.tail.position[i], snake.scale.x/2, snake.tail.color[i]);
    }

    drawImage(kufte, snake.position, snake.scale, snake.deg);

    // Don't delete this!!! (It's for particles)
    UpdateParticles();
}

function mouseup() {
    snake.tail.add();
}

function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}