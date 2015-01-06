requirejs.config({
  baseUrl: "src",
  paths: {
    "lib": "../lib"
  }
});

require(["numbers/floats", "model", "view", "controller"],
function( floats,           Model,   View,   Controller ) {

var model = new Model(floats);
var view  = new View(model);
// var contr = new Controller(model);

});

