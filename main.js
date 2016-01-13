var canvas = document.getElementById("pong");
var ctx = canvas.getContext("2d");
    
var p1Score = document.getElementById("p1Score");
var p2Score = document.getElementById("p2Score");

var ballsArray = [];
var player1GunsArray = [], player2GunsArray = [];
var player1Gun1BulletsArray = [], player1Gun2BulletsArray = [], player2Gun1BulletsArray = [], player2Gun2BulletsArray = [];

var player1Paddle = new Paddle(canvas.width/2-75, 50, 150, 25, "#000000", 0, 0, 0, "#000000", false, null, 1, false, true);
var player2Paddle = new Paddle(canvas.width/2-75, canvas.height-50, 150, 25, "#000000", 0, 0, 0, "#000000", false, null, -1, false, true);
player1GunsArray = [
    new Gun(player1Paddle.x, player1Paddle.y, 5, 50, "#000000", 10, player1Gun1BulletsArray, true, 1),
    new Gun(player1Paddle.x+player1Paddle.w, player1Paddle.y, 5, 50, "#000000", 10, player1Gun2BulletsArray, true, -1)
];
player2GunsArray = [
    new Gun(player2Paddle.x, player2Paddle.y, 5, 50, "#000000", 10, player2Gun1BulletsArray, true, 1),
    new Gun(player2Paddle.x+player2Paddle.w, player2Paddle.y, 5, 50, "#000000", 10, player2Gun2BulletsArray, true, -1)
];
player1Paddle.guns = player1GunsArray;
player2Paddle.guns = player2GunsArray;

var player1 = new Player(player1Paddle, 0, false, false);
var player2 = new Player(player2Paddle, 0, false, false);
var playersArray = [player1, player2];
var gameBoard = new GameBoard(0, 0, canvas.width, canvas.height, playersArray, ballsArray, "#dddddd");

//Player input listeners
var keyState = {};
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);
var side;
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

function redrawInterface(board) {
    
    for (var i = 0; i < board.players.length; i++) {
        //Redrawing paddles
        board.players[i].paddle = new Paddle(board.players[i].paddle.x, board.players[i].paddle.y, board.players[i].paddle.w, board.players[i].paddle.h, board.players[i].paddle.c, board.players[i].paddle.xVel, board.players[i].paddle.yVel, board.players[i].paddle.speed, board.players[i].paddle.outline, board.players[i].paddle.stick, board.players[i].paddle.guns, board.players[i].paddle.direction, board.players[i].paddle.stunned, board.players[i].paddle.active);   
        
        //Redrawing all guns
        for (var j = 0; j < gameBoard.players[i].paddle.guns.length; j++) {
            if (gameBoard.players[i].paddle.guns[j].active) {
                gameBoard.players[i].paddle.guns[j] = new Gun(
                    gameBoard.players[i].paddle.x-gameBoard.players[i].paddle.guns[j].w/2-(gameBoard.players[i].paddle.guns[j].w/2 * gameBoard.players[i].paddle.guns[j].side) + gameBoard.players[i].paddle.w/2 + (gameBoard.players[i].paddle.guns[j].side * gameBoard.players[i].paddle.w/2), //x position
                    gameBoard.players[i].paddle.y+(gameBoard.players[i].paddle.h * gameBoard.players[i].paddle.direction) -(gameBoard.players[i].paddle.h/2), //y position
                    gameBoard.players[i].paddle.guns[j].w, gameBoard.players[i].paddle.guns[j].h, gameBoard.players[i].paddle.guns[j].c, gameBoard.players[i].paddle.guns[j].ammo, gameBoard.players[i].paddle.guns[j].bulletsArray, gameBoard.players[i].paddle.guns[j].active, gameBoard.players[i].paddle.guns[j].side); //everything else
            }
        }
        
        //Redrawing all bullets
        for (var k = 0; k < gameBoard.players[i].paddle.guns.length; k++) {
            for (var j = 0; j < gameBoard.players[i].paddle.guns[k].bulletsArray.length; j++) {
                gameBoard.players[i].paddle.guns[k].bulletsArray[j] = new Bullet(gameBoard.players[i].paddle.guns[k].bulletsArray[j].x, gameBoard.players[i].paddle.guns[k].bulletsArray[j].y, gameBoard.players[i].paddle.guns[k].bulletsArray[j].w, gameBoard.players[i].paddle.guns[k].bulletsArray[j].h, gameBoard.players[i].paddle.guns[k].bulletsArray[j].c, gameBoard.players[i].paddle.guns[k].bulletsArray[j].xVel, gameBoard.players[i].paddle.guns[k].bulletsArray[j].yVel, gameBoard.players[i].paddle.guns[k].bulletsArray[j].damage);  
            }
        }
        
        //Reconstructing player objects
        gameBoard.players[i] = new Player(gameBoard.players[i].paddle, gameBoard.players[i].score, gameBoard.players[i].ballDisabled, gameBoard.players[i].bulletDisabled);
    }
    
    //Redrawing all balls
    for (var i = 0; i < gameBoard.balls.length; i++) {
  
        gameBoard.balls[i] = new Ball(gameBoard.balls[i].x, gameBoard.balls[i].y, gameBoard.balls[i].w, gameBoard.balls[i].h, gameBoard.balls[i].c, gameBoard.balls[i].xVel, gameBoard.balls[i].yVel, gameBoard.balls[i].xAngle, gameBoard.balls[i].yAngle, gameBoard.balls[i].active);  
    }
    
    //Reconstruct level object
    gameBoard = new GameBoard(gameBoard.x, gameBoard.y, gameBoard.w, gameBoard.h, gameBoard.players, gameBoard.balls, gameBoard.backgroundColor);
}

