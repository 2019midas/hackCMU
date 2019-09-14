var dataLength = 300;
var data = new Array(dataLength);
//initialize prices to some vague model of real prices, starting at 200 & with no inflation
//initialize decisions (data[i][2]) to random numbers between 0 and 1
for (var i=0; i<dataLength; i++) {
    data[i] = new Array(3);
    data[i][0] = i;               //the time = the index, but it doesn't have to.
    if (i==0) {
        data[i][1] = 200;
    } else {
        data[i][1] = data[i-1][1] + Math.random() * 6 - 3;
    }
    data[i][2] = Math.random();
}

var margin = 20;
var mouseX, mouseY;

var frame = 0;
var fps = 60;

window.onload = function() {
	canvas = document.getElementById('graph');
	canvasContext = canvas.getContext('2d');
    setupInput();

	setInterval(function() {
		draw();
	}, 1000/fps);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function setupInput() {
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    }, false);
}

function draw() {
	// draw canvas
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(0,0, canvas.width,canvas.height);
    /*canvasContext.globalAlpha = 1;
	canvasContext.fillStyle = '#2e2c4f';
	canvasContext.fillRect(0,0, canvas.width,canvas.height);
    canvasContext.globalAlpha = 1.0;*/
    
    if(frame%30 == 0) updateData();

    canvasContext.globalAlpha = 0.85;
    canvasContext.lineWidth = 3;
	drawLine(margin,margin,margin,canvas.height - margin, "black");
    drawLine(margin,canvas.height - margin,canvas.width-margin,canvas.height-margin, "black");
    canvasContext.globalAlpha = 1;
    drawPlot();
    
    frame++;
    if(frame%fps == 0) frame=0;
}

function updateData() {
    data.push([data[data.length-1][0] + 1, data[data.length-1][1] + Math.random() * 6 - 3, Math.random()]);
    data.shift();
}

function drawPlot() {
    var plotMargin = 10;
    var largestPrice = 0;
    var smallestPrice = 1000000000;
    for(var i=0; i<data.length; i++) {
        if(data[i][1] > largestPrice) largestPrice = data[i][1];
        if(data[i][1] < smallestPrice) smallestPrice = data[i][1];
    }
    
    var priceRange = (largestPrice + plotMargin) - (smallestPrice - plotMargin);
    
    var smallestTime = data[0][0];
    var largestTime = data[data.length-1][0];
    var timeRange = largestTime - smallestTime;
    
    for(var i=1; i<data.length; i++) {
        var currentTime = data[i][0];
        var currentPrice = data[i][1];
        var x1 = (canvas.width - 2*margin) * (currentTime - smallestTime)/timeRange + margin;
        var y1 = canvas.height - 
            ((canvas.height - 2*margin) * (currentPrice - smallestPrice + plotMargin)/priceRange + margin);
        
        var lastTime = data[i-1][0];
        var lastPrice = data[i-1][1];
        var x2 = (canvas.width - 2*margin) * (lastTime - smallestTime)/timeRange + margin;
        var y2 = canvas.height - 
            ((canvas.height - 2*margin) * (lastPrice - smallestPrice + plotMargin)/priceRange + margin);
        
        if(data[i][2] >=0.5) {
            canvasContext.fillStyle = "white";
            //drawQuad(x2,y2, x1,y1, x1,canvas.height-margin,x2,canvas.height-margin);
            canvasContext.globalAlpha = (data[i][2] - 0.5);
            canvasContext.fillStyle = "green";
            drawQuad(x2,y2, x1,y1, x1,canvas.height-margin,x2,canvas.height-margin);
            canvasContext.globalAlpha = 1;
        } else {
            canvasContext.fillStyle = "white";
            //drawQuad(x2,y2, x1,y1, x1,canvas.height-margin,x2,canvas.height-margin);
            canvasContext.globalAlpha = data[i][2];
            canvasContext.fillStyle = "red";
            drawQuad(x2,y2, x1,y1, x1,canvas.height-margin,x2,canvas.height-margin);
            canvasContext.globalAlpha = 1;
        }
        
        canvasContext.globalAlpha = 0.85;
        canvasContext.lineWidth = 3;
        drawLine(x1,y1,x2,y2, "black");
        canvasContext.globalAlpha = 1;
        
        //give info at time
        if(mouseX > x2 && mouseX < x1) {
            //circle
            canvasContext.fillStyle = "black";
            canvasContext.beginPath();
            canvasContext.arc(x1,y1, 5, 0,Math.PI*2);
            canvasContext.fill();
            //line
            canvasContext.globalAlpha = 0.3;
            canvasContext.lineWidth = 2;
            drawLine(x1,margin,x1,canvas.height-margin, 'black');
            canvasContext.globalAlpha = 1;
        
            //draw info box
            drawInfo(currentTime,currentPrice);
        }
    }
}

function drawInfo(time,price) {
    var width = 100;
    var height = 50;
    var x = canvas.width - margin - width;
    var y = margin;
    canvasContext.fillStyle = "lightgray";
    canvasContext.beginPath();
    canvasContext.rect(x, y, width, height);
    canvasContext.fill();
    drawText("Price: $" + price.toFixed(2), x + 10, y + 20, "black");
    drawText("Time: " + time, x + 10, y + 36, "black");
}

function drawLine(startX,startY, endX,endY, color) {
	canvasContext.strokeStyle = color;
	canvasContext.beginPath();
	canvasContext.moveTo(startX,startY);
	canvasContext.lineTo(endX,endY);
	canvasContext.stroke();
}

function drawQuad(x1,y1, x2,y2, x3,y3, x4,y4) {
    canvasContext.beginPath();
    canvasContext.moveTo(x1,y1);
    canvasContext.lineTo(x2,y2);
    canvasContext.lineTo(x3,y3);
    canvasContext.lineTo(x4,y4);
    canvasContext.lineTo(x1,y1);
    canvasContext.fill();
}

function drawText(text, x,y, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillText(text, x,y);
}