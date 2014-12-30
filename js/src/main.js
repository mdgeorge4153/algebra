requirejs.config({
  paths: {
    "lib": "../lib"
  }
});

require(["html", "lib/domReady!"],
function( html,   doc ) {

doc.body.appendChild(html.example());

});
