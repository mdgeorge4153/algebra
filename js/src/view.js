define(["lib/domReady!"],
function(doc) {
return function View (model) {

var F = model.F;
var V = model.V;

var canvas  = doc.getElementById("canvas");
var context = canvas.getContext("2d");

function repaint(time) {

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.save();
  for (var i in model.tans) {
    context.beginPath();

    context.fillStyle = "blue";
    context.strokeStyle = "black";
    context.lineWidth   = 1;

    for (var j in model.tans[i].coords) {
      var pt = model.fromVec(model.tans[i].coords[j]);
      context.lineTo(pt.x, pt.y);
    }
    context.closePath();
    context.fill();
    context.stroke();

  }
  context.restore();

  if (model.mousePos !== null) {
    context.beginPath();
    var pos = model.fromVec(model.mousePos);
    context.arc(pos.x, pos.y, 5, 0, 2*Math.PI);
    context.stroke();

    context.fillText("(" + model.mousePos.x.toFixed(2) +
                     "," + model.mousePos.y.toFixed(2) +
                     ")",
		     pos.x + 10, pos.y)
  }

  window.requestAnimationFrame(repaint);
}

window.requestAnimationFrame(repaint);

};
});
