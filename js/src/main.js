requirejs.config({
  baseUrl: "src",
  paths: {
    "lib": "../lib"
  }
});

require(["html", "lib/domReady!", "algebra"],
function( html,   doc,             algebra ) {

doc.body.appendChild(html.example());

});
