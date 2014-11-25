var context = null;

var canvasHeight = null;
var canvasWidth = null;

var frameRate = 60;

var gravity = 8 / 1000 * frameRate;

var speedX = 0;
var speedY = 0;

var actualHeight = 0;
var maxHeight = 0;

var distance = 0;
var highScore = 0;

var isThrown = false;
var isDraged = false;

var mouseOldPosX = null;
var mouseOldPosY = null;

var mouseAccSpeedX = 0;
var mouseAccSpeedY = 0;

var powerUps = new Array();

var imageRepo = new function () {
    this.background = new Image();

    this.background.src = "img/bg.png";
}
var background;

function Drawable() {
    this.init = function (x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    this.changePosition = function (x, y) {
        if (x != null)
            this.x = x;
        if (y != null)
            this.y = y;
    }

    this.changeSpeed = function (speedX, speedY) {
        if (speedX != null)
            this.speedX = speedX;
        if (speedY != null)
            this.speedY = speedY;
    }

    this.draw = function () {};

    this.isCollision = function () {};
}

function Background() {
    this.draw = function () {
        var oldX = this.x;
        var oldY = this.y;

        this.x = this.x + (-1 * this.speedX);
        this.y = this.y + (-1 * this.speedY);

        // right
        context.drawImage(imageRepo.background, this.x + canvasWidth, this.y);

        // mid
        context.drawImage(imageRepo.background, this.x, this.y);

        // top
        context.drawImage(imageRepo.background, this.x, this.y - canvasHeight);

        // top right
        context.drawImage(imageRepo.background, this.x + canvasWidth, this.y - canvasHeight);

        // bottom
        context.drawImage(imageRepo.background, this.x, this.y + canvasHeight);

        // bottom right
        context.drawImage(imageRepo.background, this.x + canvasWidth, this.y + canvasHeight);

        // left
        context.drawImage(imageRepo.background, this.x - canvasWidth, this.y);

        // bottom left
        context.drawImage(imageRepo.background, this.x - canvasWidth, this.y + canvasHeight);

        if (this.x + canvasWidth <= 0) {
            this.x = 0
        }

        if ((this.y - canvasHeight >= 0) || (this.y <= 0 - canvasHeight)) {
            this.y = 0;
        }
    }
}
Background.prototype = new Drawable();

function PlayingDisc() {
    this.init = function (x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    this.draw = function () {
        if (!isDraged) {
            this.x = this.x + this.speedX;
            this.y = this.y + this.speedY;
        }

        // left
        if (this.x < (0 + this.radius)) {
            this.changePosition(this.radius, null);
        }

        // right
        if (this.x > (canvasWidth - this.radius)) {
            this.changePosition((canvasWidth - this.radius), null);
        }

        // top
        if (this.y < (0 + this.radius)) {
            this.changePosition(null, this.radius);
        }

        // bottom
        if (this.y > (canvasHeight - this.radius)) {
            this.changePosition(null, canvasHeight - this.radius);
        }

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }

    this.isCollision = function (posX, posY) {
        if (posX === null) {
            posX = this.x;
        }

        if (posY === null) {
            posY = this.y;
        }

        if (posX <= (this.x + this.radius) && posX >= (this.x - this.radius) && posY <= (this.y + this.radius) && posY >= (this.y - this.radius)) {
            return true;
        }
        return false;
    }
}
PlayingDisc.prototype = new Drawable();

function PowerUp() {
    this.draw = function () {
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;

        context.beginPath();
        context.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
    }
}
PowerUp.prototype = new Drawable();

init();

function init() {
    var canvasElement = document.getElementById('gameStage');
    context = canvasElement.getContext('2d');

    canvasWidth = parseInt(canvasElement.width);
    canvasHeight = parseInt(canvasElement.height);

    background = new Background();
    background.init(0, 0, 0, 0);

    playingDisc = new PlayingDisc();
    playingDisc.init(50, 50, 10, 'red', 0, 0);
    actualHeight = canvasHeight - 50 - playingDisc.radius;

    document.addEventListener("keydown", keyDownListener, false);
    canvasElement.addEventListener("mousemove", mouseMoveListener, false);
    canvasElement.addEventListener("mousedown", mouseDownListener, false);
    canvasElement.addEventListener("mouseup", mouseUpListener, false);
    canvasElement.addEventListener("mosueout", mouseOutListener, false);

    loop();
};

function handleMovement() {
    // standard speedreduction
    speedX = speedX * 998 / 1000;
    speedY = speedY + gravity;

    playingDisc.changeSpeed(speedX, speedY);
    background.changeSpeed(0, 0);

    if (!isThrown) {
        return;
    }

    if (playingDisc.y >= (canvasHeight - playingDisc.radius)) {
        if (speedY > 2) {
            speedY = speedY * -50 / 100;
        } else {
            speedY = 0;
        }

        if (speedX > 2) {
            speedX = speedX * 90 / 100;
        } else {
            speedX = 0;
        }
        playingDisc.changeSpeed(speedX, speedY);
    }

    // top space scrolllock
    if (actualHeight >= (canvasHeight * 70 / 100)) {
        playingDisc.changePosition(null, (canvasHeight * 30 / 100));
        playingDisc.changeSpeed(null, 0);
        background.changeSpeed(null, speedY);
    }

    // right space scrolllock
    if (playingDisc.x >= (canvasWidth * 70 / 100)) {
        playingDisc.changePosition((canvasWidth * 70 / 100), null);
        playingDisc.changeSpeed(0, null);
        background.changeSpeed(speedX, null);
    }

    // Score and Distance
    if (speedX > 0) {
        distance = distance + speedX;
    }

    var newActualHeight = actualHeight + Math.round(-1 * speedY);
    if (newActualHeight < 0) {
        newActualHeight = 0;
    }
    actualHeight = newActualHeight;

    if (actualHeight == 0 && speedX == 0 && speedY == 0) {
        if (distance > highScore) {
            highScore = distance;
            document.getElementById('highScore').innerHTML = highScore.toFixed(1);
        }

        if (playingDisc.x > (canvasWidth / 2)) {
            playingDisc.changeSpeed(-8, null);
        } else {
            isThrown = false;
            playingDisc.changeSpeed(0, null);
        }
    }
}

function handlePowerUps() {
    if (powerUps.length < 4) {
        if (Math.floor((Math.random() * 1000) < 2)) {
            var powerUp = new PowerUp();
            powerUp.init(canvasWidth, Math.floor((Math.random() * 400)), -3, 0);
            powerUps.push(powerUp);
        }
    }

    for (var each of powerUps) {
        if (each.x <= 0) {
            var index = powerUps.indexOf(each);
            powerUps.splice(index, 1);
        }
    }
}

function loop() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    handleMovement();
    background.draw();
    playingDisc.draw();

    handlePowerUps();
    for (var each of powerUps) {
        each.draw();
    }

    document.getElementById('height').innerHTML = actualHeight.toFixed(1);
    document.getElementById('score').innerHTML = distance.toFixed(1);

    window.setTimeout(loop, 1000 / frameRate)
};

function mouseMoveListener(e) {
    var mouseTimeStamp = new Date().getTime();
    var mousePosX = e.pageX - document.getElementById('gameStage').offsetLeft;
    var mousePosY = e.pageY - document.getElementById('gameStage').offsetTop;

    if (isDraged) {
        if (mouseOldPosX != null && mouseOldPosY != null) {
            var diffTimeStamp = mouseTimeStamp - mouseOldTimeStamp;
            var diffPosX = mousePosX - mouseOldPosX;
            var diffPosY = mousePosY - mouseOldPosY;

            mouseAccSpeedX = (diffPosX / diffTimeStamp) * 1000 / frameRate;
            mouseAccSpeedY = (diffPosY / diffTimeStamp) * 1000 / frameRate;
        }

        mouseOldTimeStamp = mouseTimeStamp;
        mouseOldPosX = mousePosX;
        mouseOldPosY = mousePosY;

        playingDisc.changePosition(mousePosX, mousePosY);
    }
};

function keyDownListener(event) {};

function mouseDownListener(event) {
    if (isThrown) {
        return;
    }

    checkDiscClick(event);
};

function checkDiscClick(event) {
    if (playingDisc.isCollision(event.pageX - document.getElementById('gameStage').offsetLeft, event.pageY - document.getElementById('gameStage').offsetTop)) {
        isDraged = true;
    } else {
        isDraged = false;
    }
}

function mouseUpListener(event) {
    if (isThrown) {
        return;
    }

    if (isDraged) {
        speedX = mouseAccSpeedX;
        speedY = mouseAccSpeedY;
        isThrown = true;

        distance = 0;
        actualHeight = canvasHeight - (event.pageY - document.getElementById('gameStage').offsetTop) - playingDisc.radius;
        if (actualHeight < 0) {
            actualHeight = 0;
        }

        if (actualHeight > canvasHeight) {
            actualHeight = canvasHeight;
        }
    }
    isDraged = false;
};

function mouseOutListener(event) {
    isDraged = false;
};