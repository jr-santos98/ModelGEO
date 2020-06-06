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
shapes.push( {x:170, y:120, line:75, mirror:false} );
shapes.push( {x:170, y:120, line:75, mirror:true} );
shapes.push( {x:170, y:195, line:75, mirror:false} );
shapes.push( {x:170, y:195, line:75, mirror:true} );
shapes.push( {x:245, y:195, line:75, mirror:false} );
shapes.push( {x:245, y:195, line:75, mirror:true} );

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
c.ondblclick=handleMousedblclick;

function reset() {
  var ix = 170;
  var iy = 120;
  for(var i=0;i<shapes.length;i++){
      var shape=shapes[i];
      if(i == 2) {
        iy += 75;
        shape.x = ix;
        shape.y = iy;
      } else if (i == 4){
        ix += 75;
        shape.x = ix;
        shape.y = iy;
      } else {
        shape.x = ix;
        shape.y = iy;
      }
  }
  drawAll();
}

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx,my,shape){
    if(shape.mirror == false){
        // this is a rectangle
        var rLeft=shape.x;
        var rBott=shape.y+shape.line;
        var rMouse=mx-my;
        var rT=shape.x-shape.y;
        // math test to see if mouse is inside rectangle
        if( mx>rLeft && my<rBott && rMouse<rT){
            return(true);
        }
    } else if(shape.mirror == true){
        // this is a rectangle
        var rRight=shape.x+shape.line;
        var rTop=shape.y;
        var rMouse=mx-my;
        var rT=shape.x-shape.y;
        // math test to see if mouse is inside rectangle
        if( mx<rRight && my>rTop && rMouse>rT){
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

function handleMousedblclick(e) {
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
          if(shapes[i].mirror==false) {
            shapes[i].mirror=true;
          } else if(shapes[i].mirror==true) {
            shapes[i].mirror=false;
          }
          drawAll();
          return;
      }
  }
}

// clear the canvas and
// redraw all shapes in their current positions
function drawAll(){
    ctx.clearRect(0,0,cw,ch);
    var color = 'red';
    for(var i=0;i<shapes.length;i++){
        var shape=shapes[i];
        if(shape.mirror==false){
            // it's a triangle
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x, shape.y + shape.line);
            ctx.lineTo(shape.x + shape.line, shape.y + shape.line);
            ctx.fillStyle=color;
            ctx.fill();
        } else if(shape.mirror==true){
            // it's a triangle
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.line, shape.y);
            ctx.lineTo(shape.x + shape.line, shape.y + shape.line);
            ctx.fillStyle=color;
            ctx.fill();
        }
    }
}
