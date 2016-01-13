function Player(paddle, score, ballDisabled, bulletDisabled) {
    this.paddle = paddle;
    this.score = score;
    this.ballDisabled = ballDisabled;
    this.bulletDisabled = bulletDisabled;
}

function Paddle(x, y, w, h, c, xVel, yVel, speed, outline, stick, guns, direction, stunned, active) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.speed = speed;
    this.outline = outline;
    this.stick = stick;
    this.guns = guns;
    this.direction = direction;
    this.stunned = stunned;
    this.active = active;
    
    if (stick) {
        outline = "#00dd00";
    } else {
        outline = c
    }
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.lineWidth = 5;
    ctx.strokeStyle = outline;
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}


function Ball(x, y, w, h, c, xVel, yVel, xAngle, yAngle, active) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.xAngle = xAngle;
    this.yAngle = yAngle;
    this.active = active;
    
    ctx.beginPath();
    ctx.arc(x, y, w, 0, 2 * Math.PI, false);
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    ctx.lineWidth = "5";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function Gun(x, y, w, h, c, ammo, bulletsArray, active, side) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.ammo = ammo;
    this.bulletsArray = bulletsArray;
    this.active = active;
    this.side = side;
    
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.lineWidth = 5;
    ctx.strokeStyle = c;
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function Bullet(x, y, w, h, c, xVel, yVel, damage) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.damage = damage;
    
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function GameBoard(x, y, w, h, players, balls, backgroundColor) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.players = players;
    this.balls = balls;
    this.backgroundColor = backgroundColor;
    
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function Lightning(x, y, w, h, c, duration) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.duration = duration;
    
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.moveTo((Math.random() * (x+w - x) + x), (Math.random() * ((y+h*2) - y+h/2) + y+h/2));   
    ctx.lineTo((Math.random() * (x+w - x) + x), (Math.random() * ((y+h*2) - y-h/2) + y-h/2));          
    ctx.lineTo((Math.random() * (x+w - x) + x), (Math.random() * ((y+h*2) - y-h/2) + y-h/2));          
    ctx.lineTo((Math.random() * (x+w - x) + x), (Math.random() * ((y+h*2) - y-h/2) + y-h/2));          
    ctx.lineTo((Math.random() * (x+w - x) + x), (Math.random() * ((y+h*2) - y-h/2) + y-h/2));          
    
    ctx.stroke();
    ctx.closePath();
}