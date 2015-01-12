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

    for (var i = 0; i < model.tans.length; i++) {
      if (i === model.hover)
        context.fillStyle = "#8080FF";
      else
        context.fillStyle = "blue";

      context.strokeStyle = "black";
      context.lineWidth   = 1;

      this.drawPoly(model.tans[i].coords);

      context.fill();
      context.stroke();
    }
    context.restore();

    // this.drawMouse();
  }
};

return TanView;

});