function checkForCollision(board) {
    
    for (var k = 0; k < gameBoard.players.length; k++) {
        var enemy; 
        if (k+1 === gameBoard.players.length) {
            enemy = 0;
        } else {
            enemy = k+1;
        }
        
         if (gameBoard.players[k].paddle.stunned) {
             var lightning1  = new Lightning(gameBoard.players[k].paddle.x, gameBoard.players[k].paddle.y, gameBoard.players[k].paddle.w, gameBoard.players[k].paddle.h, "#0000ff");
             var lightning1  = new Lightning(gameBoard.players[k].paddle.x, gameBoard.players[k].paddle.y, gameBoard.players[k].paddle.w, gameBoard.players[k].paddle.h, "#eeee00");
         }
        
        for (var i = 0; i < gameBoard.players[k].paddle.guns.length; i++) {
            for (var j = 0; j < gameBoard.players[k].paddle.guns[i].bulletsArray.length; j++) {
                var enemyGun; 
                if (i+1 === gameBoard.players[k].paddle.guns.length ) {
                    enemyGun = 0;
                } else {
                    enemyGun = i+1;
                }        
                //Bullet collision with guns
                if (gameBoard.players[enemy].paddle.guns[i].active) {
                    if (checkSpecificCollision(gameBoard.players[k].paddle.guns[i].bulletsArray[j], gameBoard.players[enemy].paddle.guns[i], gameBoard.players[enemy].paddle.guns[i].x, gameBoard.players[enemy].paddle.y + (gameBoard.players[enemy].paddle.h/2 * gameBoard.players[enemy].paddle.direction), gameBoard.players[enemy].paddle.guns[i].w, gameBoard.players[enemy].paddle.guns[i].h)) {
                        gameBoard.players[enemy].paddle.guns[i].active = false;
                        gameBoard.players[k].paddle.guns[i].bulletsArray.splice(j, 1);
                        var boomSound = new Audio("boom.wav");
                        boomSound.play();
                        break;
                    }  
                }
                
                if (gameBoard.players[enemy].paddle.guns[enemyGun].active) {
                    if (checkSpecificCollision(gameBoard.players[k].paddle.guns[i].bulletsArray[j], gameBoard.players[enemy].paddle.guns[enemyGun], gameBoard.players[enemy].paddle.guns[enemyGun].x, gameBoard.players[enemy].paddle.y + (gameBoard.players[enemy].paddle.h/2 * gameBoard.players[enemy].paddle.direction), gameBoard.players[enemy].paddle.guns[enemyGun].w, gameBoard.players[enemy].paddle.guns[enemyGun].h)) {
                        gameBoard.players[enemy].paddle.guns[enemyGun].active = false;
                        gameBoard.players[k].paddle.guns[enemyGun].bulletsArray.splice(j, 1);
                        break;
                    }
                }
                
                //Bullet collision with paddles
                if (checkSpecificCollision(gameBoard.players[k].paddle.guns[i].bulletsArray[j], gameBoard.players[enemy].paddle, gameBoard.players[enemy].paddle.x+gameBoard.players[enemy].paddle.w/2, gameBoard.players[enemy].paddle.y + (gameBoard.players[enemy].paddle.h/2 * gameBoard.players[enemy].paddle.direction), gameBoard.players[enemy].paddle.w/2, gameBoard.players[enemy].paddle.h/2)) {
                    gameBoard.players[k].paddle.guns[i].bulletsArray.splice(j, 1);
                    gameBoard.players[enemy].paddle.stunned = true;
                    var electricSound = new Audio("electricShock.wav");
                    electricSound.volume = .2;
                    electricSound.play();
                    var temp = enemy;
                    setTimeout(function(){
                        gameBoard.players[temp].paddle.stunned = false;
                        electricSound.pause();
                    }, 1500);
                    break;
                }
                
                //Bullet collision with balls
                for (var l = 0; l < gameBoard.balls.length; l++) {
                    if (checkSpecificCollision(gameBoard.players[k].paddle.guns[i].bulletsArray[j], gameBoard.balls[l], gameBoard.balls[l].x, gameBoard.balls[l].y, gameBoard.balls[l].w, gameBoard.balls[l].h)) {
                        var breakSound = new Audio("break.wav");
                        breakSound.volume = .3;
                        breakSound.play();
                        gameBoard.players[k].paddle.guns[i].bulletsArray.splice(j, 1);
                        gameBoard.balls.splice(l, 1);
                        break;
                    }
                }
            }
        }
        
        for (var i = 0; i < gameBoard.balls.length; i++) {
            //Ball collision with paddles
            if (checkSpecificCollision(gameBoard.players[k].paddle, gameBoard.balls[i], gameBoard.balls[i].x, gameBoard.balls[i].y, gameBoard.balls[i].w, gameBoard.balls[i].h)) {
                if (gameBoard.players[k].paddle.active) {                
                    if ((gameBoard.balls[i].y < gameBoard.players[1].paddle.y && gameBoard.balls[i].yVel > 0) ||
                        gameBoard.balls[i].y > gameBoard.players[0].paddle.y && gameBoard.balls[i].yVel < 0
                       ) {
   
                        var paddleAngle = gameBoard.players[k].paddle.x+gameBoard.players[k].paddle.w/2 - gameBoard.balls[i].x;
                        gameBoard.balls[i].yVel = -gameBoard.balls[i].yVel;
                        gameBoard.balls[i].xVel = -paddleAngle/20;
                        gameBoard.players[k].paddle.active = false;
                        setTimeout(function(){
                            gameBoard.players[0].paddle.active = true;
                            gameBoard.players[1].paddle.active = true;
                        }, 200);
                        break;
                    }
                }
            }
        }
    }
    
    for (var i = 0; i < gameBoard.balls.length; i++) {
        if (gameBoard.balls[i].y > gameBoard.players[1].paddle.y+gameBoard.players[1].paddle.h*2) {
            gameBoard.balls.splice(i, 1);
            gameBoard.players[0].score++;
            var scoreSound = new Audio("pointScore.wav");
            scoreSound.play();
            for (var j = 0; j < gameBoard.players[0].paddle.guns.length; j++) {
                if (!gameBoard.players[0].paddle.guns[j].active) {
                    gameBoard.players[0].paddle.guns[j].active = true;
                    break;
                }
            }
            break;
        }
        
        if (gameBoard.balls[i].y < gameBoard.players[0].paddle.y-gameBoard.players[0].paddle.h*2){
            gameBoard.balls.splice(i, 1);
            gameBoard.players[1].score++;
            var scoreSound = new Audio("pointScore.wav");
            scoreSound.play();
            for (var j = 0; j < gameBoard.players[1].paddle.guns.length; j++) {
                if (!gameBoard.players[1].paddle.guns[j].active) {
                    gameBoard.players[1].paddle.guns[j].active = true;
                    break;
                }
            }
            break;
        }
    } 
         
    //Ball collision with other balls
    for (var i = 0; i < gameBoard.balls.length; i++) {
        for (var j = 0; j < gameBoard.balls.length; j++) {
            if (i !== j) {
                if (checkSpecificCollision(gameBoard.balls[i], gameBoard.balls[j], gameBoard.balls[j].x, gameBoard.balls[j].y, gameBoard.balls[j].w, gameBoard.balls[j].h)) {
                
                    if ((gameBoard.balls[i].y > gameBoard.balls[j].y && gameBoard.balls[i].yVel < 0 && gameBoard.balls[j].yVel > 0) ||
                        (gameBoard.balls[i].y < gameBoard.balls[j].y && gameBoard.balls[i].yVel > 0 && gameBoard.balls[j].yVel < 0) ||
                        (gameBoard.balls[i].x < gameBoard.balls[j].x && gameBoard.balls[i].xVel > 0 && gameBoard.balls[j].xVel < 0) ||
                        (gameBoard.balls[i].x > gameBoard.balls[j].y && gameBoard.balls[i].yVel < 0 && gameBoard.balls[j].yVel > 0)) {
                
                        gameBoard.balls[j].yVel = gameBoard.balls[j].yVel * gameBoard.balls[j].yAngle;
                        gameBoard.balls[j].xVel = gameBoard.balls[j].xVel * gameBoard.balls[j].xAngle;
                 
            
                        gameBoard.balls[i].yVel = gameBoard.balls[i].yVel * gameBoard.balls[i].yAngle;
                        gameBoard.balls[i].xVel = gameBoard.balls[i].xVel * gameBoard.balls[i].xAngle;
                    }
                }
            }
            //Ball collision with walls
            if (!checkSpecificCollision(gameBoard, gameBoard.balls[i], gameBoard.balls[i].x, gameBoard.balls[i].y, gameBoard.balls[i].w/2, gameBoard.balls[i].h/2)) {
                
                if ((gameBoard.balls[i].y > gameBoard.y && gameBoard.balls[i].yVel < 0) ||
                    (gameBoard.balls[i].y < gameBoard.y+gameBoard.h && gameBoard.balls[i].yVel > 0) ||
                    (gameBoard.balls[i].x > gameBoard.x && gameBoard.balls[i].xVel < 0) ||
                    (gameBoard.balls[i].x < gameBoard.x+gameBoard.w && gameBoard.balls[i].xVel > 0)) {
                
                    gameBoard.balls[i].yVel = gameBoard.balls[i].yVel * gameBoard.balls[i].yAngle;
                    gameBoard.balls[i].xVel = gameBoard.balls[i].xVel * gameBoard.balls[i].xAngle;
                    break;
                }
            }
        }
    }
}

