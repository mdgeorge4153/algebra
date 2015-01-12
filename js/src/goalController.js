define([],
function() {
return function GoalController(model, view) {

var puzzles = ["t", "box"];
var i = 0;

function onMouseDown(e) {
  var p = view.getEventCoords(e);
  if (model.F.isNonNeg(p.x))
    i += 1;
  else i -= 1;

  i = i % puzzles.length;
  if (i < 0)
    i += puzzles.length;

  model.loadGoal("data/" + puzzles[i]);
}

function onMouseEnter(e) {
  /* TODO: expand animation */
}

function onMouseOut(e) {
  /* TODO: expand animation */
}

view.canvas.addEventListener("mousedown",  onMouseDown);
view.canvas.addEventListener("mouseenter", onMouseEnter);
view.canvas.addEventListener("mouseout",   onMouseOut);

};

});
