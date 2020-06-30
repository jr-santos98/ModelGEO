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
//Adicionais
shapes.push( {x:10, y:10, line:75, mirror:false} );
shapes.push( {x:10, y:100, line:75, mirror:true} );
shapes.push( {x:10, y:115, line:75, mirror:false} );
shapes.push( {x:10, y:195, line:75, mirror:true} );
shapes.push( {x:10, y:210, line:75, mirror:false} );
shapes.push( {x:10, y:300, line:75, mirror:true} );

// drag related vars
var isDragging=false;
var startX,startY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;
//var numberElements=shapes.length;
var numberElements=6;

// draw the shapes on the canvas
drawAll();

// listen for mouse events
c.onmousedown=handleMouseDown;
c.onmousemove=handleMouseMove;
c.onmouseup=handleMouseUp;
c.onmouseout=handleMouseOut;
c.ondblclick=handleMousedblclick;

//Altera o número de elementos
function setNumberElements() {
  var d=document.getElementById("idSelect");
  numberElements = d.options[d.selectedIndex].text;
  if (numberElements == "Numero de figuras:") numberElements = 6;
  drawAll();
}

//Retorna a posição inicial
function reset() {
  var ix = 170;
  var iy = 120;
  var iyy = 10;
  for(var i=0;i<numberElements;i++){
      var shape=shapes[i];
      if (i == 2) {
        iy += 75;
        shape.x = ix;
        shape.y = iy;
      } else if (i == 4) {
        ix += 75;
        shape.x = ix;
        shape.y = iy;
      } else if (i <= 5) {
        shape.x = ix;
        shape.y = iy;
      } else {
        shape.x = 10;
        if (i % 2 == 1) {
          shape.y = iyy+90;
          iyy += 105;
        } else {
          shape.y = iyy;
        }
      }
  }
  numberElements = 6;
  var d=document.getElementById("idSelect");
  d.selectedIndex = 0;
  drawAll();
}

//Verifca se um objeto está a cima
function haveANeighborUp(i) {
  var n = selectedShapeIndex;
  var menorX = shapes[i].x - shapes[n].x > -10;
  var maiorX = shapes[i].x - shapes[n].x < 10;
  var menorY = shapes[i].y + 75 - shapes[n].y > -10;
  var maiorY = shapes[i].y + 75 - shapes[n].y < 10;
  if ( menorX && maiorX && menorY && maiorY ) return true;
  else return false;
}

//Verifca se um objeto está a direita
function haveANeighborRight(i) {
  var n = selectedShapeIndex;
  var menorX = shapes[i].x - 75 - shapes[n].x > -10;
  var maiorX = shapes[i].x - 75 - shapes[n].x < 10;
  var menorY = shapes[i].y - shapes[n].y > -10;
  var maiorY = shapes[i].y - shapes[n].y < 10;
  if ( menorX && maiorX && menorY && maiorY ) return true;
  else return false;
}

//Verifca se um objeto está em baixo
function haveANeighborDown(i) {
  var n = selectedShapeIndex;
  var menorX = shapes[i].x - shapes[n].x > -10;
  var maiorX = shapes[i].x - shapes[n].x < 10;
  var menorY = shapes[i].y - 75 - shapes[n].y > -10;
  var maiorY = shapes[i].y - 75 - shapes[n].y < 10;
  if ( menorX && maiorX && menorY && maiorY ) return true;
  else return false;
}

//Verifca se um objeto está a esquerda
function haveANeighborLeft(i) {
  var n = selectedShapeIndex;
  var menorX = shapes[i].x + 75 - shapes[n].x > -10;
  var maiorX = shapes[i].x + 75 - shapes[n].x < 10;
  var menorY = shapes[i].y - shapes[n].y > -10;
  var maiorY = shapes[i].y - shapes[n].y < 10;
  if ( menorX && maiorX && menorY && maiorY ) return true;
  else return false;
}

//Verifca se um objeto está dentro de outro
function haveANeighborInside(i) {
  var n = selectedShapeIndex;
  var menorX = shapes[i].x - shapes[n].x > -10;
  var maiorX = shapes[i].x - shapes[n].x < 10;
  var menorY = shapes[i].y - shapes[n].y > -10;
  var maiorY = shapes[i].y - shapes[n].y < 10;
  if ( menorX && maiorX && menorY && maiorY ) return true;
  else return false;
}

//Redefini as posições dos objetos quando estiverem proximos
function rearrange() {
  for(var i=0;i<numberElements;i++){
    if(i==selectedShapeIndex)   continue;
    if (haveANeighborUp(i)) {
      shapes[selectedShapeIndex].x = shapes[i].x;
      shapes[selectedShapeIndex].y = shapes[i].y+75;
      drawAll();
      return;
    } else if (haveANeighborRight(i)) {
      shapes[selectedShapeIndex].x = shapes[i].x-75;
      shapes[selectedShapeIndex].y = shapes[i].y;
      drawAll();
      return;
    } else if (haveANeighborDown(i)) {
      shapes[selectedShapeIndex].x = shapes[i].x;
      shapes[selectedShapeIndex].y = shapes[i].y-75;
      drawAll();
      return;
    } else if (haveANeighborLeft(i)) {
      shapes[selectedShapeIndex].x = shapes[i].x+75;
      shapes[selectedShapeIndex].y = shapes[i].y;
      drawAll();
      return;
    } else if (haveANeighborInside(i)) {
      shapes[selectedShapeIndex].x = shapes[i].x;
      shapes[selectedShapeIndex].y = shapes[i].y;
      drawAll();
      return;
    }
  }
}

//Verifica se o mouse está dentro de algum objeto
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

//Pressionar uma botão do mouse
function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for(var i=0;i<numberElements;i++){
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

//Soltar o botão do mouse
function handleMouseUp(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    rearrange();
    isDragging=false;
}

//Quando andar com um objeto além dos limites do quadro
function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}

//Quando o mouse de mover
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

//Quando der dois clicks
function handleMousedblclick(e) {
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();
  // calculate the current mouse position
  startX=parseInt(e.clientX-offsetX);
  startY=parseInt(e.clientY-offsetY);
  // test mouse position against all shapes
  // post result if mouse is in a shape
  for(var i=0;i<numberElements;i++){
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

// Limpa a tela e desenha de novo
function drawAll(){
    ctx.clearRect(0,0,cw,ch);
    var color = 'red';
    for(var i=0;i<numberElements;i++){
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