function launchBall(player, direction) {
    var launchBallSound = new Audio("launchBall.wav");
    launchBallSound.play();
    var tempC = getRandomColor();
    gameBoard.balls.push(new Ball(player.paddle.x+player.paddle.w/2, player.paddle.y+(player.paddle.h*2*direction), 20, 20, tempC, 0, 3*direction, 1, 1, true));
}

function shootBullet(player, direction) {
    if (player.paddle.guns[0].active) {
        var shootSound = new Audio("shoot.wav");
        shootSound.volume = .1;
        shootSound.play();
        player.paddle.guns[0].bulletsArray.push(new Bullet(player.paddle.guns[0].x, player.paddle.guns[0].y, 5, 30, "#ff0000", 0, 8*direction, 1));
    }
    if (player.paddle.guns[1].active) {
        var shootSound = new Audio("shoot.wav");
        shootSound.volume = .1;
        shootSound.play();
        player.paddle.guns[1].bulletsArray.push(new Bullet(player.paddle.guns[1].x, player.paddle.guns[1].y, 5, 30, "#ff0000", 0, 8*direction, 1));
    }
}

function getRandomColor() {
    var letters = '0123456789AB'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 12)];
    }
    return color;
}

function activatePhysics(item, xVelocity, yVelocity){
    item.x += xVelocity;
    item.y += yVelocity;
}

