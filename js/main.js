var context;

var canvasHeight;
var canvasWidth;

var frameRate = 60;

var gravity = 8 / 1000 * frameRate;

var speedX;
var speedY;

var isDiscClicked = false;

var height = 0;
var maxHeight = 0;

var distance = 0;
var highScore = 0;

var mouseOldPosX;
var mouseOldPosY;

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
        this.x = this.x + (-1 * this.speedX);
        this.y = this.y + (-1 * this.speedY);
        
        // mid
        context.drawImage(imageRepo.background, this.x, this.y);
        
        // right
        context.drawImage(imageRepo.background, this.x + canvasWidth, this.y);
        
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
            speedX = speedX * 99 / 100;
            speedY = speedY + gravity;
                
            this.changeSpeed(speedX, speedY);
                
            // left
            if (speedX < 0) {
                // left ege
                if (this.x - this.radius <= 0) {
                    speedX = 0;
                    this.changePosition(this.radius, null);
                    this.changeSpeed(speedX, null);
                }   
            }
            
            // right
            if (speedX > 0) {
                // right edge
                if (this.x + this.radius >= canvasWidth) {
                    this.changePosition(canvasWidth - this.radius, null);
                
                    this.changeSpeed(0 , null);
                    background.changeSpeed(speedX, null);        
                } 
            }
            
            // up
            if (speedY < 0) {
                // opper edge
                if (this.y - this.radius <= 0) {
                    this.changePosition(null, this.radius);
                
                    this.changeSpeed(null, 0);
                    background.changeSpeed(null, speedY);
                } 
            }
            
            // down
            if (speedY > 0) {                
                 background.changeSpeed(null, speedY);
                
                // bottom edge
                if (this.y + this.radius >= canvasHeight) {   
                    
                    this.changePosition(null, canvasHeight - this.radius);
                    this.changeSpeed(null, 0);
                    
                    if (speedY >= 2) {
                        speedY = speedY * -50 / 100;
                        this.changeSpeed(null, speedY);
                        
                        speedX = speedX * 80 / 100;
                        if (this.x + this.radius >= canvasWidth) {
                            background.changeSpeed(speedX, null);
                        } else {
                            this.changeSpeed(speedX, null);
                        }
                    } else {
                        if (this.x > (canvasWidth / 2)) {
                            speedX = -8;
                            speedY = 0;
                            this.changeSpeed(speedX,speedY);
                            background.changeSpeed(speedX,speedY);
                        } else {
                            speedX = 0;
                            speedY = 0;
                            this.changeSpeed(0,0);
                            background.changeSpeed(0,0);
                    
                            if (distance > highScore) {
                                highScore = distance;
                                document.getElementById('highScore').innerHTML = highScore.toFixed(2);
                                document.getElementById('maxHeight').innerHTML = maxHeight;
                            }
                        }
                    } 
                }
            }
            
            
            distance = distance + speedX / 100;
            
            height = height + (-1 * speedY);
            if (height > maxHeight) {
                maxHeight = height;   
            }
            
            document.getElementById('height').innerHTML = height;
            document.getElementById('score').innerHTML = distance.toFixed(2); 
            
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

            speedX = (diffPosX / diffTimeStamp) * 1000 / frameRate;
            speedY = (diffPosY / diffTimeStamp) * 1000 / frameRate;
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
    height = 0;
    maxHeight = 0;
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
    speedX = 0;
    speedY = 0;
}

function mouseUpListener(event)
{
    if (isDiscClicked) {
        playingDisc.changeSpeed(speedX, speedY);
        isDiscClicked = false;
    }
};

function mouseOutListener(event)
{
    isDiscClicked = false;
};