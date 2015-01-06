define(["lib/domReady!"],
function(doc) {
return function Controller(model, view) {

function onMouseMove(e) {
  var pos = view.getEventCoords(e);

  for (var i in model.tans)
    if (model.tans[i].contains(pos))
      model.selected = i;
}

view.canvas.addEventListener("mousemove",  onMouseMove);
view.canvas.addEventListener("mouseenter", onMouseMove);
view.canvas.addEventListener("mouseout",   onMouseMove);

};

});