function checkSpecificCollision(rect, collider, x, y, w, h) {
    var distX = Math.abs(x - rect.x-rect.w/2);
    var distY = Math.abs(y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + w)) return false;
    if (distY > (rect.h/2 + h)) return false;

    if (distX <= (rect.w/2)) { //top/bottom collision
        if (typeof collider.xAngle !== "undefined") collider.xAngle = 1;
        if (typeof collider.yAngle !== "undefined") collider.yAngle = -1;
        return true; 
    } 
    if (distY <= (rect.h/2)) { //left/right collision
        if (typeof collider.xAngle !== "undefined") collider.xAngle = -1;
        if (typeof collider.yAngle !== "undefined") collider.yAngle = 1;
        return true; 
    }
    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(w*h));
}

function newRound() {
    for (var i = 0; i < gameBoard.players.length; i++) {
        gameBoard.players[i].paddle.x = canvas.width/2-75;
        for (var j = 0; j < gameBoard.players[i].paddle.guns.length; j++) {
            gameBoard.players[i].paddle.guns[j].active = true;
            gameBoard.players[i].paddle.guns[j].bulletsArray.splice(0, gameBoard.players[i].paddle.guns[j].bulletsArray.length);
        }
    }
    gameBoard.balls.splice(0, gameBoard.balls.length);
    
}

