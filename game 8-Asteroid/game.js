let updates = 0, startShooting = false;

let player = {
    sizeX: 48,
    sizeY: 64,
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    speed: 4,
    deg: 0,
    rotateSpeed: 2.5,

    ammo: {
        x: [],
        y: [],
        deg: [],
        remainingTime: [],
        sizeX: 5,
        sizeY: 5,
        speed: 6,
        time: 150,
        shootingSpeed: 25,
        br: 0,

        add: function(x, y, deg) {
            PlaySound("laserShoot_4");
            
            this.x[this.br] = x;
            this.y[this.br] = y;
            this.deg[this.br] = deg;
            this.remainingTime[this.br] = this.time;
            
            this.br++;
        },
        
        delete: function(index) {
            this.x.splice(index, 1);
            this.y.splice(index, 1);
            this.deg.splice(index, 1);
            this.remainingTime.splice(index, 1);
            
            this.br--;
        }
    }
}

let asteroids = {
    x: [],
    y: [],
    size: [],
    deg: [],
    activeSize: [],
    firstSize: 100,
    speed: 3,
    howManyTimesWillSplit: 2,
    br: 5,
    
    delete: function(index) {
        ParticleEffect(this.x[index], this.y[index], 5, 5, 50, -5, -5, 5, 5, 100, 0, 0.75, false, 'brown');
        PlaySound("hitHurt");
        
        this.x.splice(index, 1);
        this.y.splice(index, 1);
        this.size.splice(index, 1);
        this.activeSize.splice(index, 1);
        this.deg.splice(index, 1);
        
        this.br--;
    },

    RestoreAsteroids: function(br) {
        asteroids.br = br;
        
        for(j = 0; j < asteroids.br; j++) {
            asteroids.size[j] = asteroids.firstSize;
            asteroids.activeSize[j] = 0;
            asteroids.deg[j] = randomInteger(0, 360);
            
            while(asteroids.x[j] == undefined || areColliding(asteroids.x[j], asteroids.y[j], asteroids.size[j], asteroids.size[j], player.x, player.y, player.sizeX, player.sizeY)) {
                asteroids.x[j] = randomInteger(0, windowSizeX - asteroids.size[j]);
                asteroids.y[j] = randomInteger(0, windowSizeY - asteroids.size[j]);
            }
        }
    }
}

let stars = {
    x: [],
    y: [],
    size: [],
    deg: [],
    br: randomInteger(15, 25),
    minSize: 5,
    maxSize: 75
}

function init() {
    player.x = windowSizeX/2 - player.sizeX/2;
    player.y = windowSizeY/2 - player.sizeY/2;
    
    for(s = 0; s < stars.br; s++) {
        stars.size[s] = randomInteger(stars.minSize, stars.maxSize);
        stars.deg[s] = randomInteger(0, 360);
        
        stars.x[s] = randomInteger(0, windowSizeX - stars.size[s]);
        stars.y[s] = randomInteger(0, windowSizeY - stars.size[s]);
    }
    
    asteroids.RestoreAsteroids(asteroids.br);
}

