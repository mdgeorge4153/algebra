define(["numbers/mat2", "geometry"],
function(Mat2,           Geom) {
return function Controller(model, view, cos, sin) {

/** selection is either null (in which case we are not dragging) or it is a
    collection of vectors relative to the mouse defining the
    currently-being-dragged tan. The tan is given by model.hover.  */
var selection = null;
var F = model.F;
var V = model.V;
var M = Mat2(F);
var G = Geom(V);

if (cos === undefined || sin === undefined) {
  cos = F.zero;
  sin = F.one;
}

var rotCCW = M.rotation(cos, sin);
var rotCW  = M.rotation(cos, F.neg(sin));

var oldPos = V.zero;

function onMouseMove(e) {
  var pos = view.getEventCoords(e);

  // we filter out motions that don't change the position so that
  // using the scroll wheel works more smoothly.
  if (V.equals(pos, oldPos))
    return;
  oldPos = pos;

  if (selection === null) {
    model.hover = -1;

    for (var i = 0; i < model.tans.length; i++)
      if (model.tans[i].contains(pos))
        model.hover = i;
  } else {
    /* TODO: find closest non-intersecting point */
    model.tans[model.hover].coords = selection.map(V.plus.bind(V, pos));
  }
}

function onMouseOut(e) {
  model.hover = -1;
  selection   = null;
}

function onMouseDown(e) {
  var pos = view.getEventCoords(e);

  if (model.hover !== -1) {
    selection = model.tans[model.hover].coords.map(function (coord) {
      return V.minus(coord, pos);
    });
  }
}

function onMouseUp(e) {
  selection = null;
}

function onWheel(e) {
  if (model.hover === -1)
    return;

  var tan     = model.tans[model.hover].coords;
  var center  = V.sdiv(tan.reduce(V.plus.bind(V)), F.fromInt(tan.length));

  var coords = tan.map(V.plus.bind(V, V.neg(center)));

  var pos    = view.getEventCoords(e);
  var dir    = V.fromPair([e.deltaX, e.deltaY]);

  var rot    = G.cmpSlopeFrom(center)(pos, V.plus(pos, dir));

  if (rot === 1)
    coords = coords.map(M.transform.bind(M, rotCW));
  else if (rot === -1)
    coords = coords.map(M.transform.bind(M, rotCCW));

  model.tans[model.hover].coords = coords.map(V.plus.bind(V, center));
}


view.canvas.addEventListener("mousemove",  onMouseMove);
view.canvas.addEventListener("mouseenter", onMouseMove);
view.canvas.addEventListener("mouseout",   onMouseOut);
view.canvas.addEventListener("mousedown",  onMouseDown);
view.canvas.addEventListener("mouseup",    onMouseUp);
view.canvas.addEventListener("wheel",      onWheel);

};

});
