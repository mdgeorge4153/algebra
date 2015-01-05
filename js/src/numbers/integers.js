define(["algebra", "lib/biginteger"],
function(algebra,   BigInteger) {

var ints = {};

/* reguired implementations */
ints.equals    = function (a,b) { return BigInteger.compare(a,b) == 0; };
ints.isElem    = function (a)   { return a instanceof BigInteger; };
ints.zero      = BigInteger.ZERO;
ints.plus      = BigInteger.add;
ints.neg       = BigInteger.negate;
ints.one       = BigInteger.ONE;
ints.times     = BigInteger.multiply;
ints.isNonNeg  = function (a) { return BigInteger.compare(a,0) >= 0; };
ints.toNumber  = function (a) { return a.toJSValue(); };
ints.toString  = function (a) { return a.toString(); };

/* optimizations */
ints.minus    = BigInteger.subtract;
ints.fromInt  = BigInteger;

algebra.OrderedRing.instantiate(ints);

ints.integerSpec = {
  examples: [BigInteger(-100000), BigInteger(-10), BigInteger(-2), BigInteger(-1),
             BigInteger(0),
	     BigInteger(1), BigInteger(2), BigInteger(3), BigInteger(1000000000)],
  check:    function (bi) { return bi instanceof BigInteger; },
  eq:       ints.equals
};

return ints;

});
