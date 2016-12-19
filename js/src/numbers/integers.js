define(["algebra", "lib/biginteger"],
function(algebra,   BigInteger) {

var ints = {};

/* reguired implementations */
ints.equals     = function (a,b) { return BigInteger.compare(a,b) == 0; };
ints.isInstance = function (a)   { return a instanceof BigInteger; };
ints.zero       = BigInteger.ZERO;
ints.plus       = BigInteger.add;
ints.neg        = BigInteger.negate;
ints.one        = BigInteger.ONE;
ints.times      = BigInteger.multiply;
ints.leq        = function (a,b) { return BigInteger.compare(a,b) <= 0; };
ints.toNumber   = function (a)   { return a.toJSValue(); };
ints.toString   = function (a)   { return a.toString(); };

algebra.OrderedRing.call(ints);

/* optimizations */
ints.minus    = BigInteger.subtract;
ints.fromInt  = BigInteger;

Object.freeze(ints);

return ints;

});
