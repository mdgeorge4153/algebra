define(["lib/domReady!"],
function(doc) {
return function Controller(model, view) {

/** selection is either null (in which case we are not dragging) or it is a
    collection of vectors relative to the mouse defining the
    currently-being-dragged tan. The tan is given by model.hover.  */
var selection = null;

var V = model.V;

function onMouseMove(e) {
  var pos = view.getEventCoords(e);

  if (selection === null) {
    model.hover = -1;

    for (var i in model.tans)
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

view.canvas.addEventListener("mousemove",  onMouseMove);
view.canvas.addEventListener("mouseenter", onMouseMove);
view.canvas.addEventListener("mouseout",   onMouseOut);
view.canvas.addEventListener("mousedown",  onMouseDown);
view.canvas.addEventListener("mouseup",    onMouseUp);

};

});
