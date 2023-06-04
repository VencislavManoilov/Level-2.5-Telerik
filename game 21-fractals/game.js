let parts = [], startPoint = new Vector2(windowSizeX/2, windowSizeY - 100);

function update() {

}

function draw() {
    drawChertichka(startPoint.x, startPoint.y, 0, 50, 0, 50);

    UpdateParticles();
}

function drawChertichka(x, y, angle, size, color, level) {
    context.strokeStyle = "hsl(" + color + ", 100%, 50%)";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + MoveForwardX(angle, size), y + MoveForwardY(angle, size));
    context.stroke();
    if(level > 0) {
        drawChertichka(x + MoveForwardX(angle, size), y + MoveForwardY(angle, size), angle + 30, size/1.3, color + 25, level - 1);
        drawChertichka(x + MoveForwardX(angle, size), y + MoveForwardY(angle, size), angle - 30, size/1.3, color + 25, level - 1);
    }
}