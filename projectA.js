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
