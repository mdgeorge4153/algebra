define(["lib/domReady!"],
function(doc) {
return function Controller(model) {

var canvas = doc.getElementById("canvas");

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  model.setSize(canvas.width, canvas.height);
}

window.addEventListener("resize", resize);
resize();

function mousemove(e) {
  var rect = canvas.getBoundingClientRect();
  model.mousePos = model.toVec(e.clientX - rect.left,
                               e.clientY - rect.top);
}

canvas.addEventListener("mousemove", mousemove);

function mouseout(e) {
  model.mousePos = null;
}
canvas.addEventListener("mouseout", mouseout);

}
});
