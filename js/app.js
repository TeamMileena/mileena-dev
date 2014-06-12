var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Get the canvas context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//load the audio files
var blasterSound = document.getElementById('blaster-snd');
var explosionSound = document.getElementById('explode-snd');

//functions for playing the sounds
function playBlasterSound() {
    blasterSound.load();
    blasterSound.play();
}

function playExplosionSound() {
    explosionSound.load();
    explosionSound.play();
}

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    // TODO: update() and render()
    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function initGame() {
    startGame();
    var todelete = 'justtesting';
}

function startGame() {
    document.getElementById('btn-play-again').addEventListener('click', function () {
        resetGame();
    });

    resetGame();
    lastTime = Date.now();
    main();
}

// TODO: resources
resources.load([
    'img/ships.png'
]);
//resources.onReady(initGame);
document.getElementById('btn-play').addEventListener('click', initGame);


// Reset game to original state
function resetGame() {
    // Display canvas
    document.getElementById('canvas').style.display = 'block';
    // Display score
    document.getElementById('score').style.display = 'block';
    // Hide welcome screen
    document.getElementById('welcome-screen').style.display = 'none';
    // Hide game over screen
    document.getElementById('game-over').style.display = 'none';

    // TODO: variables declaration
    isGameOver = false;
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
};

// Game over
function gameOver() {
    // Hide canvas
    document.getElementById('canvas').style.display = 'none';
    // Hide score
    document.getElementById('score').style.display = 'none';
    // Hide welcome screen
    document.getElementById('welcome-screen').style.display = 'none';
    // Display game over screen
    document.getElementById('game-over').style.display = 'block';

    isGameOver = true;
}

// Game state
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/ships.png', [0, 0], [43, 20], 10, [0, 1, 2, 3])
};

var bullets = [],
    enemies = [],
    explosions = [];

var lastFire = Date.now(),
    gameTime = 0,
    isGameOver;
//var terrainPattern;

var score = 0,
    scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200,
    bulletSpeed = 500,
    enemySpeed = 100;

// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // Make the game harder
    if (Math.random() < 1 - Math.pow(.997, gameTime)) {
        enemies.push({
            pos: [canvas.width,
                  Math.random() * (canvas.height - 29)],
            sprite: new Sprite('img/ships.png', [0, 100], [56, 29],
                               6, [0, 1, 2, 3])
        });
    }

    checkCollisions();

    scoreEl.innerHTML = score;
};

function handleInput(dt) {
    if (input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if (input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }

    if (input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;

        playBlasterSound();

        bullets.push({
            pos: [x, y],
            dir: 'forward',
            sprite: new Sprite('img/ships.png', [0, 39], [18, 8])
        });
        //bullets.push({
        //    pos: [x, y],
        //    dir: 'up',
        //    sprite: new Sprite('img/ships.png', [0, 50], [9, 5])
        //});
        //bullets.push({
        //    pos: [x, y],
        //    dir: 'down',
        //    sprite: new Sprite('img/ships.png', [0, 60], [9, 5])
        //});

        lastFire = Date.now();
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    // Update all the bullets
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        switch (bullet.dir) {
            case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
            case 'down': bullet.pos[1] += bulletSpeed * dt; break;
            default:
                bullet.pos[0] += bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if (bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if (enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Update explosions
    for (var i = 0; i < explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if (explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();

    // Run collision detection for all enemies and bullets
    for (var i = 0; i < enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        for (var j = 0; j < bullets.length; j++) {
            var pos2 = bullets[j].pos,
                size2 = bullets[j].sprite.size;

            if (boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                score += 100;

                playExplosionSound();

                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/ships.png',
                                       [0, 138],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });

                bullets.splice(j, 1);// Remove the bullet and stop this iteration
                break;
            }
        }

        if (boxCollides(pos, size, player.pos, player.sprite.size)) {
            gameOver();
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if (player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

// Draw everything
function render() {
    //ctx.fillStyle = terrainPattern;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    // Render the player
    if (!isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

function renderEntities(list) {
    for (var i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
