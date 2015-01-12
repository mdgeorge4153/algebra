define(function() {

function View (model, canvas) {

  this.F = model.F;
  this.V = model.V;

  this.model   = model;
  this.canvas  = canvas;
  this.context = canvas.getContext("2d");

  this.mousePos = null;
  this.wheel    = null;

  this.scale    = this.F.one;
  this.offset   = this.V.zero;

  var t = this;
  window.requestAnimationFrame(function paint(time) {
    t.repaint(time);
    window.requestAnimationFrame(paint);
  });

  canvas.addEventListener("mousemove",  mousemove.bind(this));
  canvas.addEventListener("mouseenter", mousemove.bind(this));
  canvas.addEventListener("mouseout",   mouseout.bind(this));

  canvas.addEventListener("wheel",      mousewheel.bind(this));
}

/******************************************************************************/

View.prototype.repaint = function repaint(time) {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawMouse();
};

View.prototype.drawPoly = function drawPoly(coords) {
  this.context.beginPath();
  for (var i = 0; i < coords.length; i++) {
    var pt = this.fromVec(coords[i]);
    this.context.lineTo(pt[0], pt[1]);
  }
  this.context.closePath();
};

View.prototype.drawRegion = function drawRegion(region) {
  this.context.beginPath();
  for (var i = 0; i < region.length; i++) {
    var v   = region[i];
    var pos = this.fromVec(v.pos);
  
    if (v.isolated)
      this.context.arc(pos[0], pos[1], 2, 0, 2*Math.PI);
    else for (var j = 0; j < v.edges.length; j++) {
      var e   = v.edges[j];
      var dst = this.fromVec(region[e.dst].pos);
      this.context.moveTo(pos[0], pos[1]);
      this.context.lineTo(dst[0], dst[1]);
    }
  }
};

View.prototype.drawMouse = function drawMouse() {
  with (this) {
    /* Draws the mouse for debugging purposes. */
    if (mousePos !== null) {
      context.beginPath();
      var pos = fromVec(mousePos);
      context.arc(pos[0], pos[1], 5, 0, 2*Math.PI);

      if (wheel !== null) {
        var wPos = fromVec(V.plus(mousePos, wheel));
        context.moveTo(pos[0], pos[1]);
        context.lineTo(wPos[0], wPos[1]);
      }

      context.stroke();

      context.fillText("(" + mousePos.x.toFixed(2) +
                       "," + mousePos.y.toFixed(2) +
                       ")",
                       pos[0] + 20, pos[1] + 20)
    }
  }
};

/******************************************************************************/

function mousemove(e) {
  this.mousePos = this.getEventCoords(e);
}

function mouseout(e) {
  this.mousePos = null;
  this.wheel    = null;
}

function mousewheel(e) {
  this.wheel = this.V.smult(this.scale, this.V.fromPair([e.deltaX, e.deltaY]));
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

    scale  = F.div(F.fromInt(6), F.fromInt(Math.min(w, h)));
    offset = V.sdiv(new V.Vector(w, h), F.fromInt(2));
  }
};

View.prototype.getEventCoords = function getEventCoords(e) {
  var rect = this.canvas.getBoundingClientRect();
  // var bord = {x: 
  return this.toVec(e.clientX - rect.left, e.clientY - rect.top);
};

/******************************************************************************/

return View;

});
