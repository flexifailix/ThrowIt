var context;

var canvasHeight;
var canvasWidth;

var frameRate = 60;

var gravity = 10 / 1000 * 60;

var isPlaying = false;

var isDiscClicked = false;

var playingDisc = {
    x:20,
    y:20,
    accX:0,
    accY:gravity,
    radius:12,
    
    isCollision : function(posX, posY) {
        if (posX === null)
            posX = this.x;
        
        if (posY === null)
            posY = this.y;
        
        console.log("checking disccollision");
        console.log("Object x: " + posX + " y: " + posY);
        console.log("Disc x: " + this.x + " y: " + this.y);
        
        if (posX <= (this.x + this.radius) && posX >= (this.x - this.radius)
           && posY <= (this.y + this.radius) && posY >= (this.y - this.radius)) {
            return true;   
        }
        return false;
    },
    
    resetAcc : function() {
        this.accX = 0;
        this.accY = gravity;
    },
    
    resetPosition : function() {
        this.x = 20;
        this.y = 20;
    }
}

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
    
    document.addEventListener("keydown", keyDownListener, false);
    canvasElement.addEventListener("mousemove", mouseMoveListener, false);
    canvasElement.addEventListener("mousedown", mouseDownListener, false);
    canvasElement.addEventListener("mouseup",mouseUpListener, false);
    canvasElement.addEventListener("mosueout", mouseOutListener, false);
};

function loop()
{
    if (!isPlaying) {
        return;
    }
    context.clearRect(0,0,canvasWidth,canvasHeight);
    
    if (!isDiscClicked) {
        playingDisc.accY = playingDisc.accY + Math.round(gravity);
                
        playingDisc.x = playingDisc.x + playingDisc.accX;
        playingDisc.y = playingDisc.y + playingDisc.accY;
    }
    
    if (playingDisc.y + playingDisc.radius > canvasHeight) {
        playingDisc.y = canvasHeight - playingDisc.radius;
        playingDisc.resetAcc();
    }
    
    if (playingDisc.x - playingDisc.radius < 0) {
        playingDisc.x = 0 + playingDisc.radius;
        playingDisc.accX = 0;
    }
    
    if (playingDisc.x + playingDisc.radius > canvasWidth) {
        playingDisc.x = canvasWidth - playingDisc.radius;
        playingDisc.accX = 0;
    }
    
    
    context.beginPath();
    context.arc(playingDisc.x, playingDisc.y, playingDisc.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();  
        
    window.setTimeout(loop, 1000 / frameRate);
};

function mouseMoveListener(e)
{
    var mouseTimeStamp = new Date().getTime();
    var mousePosX = e.pageX - document.getElementById('gameStage').offsetLeft;
    var mousePosY = e.pageY - document.getElementById('gameStage').offsetTop;
    document.getElementById('x').innerHTML = mousePosX;
    document.getElementById('y').innerHTML = mousePosY;
    
    if (isDiscClicked) {
        if (mouseOldPosX != null && mouseOldPosY != null) {
            var diffTimeStamp = mouseTimeStamp - mouseOldTimeStamp;
            var diffPosX = mousePosX - mouseOldPosX;
            var diffPosY = mousePosY - mouseOldPosY;

            mouseAccelerationX = Math.round((diffPosX / diffTimeStamp) * 1000 / frameRate);
            mouseAccelerationY = Math.round((diffPosY / diffTimeStamp) * 1000 / frameRate);
        }
        
        mouseOldTimeStamp = mouseTimeStamp;
        mouseOldPosX = playingDisc.x = mousePosX;
        mouseOldPosY = playingDisc.y = mousePosY;
    }
};

function keyDownListener(event)
{
    if (event.keyCode === 32) {
        if (isPlaying) {
            isPlaying = false
        } else {
            isPlaying = true;
            resetGame();
            loop();
        }
    }
};

function mouseDownListener(event)
{
    resetAccData();
    checkDiscClick(event);
};

function checkDiscClick(event)
{
    if (playingDisc.isCollision(event.pageX - document.getElementById('gameStage').offsetLeft, event.pageY - document.getElementById('gameStage').offsetTop)) {
        console.log("disc clicked");
        isDiscClicked = true;    
    } else {
        isDiscClicked = false;   
    }
}

function resetGame()
{
    resetAccData();   
    playingDisc.resetPosition();
}

function resetAccData()
{
    mouseOldPosX = null;
    mouseOldPosY = null;
    mouseOldTimeStamp = null;
    mouseAccelerationX = 0;
    mouseAccelerationY = 0;
    
    playingDisc.resetAcc();
}

function mouseUpListener(event)
{
    if (isDiscClicked) {
        console.log("mouseacc x: " + mouseAccelerationX + " y: " + mouseAccelerationY);
        playingDisc.accX = playingDisc.accX + mouseAccelerationX;
        playingDisc.accY = playingDisc.accY + mouseAccelerationY;
        isDiscClicked = false;
    }
    
};

function mouseOutListener(event)
{
    isDiscClicked = false;
};