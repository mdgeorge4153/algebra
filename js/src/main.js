var model;
var view;
var controller;

requirejs.config({
  baseUrl: "src",
  paths: {
    "lib": "../lib"
  }
});

require(["numbers/floats", "model", "view", "controller", "lib/domReady!"],
function( floats,           Model,   View,   Controller,   doc ) {

model = new Model(floats);
view  = new View(model, doc.getElementById("canvas"));
contr = new Controller(model, view);

function resize() {
  view.resize(30, 30, window.innerWidth - 60, window.innerHeight - 60);
}

window.addEventListener("resize", resize);
resize();

});

