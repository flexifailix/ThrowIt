var context;

var canvasHeight;
var canvasWidth;

var isPlaying = false;

var isDiscClicked = false;

var posX = 50;
var posY = 50;

var mouseOldPosX;
var mouseOldPosY;

var mouseAccelerationX;
var mouseAccelerationY;

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
    
    context.fillStyle = 'red';
    context.fillRect(posX, posY, 50, 50);
    
    window.setTimeout(loop, 1000/60);
};

function mouseMoveListener(e)
{
    var mouseNewTimeStamp = new Date().getTime();
    var x = e.pageX - document.getElementById('gameStage').offsetLeft;
    var y = e.pageY - document.getElementById('gameStage').offsetTop;
    document.getElementById('x').innerHTML = x;
    document.getElementById('y').innerHTML = y;
    
    if (isDiscClicked) {
        if (mouseOldPosX != null && mouseOldPosY != null) {
            var diffTimeStamp = mouseNewTimeStamp - mouseOldTimeStamp;
            var diffPosX = mouseOldPosX - x;
            var diffPosY = mouseOldPosY - y;

            mouseAccelerationX = diffPosX / diffTimeStamp;
            mouseAccelerationY = diffPosY / diffTimeStamp;
        }
        
        mouseOldTimeStamp = mouseNewTimeStamp;
        mouseOldPosX = posX = x;
        mouseOldPosY = posY = y;
    }
};

function keyDownListener(event)
{
    if (event.keyCode === 32) {
        if (isPlaying) {
            isPlaying = false
        } else {
            isPlaying = true;
            loop();
        }
    }
};

function mouseDownListener(event)
{
    console.log("mouseDown");
    mouseOldPosX = null;
    mouseOldPosY = null;
    mouseOldTimeStamp = null;
    isDiscClicked = true; 
};

function mouseUpListener(event)
{
    console.log("mouseUp");
    console.log("mouseAcc x:" + mouseAccelerationX + " y: " + mouseAccelerationY);
    isDiscClicked = false;
};

function mouseOutListener(event)
{
    console.log("mouseOut");
    isDiscClicked = false;
};