define(["lib/jsverify"],
function(jsc) {

return function property(name) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (args.length == 1)
    args.splice(0,0,jsc.unit);
  var prop = jsc.forall.apply(null,args);
  it(name, function() {
    expect(jsc.check(prop)).toBe(true);
  });
};

});
