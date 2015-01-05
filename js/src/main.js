requirejs.config({
  baseUrl: "src",
  paths: {
    "lib": "../lib"
  }
});

require(["html", "lib/domReady!", "numbers/floats"],
function( html,   doc,             floats ) {

doc.body.appendChild(html.example());

});
