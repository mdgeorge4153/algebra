var model;

var tans;
var contr;

var goal;
var gcontr;

requirejs.config({
  baseUrl: "src",
  paths: {
    "lib":  "../lib",
    "data": "../data"
  }
});

require(["numbers/floats", "model", "tanView", "goalView", "controller", "goalController", "lib/domReady!"],
function( floats,           Model,   TanView,   GoalView,   Controller,   GoalController,   doc) {

model = new Model(floats);
model.loadGoal("data/t");
tans  = new TanView(model, doc.getElementById("canvas"));
contr = new Controller(model, tans, Math.cos(Math.PI/12), Math.sin(Math.PI/12));

goal  = new GoalView(model, doc.getElementById("goal"));
gcont = new GoalController(model, goal);

function resize() {
  tans.resize(0, 0, window.innerWidth - 1, window.innerHeight - 1);
  goal.resize(10, window.innerWidth - 100, 90, 60);
}

window.addEventListener("resize", resize);
resize();

});

