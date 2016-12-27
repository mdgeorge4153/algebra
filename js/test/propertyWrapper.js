define(["lib/jsverify"],
function(jsc) {

beforeEach(function() {

  jasmine.addMatchers({
    toHold: function() {
      return {
        compare: function(actual) {
	  /* global window */
	  var quiet = window && !(/verbose=true/).test(window.location.search);

	  var r = jsc.check(actual, { quiet: quiet });

	  var pass = r === true;
	  var message = "";

	  if (pass) {
	    message = "Expected property not to hold.";
	  } else {
	    message = "Expected property to hold. Counterexample found: " + r.counterexamplestr;
	  }

	  return {
	    pass: pass,
	    message: message,
	  };
        }
      };
    }
  });

});

return function property(name) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (args.length == 1)
    args.splice(0,0,jsc.unit);
  var prop = jsc.forall.apply(null,args);
  it(name, function() {
    expect(prop).toHold();
  });
};

});
