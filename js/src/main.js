var model;
var tans;
var goal;
var controller;

requirejs.config({
  baseUrl: "src",
  paths: {
    "lib": "../lib"
  }
});

require(["numbers/floats", "model", "tanView", "goalView", "controller", "lib/domReady!"],
function( floats,           Model,   TanView,   GoalView,   Controller,   doc ) {

model = new Model(floats);
tans  = new TanView(model, doc.getElementById("canvas"));
contr = new Controller(model, tans);
goal  = new GoalView(model, doc.getElementById("goal"));

function resize() {
  tans.resize(0, 0, window.innerWidth - 1, window.innerHeight - 1);
  goal.resize(30, window.innerWidth - 230, 200, 300);
}

window.addEventListener("resize", resize);
resize();

});

