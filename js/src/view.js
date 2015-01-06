define(function() {

function View (model, canvas) {

  this.F = model.F;
  this.V = model.V;

  this.model   = model;
  this.canvas  = canvas;
  this.context = canvas.getContext("2d");

  this.mousePos = null;

  this.scale    = this.F.one;
  this.offset   = this.V.zero;

  window.requestAnimationFrame(repaint.bind(this));

  canvas.addEventListener("mousemove",  mousemove.bind(this));
  canvas.addEventListener("mouseenter", mousemove.bind(this));
  canvas.addEventListener("mouseout",   mouseout.bind(this));
}

/******************************************************************************/

function repaint(time) {
  with(this) {

    context.clearRect(0, 0, canvas.width, canvas.height);
  
    context.save();
    for (var i in model.tans) {
      context.beginPath();
  
      if (i === model.selection)
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
  
    if (mousePos !== null) {
      context.beginPath();
      var pos = fromVec(mousePos);
      context.arc(pos[0], pos[1], 5, 0, 2*Math.PI);
      context.stroke();
  
      context.fillText("(" + mousePos.x.toFixed(2) +
                       "," + mousePos.x.toFixed(2) +
                       ")",
  		     pos[0] + 20, pos[1] + 20)
    }
  
    window.requestAnimationFrame(repaint.bind(this));
  }
};

/******************************************************************************/

function mousemove(e) {
  this.mousePos = this.getEventCoords(e);
}

function mouseout(e) {
  this.mousePos = null;
}

/******************************************************************************/

View.prototype.toVec = function toVec (x,y) {
  with(this) {
    return V.smult(this.scale, V.minus(V.fromPair([x,y]), this.offset));
  }
};

View.prototype.fromVec = function fromVec (v) {
  with(this) {
    var trans = V.plus(this.offset, V.sdiv(v, this.scale));
    return V.toPair(trans);
  }
};

View.prototype.resize = function resize (t, l, w, h) {
  with(this) {
    canvas.width        = w;
    canvas.height       = h;
    canvas.style.top    = t + "px";
    canvas.style.left   = l + "px";
    canvas.style.border = "2px solid black";

    scale  = F.div(F.fromInt(6), F.fromInt(Math.min(w, h)));
    offset = V.sdiv(new V.Vector(w, h), F.fromInt(2));
  }
};

View.prototype.getEventCoords = function getEventCoords(e) {
  var rect = this.canvas.getBoundingClientRect();
  return this.toVec(e.clientX - rect.left - 2, e.clientY - rect.top - 2);
};

/******************************************************************************/

return View;

});