//Main loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.background = gameBoard.backgroundColor;
    
    p1Score.innerHTML = gameBoard.players[0].score;
    p2Score.innerHTML = gameBoard.players[1].score;
    
    redrawInterface(gameBoard);
    checkForCollision(gameBoard);
    
    //Physics
    for (var i = 0; i < gameBoard.balls.length; i++) {
        activatePhysics(gameBoard.balls[i], gameBoard.balls[i].xVel, gameBoard.balls[i].yVel);   
    }
    
    for (var k = 0; k < gameBoard.players.length; k++) {
        for (var i = 0; i < gameBoard.players[k].paddle.guns.length; i++) {
            for (var j = 0; j < gameBoard.players[k].paddle.guns[i].bulletsArray.length; j++) {
                activatePhysics(gameBoard.players[k].paddle.guns[i].bulletsArray[j], gameBoard.players[k].paddle.guns[i].bulletsArray[j].xVel, gameBoard.players[k].paddle.guns[i].bulletsArray[j].yVel);   
            }
        }
    }
    
    //Player 1 input
    if (keyState[68] && !gameBoard.players[0].paddle.stunned) { //d
        if (gameBoard.players[0].paddle.x + gameBoard.players[0].paddle.w < gameBoard.x+gameBoard.w) {
            gameBoard.players[0].paddle.x+=5;
        }
    } 
    if (keyState[65] && !gameBoard.players[0].paddle.stunned) { //a
        if (gameBoard.players[0].paddle.x > gameBoard.x) {
            gameBoard.players[0].paddle.x-=5;
        }
    }
    if (keyState[87] && !gameBoard.players[0].bulletDisabled) { //w
        shootBullet(gameBoard.players[0], 1);
        gameBoard.players[0].bulletDisabled = true;
        keyState[87] = false;
        setTimeout(function(){
            gameBoard.players[0].bulletDisabled = false;
        },3000);
    }
    if (keyState[83] && !gameBoard.players[0].ballDisabled) { //s
        launchBall(gameBoard.players[0], 1);
        keyState[83] = false;
        gameBoard.players[0].ballDisabled = true;
        setTimeout(function(){
            gameBoard.players[0].ballDisabled = false;
        },3000);
    }
    
    //Player 2 input
    if (keyState[39] && !gameBoard.players[1].paddle.stunned) { //right arrow
        if (gameBoard.players[1].paddle.x + gameBoard.players[1].paddle.w < gameBoard.x+gameBoard.w) {
            gameBoard.players[1].paddle.x+=5;
        }
    }
    if (keyState[37] && !gameBoard.players[1].paddle.stunned) { //left arrow
        if (gameBoard.players[1].paddle.x > gameBoard.x) {
            gameBoard.players[1].paddle.x-=5;
        }
    }
    if (keyState[38] && !gameBoard.players[1].bulletDisabled) { //up arrow
        shootBullet(gameBoard.players[1], -1);
        gameBoard.players[1].bulletDisabled = true;
        keyState[38] = false;
        setTimeout(function(){
            gameBoard.players[1].bulletDisabled = false;
        },3000)
    }
    if (keyState[40] && !gameBoard.players[1].ballDisabled) { // down arrow
        launchBall(gameBoard.players[1], -1);
        gameBoard.players[1].ballDisabled = true;
        keyState[40] = false;
        setTimeout(function(){
            gameBoard.players[1].ballDisabled = false;
        },3000);
    }
}
var currentInterval = setInterval(gameLoop, 10);