function update() {
    updates++;
    
    if(MoveLeft()) {
        player.deg -= player.rotateSpeed;
    } if(MoveRight()) {
        player.deg += player.rotateSpeed;
    }
    
    if(MoveUp()) {
        player.dx += 0.015;
        player.dy += 0.015;
    }

    player.x += MoveForwardX(player.deg, player.speed * player.dx);
    player.y += MoveForwardY(player.deg, player.speed * player.dy);
    
    player.dx /= 1.015;
    player.dy /= 1.015;
    
    if(Jump()) {
        if(!startShooting) {
            player.ammo.add(player.x + 24, player.y + 32, player.deg);
            startShooting = true;
        } else if(updates%player.ammo.shootingSpeed == 0) {
            player.ammo.add(player.x + 24, player.y + 32, player.deg);
        }
    } else {
        startShooting = false;
    }
    
    for(i = 0; i < player.ammo.br; i++) {
        player.ammo.x[i] += MoveForwardX(player.ammo.deg[i], player.ammo.speed);
        player.ammo.y[i] += MoveForwardY(player.ammo.deg[i], player.ammo.speed);
        player.ammo.remainingTime[i]--;
        
        if(player.ammo.remainingTime[i] <= 0) {
            player.ammo.delete(i);
        }
        
        if(player.ammo.x[i] < 0 - player.ammo.sizeX) {
            player.ammo.x[i] = windowSizeX;
        } if(player.ammo.y[i] < 0 - player.ammo.sizeY) {
            player.ammo.y[i] = windowSizeY;
        } if(player.ammo.x[i] > windowSizeX) {
            player.ammo.x[i] = 0 - player.ammo.sizeX;
        } if(player.ammo.y[i] > windowSizeY) {
            player.ammo.y[i] = 0 - player.ammo.sizeY;
        }
    }
    
    for(j = 0; j < asteroids.br; j++) {
        asteroids.x[j] += MoveForwardX(asteroids.deg[j], asteroids.speed);
        asteroids.y[j] += MoveForwardY(asteroids.deg[j], asteroids.speed);
        
        if(asteroids.x[j] < 0 - asteroids.size[j]) {
            asteroids.x[j] = windowSizeX;
        } if(asteroids.y[j] < 0 - asteroids.size[j]) {
            asteroids.y[j] = windowSizeY;
        } if(asteroids.x[j] > windowSizeX) {
            asteroids.x[j] = 0 - asteroids.size[j];
        } if(asteroids.y[j] > windowSizeY) {
            asteroids.y[j] = 0 - asteroids.size[j];
        }
        
        if(areColliding(player.x, player.y, player.sizeX, player.sizeY,  asteroids.x[j], asteroids.y[j], asteroids.size[j], asteroids.size[j])) {
            console.log("You are stupid!!!");
        }
        
        for(i = 0; i < player.ammo.br; i++) {
            if(areColliding(player.ammo.x[i], player.ammo.y[i], player.ammo.sizeX, player.ammo.sizeY,  asteroids.x[j], asteroids.y[j], asteroids.size[j], asteroids.size[j]) && asteroids.activeSize[j] < asteroids.howManyTimesWillSplit) {
                PlaySound("hitHurt");
                ParticleEffect(player.ammo.x[i], player.ammo.y[i], 5, 5, 10, -5, -5, 5, 5, 100, 0, 0.75, false, 'brown');
                player.ammo.delete(i);
                
                if(asteroids.activeSize[j] < asteroids.howManyTimesWillSplit - 1) {
                    asteroids.activeSize[j]++;
                    asteroids.size[j] /= 2;
                } else {
                    asteroids.delete(j);
                }
            }
        }
    }
    
    if(asteroids.br <= 0) {
        asteroids.RestoreAsteroids(5);
    }
    
    if(player.x < 0 - player.sizeX - 1) {
        player.x = windowSizeX;
    } if(player.y < 0 - player.sizeY - 1) {
        player.y = windowSizeY;
    } if(player.x > windowSizeX + 1) {
        player.x = 0 - player.sizeX;
    } if(player.y > windowSizeY + 1) {
        player.y = 0 - player.sizeY;
    }
}

function draw() {
    for(s = 0; s < stars.br; s++) {
        drawImage(star, stars.x[s], stars.y[s], stars.size[s], stars.size[s], stars.deg[s]);
    }

    for(i = 0; i < player.ammo.br; i++) {
        drawImage(ammo, player.ammo.x[i], player.ammo.y[i], player.ammo.sizeX, player.ammo.sizeY, player.ammo.deg[i]);
    }

    for(j = 0; j < asteroids.br; j++) {
        drawImage(kufte, asteroids.x[j], asteroids.y[j], asteroids.size[j], asteroids.size[j], asteroids.deg[j]);
    }

    drawImage(playerShip1_blue, player.x, player.y, player.sizeX, player.sizeY, player.deg + 90);
    UpdateParticles();
}