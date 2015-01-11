define(["view"],
function(View) {

function GoalView(model, canvas) {
  View.call(this, model, canvas);
}

GoalView.prototype             = Object.create(View.prototype);
GoalView.prototype.constructor = GoalView;

GoalView.prototype.repaint = function repaint(time) {
  with(this) {
    var g = model.goal;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    for (var i = 0; i < g.length; i++) {
      var v   = g[i];
      var pos = this.fromVec(v.pos);

      if (v.isolated)
        context.arc(pos[0], pos[1], 3, 0, 2*Math.PI);
      else for (var j in v.edges) {
        var e   = v.edges[j];
        var dst = this.fromVec(g[e.dst].pos);
        context.moveTo(pos[0], pos[1]);
        context.lineTo(dst[0], dst[1]);
      }
    }

    context.stroke();

    var leftHover  = false;
    var rightHover = false;

    if (mousePos === null)
      {} /* not hovering */
    else if (F.isNonNeg(mousePos.x))
      rightHover = true;
    else
      leftHover = true;

    /* draw left and right arrows */
  };
}

GoalView.prototype.resize = function resize(t, l, w, h) {
  View.prototype.resize.call(this, t, l, w, h);

  this.canvas.style.border = "1px solid black";
}

return GoalView;

});

