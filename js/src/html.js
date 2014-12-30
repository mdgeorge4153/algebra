define(function() {

var Html = {};

/**
 * html.js
 *
 * library for easily creating HTML DOM nodes from within javascript.
 *
 * Each node has a corresponding function.  The function takes any number of
 * arguments, each of which is either:
 *  - a dom node       (which is inserted directly)
 *  - an object        (which is used to specify attributes)
 *  - a primitive type (which is inserted as text)
 * these functions create and return the corresponding dom node.
 */

/* here are the available functions: */

var tags = ["P","TABLE","TR","TH","TD","UL","OL","LI","B", "IMG", "H1", "H2", "H3", "H4"];

/*
 * here is an example.  To include the example, simply call
 *
 * document.appendChild(Html.example());
 */

Html.example = function () {
  with (Html) {
  return TABLE({"style": "border: 1px solid black;"},
           TR(TH({"class":"col1"}, "column 1 header"),
              TH({"class":"col2"}, "column 2 header")),
           TR(TD(P("a paragraph"),
                 P("another paragraph")),
              TD(IMG({"src":"foo.jpg", "title":"foo"}))));
  }
}

/* implementation *************************************************************/

function mkNodeFunction (name) {
  return function () {
    result = document.createElement(name);

    for (var i in arguments) {
      var arg = arguments[i];

      if (arg instanceof Node)
        result.appendChild(arg);

      else if (!(arg instanceof Object)
            || arg instanceof Array
            || arg instanceof String)
        result.appendChild(document.createTextNode(arguments[i].toString()));

      else
        for (var attrName in arguments[i])
          result.setAttribute(attrName, arguments[i][attrName]);
    }

    return result;
  }
}

for (var i in tags)
  Html[tags[i]] = mkNodeFunction(tags[i].toLowerCase());

return Html;

});

