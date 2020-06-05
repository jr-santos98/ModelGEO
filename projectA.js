// canvas related vars
var c = document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var cw=c.width;
var ch=c.height;

// used to calc canvas position relative to window
function reOffset(){
    var BB=c.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }
c.onresize=function(e){ reOffset(); }

// save relevant information about shapes drawn on the canvas
var shapes=[];
// define one triangle and save it in the shapes[] array
shapes.push( {x:40, y:200, line:50} );
shapes.push( {x:110, y:200, line:50} );
shapes.push( {x:190, y:200, line:50} );
shapes.push( {x:260, y:200, line:50} );

// drag related vars
var isDragging=false;
var startX,startY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;

// draw the shapes on the canvas
drawAll();

// listen for mouse events
c.onmousedown=handleMouseDown;
c.onmousemove=handleMouseMove;
c.onmouseup=handleMouseUp;
c.onmouseout=handleMouseOut;

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx,my,shape){
    if(shape.line){
        // this is a rectangle
        var rLeft=shape.x;
        var rBott=shape.y+shape.line;
        var rMouse=mx-my;
        var rT=shape.x-shape.y;
        // math test to see if mouse is inside rectangle
        if( mx>rLeft && my<rBott && rMouse<rT){
            return(true);
        }
    }
    // the mouse isn't in any of the shapes
    return(false);
}

function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for(var i=0;i<shapes.length;i++){
        if(isMouseInShape(startX,startY,shapes[i])){
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex=i;
            // set the isDragging flag
            isDragging=true;
            // and return (==stop looking for
            //     further shapes under the mouse)
            return;
        }
    }
}

function handleMouseUp(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}

function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}

function handleMouseMove(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    var dx=mouseX-startX;
    var dy=mouseY-startY;
    // move the selected shape by the drag distance
    var selectedShape=shapes[selectedShapeIndex];
    selectedShape.x+=dx;
    selectedShape.y+=dy;
    // clear the canvas and redraw all shapes
    drawAll();
    // update the starting drag position (== the current mouse position)
    startX=mouseX;
    startY=mouseY;
}

// clear the canvas and
// redraw all shapes in their current positions
function drawAll(){
    ctx.clearRect(0,0,cw,ch);
    var color = 'red';
    for(var i=0;i<shapes.length;i++){
        var shape=shapes[i];
        if(shape.line){
            // it's a triangle
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x, shape.y + shape.line);
            ctx.lineTo(shape.x + shape.line, shape.y + shape.line);
            ctx.fillStyle=color;
            ctx.fill();
        }
    }
}

function draw() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.rect(135, 105, 240, 140);
  ctx.fillStyle = "blue";
  ctx.fill();
}

function mouseMove(e) {
    var x = e.clientX - 8;
    var y = e.clientY - 80;
    var coord = "Mouse: (" + x + "," + y + ")";
    document.getElementById("coord").innerHTML = coord;
};//End Function

function mouseOut() {
    document.getElementById("coord").innerHTML = "";
};//End Function
