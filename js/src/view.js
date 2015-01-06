define(["lib/domReady!"],
function(doc) {
return function View (model) {

var F = model.F;
var V = model.V;

var canvas  = doc.getElementById("canvas");
var context = canvas.getContext("2d");

function repaint(time) {

  context.clearRect(0, 0, 200, 200);

  context.beginPath();
  context.moveTo(100, 100);
  context.lineTo(100 + 100 * Math.cos(time/1000), 100 + 100 * Math.sin(time/1000));
  context.stroke();

  window.requestAnimationFrame(repaint);
}

window.requestAnimationFrame(repaint);

};
});
