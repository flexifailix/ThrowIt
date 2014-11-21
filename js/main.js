var context;

var canvasHeight;
var canvasWidth;

var frameRate = 60;

var gravity = 8 / 1000 * frameRate;

var isDiscClicked = false;

var distance = 0;
var highScore = 0;

var imageRepo = new function() {
    this.background = new Image();
    
    this.background.src = "img/bg.png";
}
var background;

function Drawable() {    
    this.init = function(x,y,speedX,speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    
    this.changePosition = function(x,y) {
        if (x != null)
            this.x = x;
        if (y != null)
            this.y = y;
    }
    
    this.changeSpeed = function(speedX, speedY) {
        if (speedX != null)
            this.speedX = speedX;
        if (speedY != null)
            this.speedY = speedY;
    }
    
    this.draw = function() {
    };
    
    this.isCollision = function() {
    };
}

function Background() {    
    this.draw = function() {
        this.x -= this.speedX;
        context.drawImage(imageRepo.background, this.x, this.y);
        context.drawImage(imageRepo.background, this.x + canvasWidth, this.y)
        
        if (this.x + canvasWidth <= 0) {
            this.x = 0   
        }
    }
}
Background.prototype = new Drawable();

function PlayingDisc() {
    this.init = function(x,y,radius,color,speedX,speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    
    this.draw = function() {
        if (isDiscClicked) {
            background.changeSpeed(0,0);
            playingDisc.changeSpeed(0,0);
        } else {
            if (this.isLanded()) {
                this.changePosition(null, canvasHeight - this.radius);
                
                if (this.speedY >= 1) {
                    this.changeSpeed(null, this.speedY * -50 / 100);
                    if (this.x + this.radius >= canvasWidth) {
                        background.changeSpeed(background.speedX * 80 / 100, null);
                    } else {
                        this.changeSpeed(this.speedX * 80 / 100,null);
                    }
                } else {
                    if (this.x > (canvasWidth / 2)) {
                        this.changeSpeed(-8,0);
                        background.changeSpeed(8,0);
                    } else {
                        this.changeSpeed(0,0);
                        background.changeSpeed(0,0);
                        
                        if (distance > highScore) {
                            highScore = distance;
                            document.getElementById('highScore').innerHTML = highScore.toFixed(2);
                        }
                    }
                }      
            } else {
                this.changeSpeed(this.speedX * 99 / 100, this.speedY + gravity);
                
                if (this.x + this.radius > canvasWidth) {
                    this.changePosition(canvasWidth - this.radius, null);
                    background.changeSpeed(this.speedX, null);
                    this.changeSpeed(0 , null);
                } else if (this.x - this.radius <= 0) {
                    this.changePosition(this.radius, null);
                    this.changeSpeed(0, null);
                }
                
                distance = distance + (this.speedX + background.speedX) / 100;
                document.getElementById('score').innerHTML = distance.toFixed(2); 
            } 
            
            this.x = this.x + Math.round(this.speedX);
            this.y = this.y + Math.round(this.speedY);       
        }
        
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill(); 
    }
    
    this.isCollision = function(posX, posY) {
        if (posX === null)
            posX = this.x;
        
        if (posY === null)
            posY = this.y;
        
        if (posX <= (this.x + this.radius) && posX >= (this.x - this.radius)
           && posY <= (this.y + this.radius) && posY >= (this.y - this.radius)) {
            return true;   
        }
        return false;
    }
    
    this.isLanded = function() {
        if (this.y + this.radius >= canvasHeight) {
            return true;
        } else {
            return false;   
        }
    }
}
PlayingDisc.prototype = new Drawable();

var mouseOldPosX;
var mouseOldPosY;

var mouseAccelerationX = 0;
var mouseAccelerationY = 0;

init();
function init()
{
    var canvasElement = document.getElementById('gameStage');
    context = canvasElement.getContext('2d');
    
    canvasWidth = parseInt(canvasElement.width);
    canvasHeight = parseInt(canvasElement.height);
    
    background = new Background();
    background.init(0,0,0,0);
    
    playingDisc = new PlayingDisc();
    playingDisc.init(20,20,12,'red',0,0);
    
    document.addEventListener("keydown", keyDownListener, false);
    canvasElement.addEventListener("mousemove", mouseMoveListener, false);
    canvasElement.addEventListener("mousedown", mouseDownListener, false);
    canvasElement.addEventListener("mouseup",mouseUpListener, false);
    canvasElement.addEventListener("mosueout", mouseOutListener, false);
    
    loop();
};

function loop()
{
    context.clearRect(0,0,canvasWidth,canvasHeight);
    
    background.draw();
    playingDisc.draw();
    
    window.setTimeout(loop, 1000 / frameRate)
};

function mouseMoveListener(e)
{
    var mouseTimeStamp = new Date().getTime();
    var mousePosX = e.pageX - document.getElementById('gameStage').offsetLeft;
    var mousePosY = e.pageY - document.getElementById('gameStage').offsetTop;
    
    if (isDiscClicked) {
        if (mouseOldPosX != null && mouseOldPosY != null) {
            var diffTimeStamp = mouseTimeStamp - mouseOldTimeStamp;
            var diffPosX = mousePosX - mouseOldPosX;
            var diffPosY = mousePosY - mouseOldPosY;

            mouseAccelerationX = (diffPosX / diffTimeStamp) * 1000 / frameRate;
            mouseAccelerationY = (diffPosY / diffTimeStamp) * 1000 / frameRate;
        }
        
        mouseOldTimeStamp = mouseTimeStamp;
        mouseOldPosX = mousePosX;
        mouseOldPosY = mousePosY;
        
        playingDisc.changePosition(mousePosX, mousePosY);
    }
};

function keyDownListener(event)
{
    if (event.keyCode === 32) {
        resetGame();
    }
};

function mouseDownListener(event)
{
    resetAccData();
    distance = 0;
    checkDiscClick(event);
};

function checkDiscClick(event)
{
    if (playingDisc.isCollision(event.pageX - document.getElementById('gameStage').offsetLeft, event.pageY - document.getElementById('gameStage').offsetTop)) {
        isDiscClicked = true;    
    } else {
        isDiscClicked = false;   
    }
}

function resetGame()
{
    resetAccData();
    
    background = new Background();
    background.init(0,0,0,0);
    
    playingDisc = new PlayingDisc();
    playingDisc.init(20,20,12,'red',0,0);
}

function resetAccData()
{
    mouseOldPosX = null;
    mouseOldPosY = null;
    mouseOldTimeStamp = null;
    mouseAccelerationX = 0;
    mouseAccelerationY = 0;
}

function mouseUpListener(event)
{
    if (isDiscClicked) {
        playingDisc.changeSpeed(mouseAccelerationX, mouseAccelerationY);
        isDiscClicked = false;
    }
    
};

function mouseOutListener(event)
{
    isDiscClicked = false;
};