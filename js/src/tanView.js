define(["view"],
function(View) {

function TanView (model, canvas) {
  View.call(this, model, canvas);
}

TanView.prototype             = Object.create(View.prototype);
TanView.prototype.constructor = TanView;

TanView.prototype.repaint = function repaint(time) {
  with(this) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    for (var i in model.tans) {
      context.beginPath();

      if (i === model.hover)
        context.fillStyle = "#8080FF";
      else
        context.fillStyle = "blue";
      context.strokeStyle = "black";
      context.lineWidth   = 1;
  
      for (var j in model.tans[i].coords) {
        var pt = this.fromVec(model.tans[i].coords[j]);
        context.lineTo(pt[0], pt[1]);
      }
      context.closePath();
      context.fill();
      context.stroke();

    }
    context.restore();
  }
};

return TanView;

});

