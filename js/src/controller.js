define(["lib/domReady!", "numbers/mat2"],
function(doc,             Mat2) {
return function Controller(model, view, cos, sin) {

/** selection is either null (in which case we are not dragging) or it is a
    collection of vectors relative to the mouse defining the
    currently-being-dragged tan. The tan is given by model.hover.  */
var selection = null;
var F = model.F;
var V = model.V;
var M = Mat2(F);

if (cos === undefined || sin === undefined) {
  cos = F.zero;
  sin = F.one;
}

var rotation = M.rotation(cos, sin);

function onMouseMove(e) {
  var pos = view.getEventCoords(e);

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

  var tan    = model.tans[model.hover].coords;
  var center = V.sdiv(tan.reduce(V.plus.bind(V)), F.fromInt(tan.length));

  var pos    = view.getEventCoords(e);
}


view.canvas.addEventListener("mousemove",  onMouseMove);
view.canvas.addEventListener("mouseenter", onMouseMove);
view.canvas.addEventListener("mouseout",   onMouseOut);
view.canvas.addEventListener("mousedown",  onMouseDown);
view.canvas.addEventListener("mouseup",    onMouseUp);
view.canvas.addEventListener("wheel",      onWheel);

};

});
