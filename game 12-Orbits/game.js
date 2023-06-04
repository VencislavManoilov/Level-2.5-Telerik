let poleSize = new Vector2(10000, 10000);

let player = {
    size: new Vector2(80, 80),
    position: new Vector2(poleSize.x/2 - 40, poleSize.y/2 - 40),
    deg: randomInteger(0, 360),
    speed: 5,
    rotationSpeed: 1,
    rotationSpeedOnPlanet: 2,
    selectedPlanetIndex: undefined,
}

let brStars = 1000, brPlanets = 250, stars = [], cam = new Vector2(player.position.x - window.innerWidth/2, player.position.y - window.innerHeight/2), camSpeed = 15, camZoom = 1, planets = [];

let planetsImages = [planet0, planet1, planet2, planet3, planet4, planet5, planet6, planet7, planet8, planet9, planet10, planet11, planet12, planet13, planet14, planet15]
class Planet {
    constructor(position, size, deg, speed, imgNum) {
        this.position = position;
        this.size = size;
        this.deg = deg;
        this.speed = Math.floor(speed*10)/10;
        this.image = planetsImages[imgNum];
    }
}

for(j = 0; j < brStars; j++) {
    size = randomInteger(75, 150);
    stars[j] = {};
    stars[j].position = new Vector2(randomInteger(0, poleSize.x - 150), randomInteger(0, poleSize.y - 150));
    stars[j].size = new Vector2(size, size);
    stars[j].deg = randomInteger(0, 360);
}

for(i = 0; i < brPlanets; i++) {
    let size = randomInteger(100, 250);
    planets[i] = new Planet(new Vector2(randomInteger(0, poleSize.x - 250), randomInteger(0, poleSize.y - 250)), new Vector2(size, size), randomInteger(0, 360), randomOddInteger(0.1, 3), randomInteger(0, 15));
}

planets[0].position = new Vector2(randomInteger(cam.x, cam.x + windowSizeX), randomInteger(cam.y, cam.y + windowSizeY))


for(i = 0; i < brPlanets; i++) {
    while(areColliding(player.position, player.size,  planets[i].position, planets[i].size)) {
        planets[i].position = new Vector2(randomInteger(0, poleSize.x - 250), randomInteger(0, poleSize.y - 250));
    }

    for(j = 0; j < brPlanets; j++) {
        if(i != j) {
            while(areColliding(planets[i].position, planets[i].size,  planets[j].position, planets[j].size)) {
                planets[i].position = new Vector2(randomInteger(0, poleSize.x - 250), randomInteger(0, poleSize.y - 250));
            }
        }
    }
}

changeBg("black");

function update() {
    player.position.x += MoveForwardX(player.deg, player.speed);
    player.position.y += MoveForwardY(player.deg, player.speed);

    if(Input.GetKey(KeyCode.Q)) {
        camZoom -= 0.0025;
    } if(Input.GetKey(KeyCode.E)) {
        camZoom += 0.0025;
    }

    for(i = 0; i < brPlanets; i++) {
        if(areColliding(planets[i].position, planets[i].size,  player.position, player.size)) {
            player.selectedPlanetIndex = i;
        }
    }

    if(player.selectedPlanetIndex != undefined) {
        let i = player.selectedPlanetIndex;
        cam.x += (planets[i].position.x + planets[i].size.x/2 - window.innerWidth/2 - cam.x)/75;
        cam.y += (planets[i].position.y + planets[i].size.y/2 - window.innerHeight/2 - cam.y)/75;
        player.deg += player.rotationSpeedOnPlanet;
        player.position = new Vector2(planets[i].position.x + planets[i].size.x/2 - player.size.x/2 + Math.cos(player.deg/100)*planets[i].size.x, planets[i].position.y + planets[i].size.x/2 - player.size.y/2 + Math.sin(player.deg/100)*planets[i].size.y);

        if(Input.GetKey(KeyCode.Space)) {
            player.selectedPlanetIndex = undefined;
            player.deg = GetAngleFrom2Points(new Vector2(planets[i].position.x + planets[i].size.x/2, planets[i].position.y + planets[i].size.y/2), new Vector2(player.position.x + player.size.x/2, player.position.y + player.size.y/2));
        }
    } else {
        cam.x += (player.position.x + player.size.x/2 - window.innerWidth/2 - cam.x)/10;
        cam.y += (player.position.y + player.size.y/2 - window.innerHeight/2 - cam.y)/10;

        let rotate = Input.GetAxis("Horizontal");
        player.deg += rotate * player.rotationSpeed;
    }

    for(i = 1; i < brPlanets; i++) {
        planets[i].position.x += MoveForwardX(planets[i].deg, planets[i].speed);
        planets[i].position.y += MoveForwardY(planets[i].deg, planets[i].speed);
    }

    if(player.position.x < 0) {
        player.position.x = 0;
    } if(player.position.y < 0) {
        player.position.y = 0
    } if(player.position.x > poleSize.x - player.size.x) {
        player.position.x = poleSize.x - player.size.x;
    } if(player.position.y > poleSize.y - player.size.y) {
        player.position.y = poleSize.y - player.size.y;
    }
}

function draw() {
    for(j = 0; j < brStars; j++) {
        drawImage(star, new Vector2((stars[j].position.x - cam.x)*camZoom, (stars[j].position.y - cam.y)*camZoom), new Vector2(stars[j].size.x*camZoom, stars[j].size.y*camZoom), stars[j].deg);
    }

    for(i = 0; i < brPlanets; i++) {
        drawImage(planets[i].image, new Vector2((planets[i].position.x - cam.x)*camZoom, (planets[i].position.y - cam.y)*camZoom), new Vector2(planets[i].size.x*camZoom, planets[i].size.y*camZoom), planets[i].deg);
    }

    drawImage(rocket, new Vector2((player.position.x - cam.x)*camZoom, (player.position.y - cam.y)*camZoom), new Vector2(player.size.x*camZoom, player.size.y*camZoom), player.deg + 90);

    fillRect(new Vector2((-25 - cam.x)*camZoom, (-25 - cam.y)*camZoom), new Vector2((poleSize.x + 50)*camZoom, 25*camZoom), "white");
    fillRect(new Vector2((-25 - cam.x)*camZoom, (-cam.y - 1)*camZoom), new Vector2(25*camZoom, (poleSize.y + 26)*camZoom), "white");
    fillRect(new Vector2((-25 - cam.x)*camZoom, (poleSize.y - cam.y)*camZoom), new Vector2((poleSize.x + 50)*camZoom, 25*camZoom), "white");
    fillRect(new Vector2((poleSize.x - cam.x)*camZoom, (-cam.y - 1)*camZoom), new Vector2(25*camZoom, (poleSize.y + 26)*camZoom), "white");

    fillText("A and D: rotation", new Vector2(10, 10), 25, "Arial", "white");
    fillText("SPACE: getting out of orbit", new Vector2(10, 35), 25, "Arial", "white");
    fillText("Q and E: zoom", new Vector2(10, 60), 25, "Arial", "white");

    UpdateParticles();
}

function GetAngleFrom2Points(position1, position2) {
    return Math.atan2(position2.y - position1.y, position2.x - position1.x) * 180 / Math.PI;
}

function zoom(number) {
    document.body.style.zoom = number + "%";
}