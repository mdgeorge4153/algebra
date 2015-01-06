define(["lib/domReady!"],
function(doc) {
return function Controller(model, view) {

function onMouseMove(e) {
  var pos = view.getEventCoords(e);

  model.selection = -1;

  for (var i in model.tans)
    if (model.tans[i].contains(pos))
      model.selection = i;
}

function onMouseOut(e) {
  model.selection = -1;
}

view.canvas.addEventListener("mousemove",  onMouseMove);
view.canvas.addEventListener("mouseenter", onMouseMove);
view.canvas.addEventListener("mouseout",   onMouseMove);

};

});
