var canvas = null;
var context = null;

var mouseXPos, mouseYPos = 0;
var mouseXPosFirst = 0, mouseYPosFirst = 0, mouseXPosSecond = 0, mouseYPosSecond = 0;
var mapSprite = new Image();
var obj = {};

var Marker = function () {
    this.Sprite = new Image();
    this.Sprite.src = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"
    this.Width = 12;
    this.Height = 20;
    this.XPos = 0;
    this.YPos = 0;
}

var monitorTochange = 0;

var Markers = new Array();


var mouseClicked = function (mouse) {
    // Get corrent mouse coords
    var rect = canvas.getBoundingClientRect();
    mouseXPos = (mouse.x - rect.left);
    mouseYPos = (mouse.y - rect.top);

    console.log("Marker added. X: " + mouseXPos + " Y: " + mouseYPos);

    // Move the marker when placed to a better location
    var marker = new Marker();
    marker.XPos = mouseXPos - (marker.Width / 2);
    marker.YPos = mouseYPos - marker.Height;
    Markers.push(marker);
}


var main = function () {
    draw();
    if (mouseXPosFirst != 0 && mouseYPosFirst != 0 && mouseXPosSecond != 0 && mouseYPosSecond) {
        drawLine(mouseXPosFirst, mouseYPosFirst, mouseXPosSecond, mouseYPosSecond);
        // console.warn("monitorTochange", monitorTochange);
        // saveCoordinates(monitorTochange, mouseXPosFirst, mouseYPosFirst, mouseXPosSecond, mouseYPosSecond);
        // clearPositionsData();
    }
    // console.log("drawLineBtn: " + mouseXPosFirst + "," + mouseYPosFirst + "," + mouseXPosSecond + "," + mouseYPosSecond);
};

var draw = function () {
    // Clear Canvas
    // context.fillStyle = "#000";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map
    // Sprite, X location, Y location, Image width, Image height
    // You can leave the image height and width off, if you do it will draw the image at default size
    // context.drawImage(mapSprite, 0, 0, canvas.width, canvas.height);

    // Draw markers
    for (var i = 0; i < 2; i++) {
        var tempMarker = Markers[i];
        // Draw marker
        context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

        // Calculate postion text
        var markerText = "(X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos;

        // Draw a simple box so you can see the position
        var textMeasurements = context.measureText(markerText);
        context.fillStyle = "#666";
        context.globalAlpha = 0.7;
        context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
        context.globalAlpha = 1;

        // Draw position above
        context.fillStyle = "#000";
        context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);

        if (i == 0) {
            mouseXPosFirst = tempMarker.XPos + 5;
            mouseYPosFirst = tempMarker.YPos + 20;
        } else if (i == 1) {
            mouseXPosSecond = tempMarker.XPos + 5;
            mouseYPosSecond = tempMarker.YPos + 20;
        }

    }

};

function drawLine(mouseXPosFirst, mouseYPosFirst, mouseXPosSecond, mouseYPosSecond) {
    context.beginPath();
    context.strokeStyle = 'green';
    context.lineWidth = 7;
    context.moveTo(mouseXPosFirst, mouseYPosFirst);
    context.lineTo(mouseXPosSecond, mouseYPosSecond);
    context.stroke();
    // console.log("drawn");
}



function setPositions(roomId, monitorId) {

    canvas = document.getElementById("canvas-image-by-roomId-" + roomId);
    // canvas = document.getElementById("canvas-image-parentDiv").getElementsByTagName("canvas")[0];
    context = canvas.getContext("2d");
    mapSprite.src = crudImage.getImageUrl(roomId);
    clearPositionsData();
    canvas.addEventListener("mousedown", mouseClicked, false);
    setInterval(main, 500);
    monitorTochange = monitorId;
    console.log('canvasToEdit', canvas);
}

function saveCoordinates(monitorId, x1, y1, x2, y2) {
    var obj = {
        "x1": Number(Math.round(x1)),
        "x2": Number(Math.round(x2)),
        "y1": Number(Math.round(y1)),
        "y2": Number(Math.round(y2)),
        "monitorId": Number(monitorId),
        "monitor": null
    };
    console.log("object prepared to request:", obj);
    return obj;

}

function clearPositionsData() {
    Markers = new Array();
    mouseXPosFirst = 0, mouseYPosFirst = 0, mouseXPosSecond = 0, mouseYPosSecond = 0;
    monitorTochange = 0;
}