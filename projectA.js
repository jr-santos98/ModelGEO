function draw() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.rect(135, 105, 240, 140);
  ctx.fillStyle = "blue";
  ctx.fill();
}

draw();
