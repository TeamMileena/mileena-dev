// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// TODO: resources
resources.load([
    'img/sprites.png'
]);
resources.onReady(initGame);

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

function initGame(){
    document.getElementById('btn-play').addEventListener('click', function(){
        startGame();
    });
}

function startGame() {
    document.getElementById('btn-play-again').addEventListener('click', function() {
        resetGame();
    });
    
    // Get the canvas context
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    resetGame();
    lastTime = Date.now();
    main();
}


// Reset game to original state
function resetGame() {
    // Display canvas
    document.getElementById('canvas').style.display='block';
    // Display score
    document.getElementById('score').style.display='block';
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
    document.getElementById('canvas').style.display='none';
    // Hide score
    document.getElementById('score').style.display='none';
    // Hide welcome screen
    document.getElementById('welcome-screen').style.display='none';
    // Display game over screen
    document.getElementById('game-over').style.display = 'block';

    isGameOver = true;
}