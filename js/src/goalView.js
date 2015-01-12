define(["view"],
function(View) {

function GoalView(model, canvas) {
  View.call(this, model, canvas);

  var V = model.V;
  var F = model.F;

  var leftArrow  = [[-15, 0], [-13, 4], [-14, 0], [-13, -4]]
  leftArrow = leftArrow.map(V.fromPair.bind(V));
  leftArrow = leftArrow.map(V.smult.bind(V, F.inv(F.fromInt(4))));

  var rightArrow = leftArrow.map(function (v) {
    return new V.Vector(F.neg(v.x), v.y);
  });

  this.leftArrow  = leftArrow;
  this.rightArrow = rightArrow;
}

GoalView.prototype             = Object.create(View.prototype);
GoalView.prototype.constructor = GoalView;

GoalView.prototype.repaint = function repaint(time) {
  with(this) {
    context.save();

    /* clear */
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    /* border */
    context.strokeStyle = "black";
    context.beginPath();
    context.rect(0,0,canvas.width, canvas.height);
    context.stroke();

    /* goal */

    if (model.goal !== null) {
      this.drawPoly(model.goal);
      context.fillStyle = "blue";
      context.fill();
    }

    /* left and right arrows */
    var  leftHover = false;
    var rightHover = false;

    if (mousePos === null)
      {} /* not hovering */
    else if (F.isNonNeg(mousePos.x))
      rightHover = true;
    else
      leftHover = true;

    this.drawPoly(this.leftArrow);
    if (leftHover)
      context.fillStyle   = "#404040";
    else
      context.fillStyle   = "#C0C0C0";
    context.fill();

    this.drawPoly(this.rightArrow);
    if (rightHover)
      context.fillStyle   = "#404040";
    else
      context.fillStyle   = "#C0C0C0";
    context.fill();

    context.restore();
    // this.drawMouse();
  };
}

GoalView.prototype.resize = function resize(t, l, w, h) {
  View.prototype.resize.call(this, t, l, w, h);

  // this.canvas.style.border = "8px solid black";
}

return GoalView;

});

