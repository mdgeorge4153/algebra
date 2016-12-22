define(["algebra", "lib/biginteger", "lib/traits", "lib/jsverify"],
function(Algebra,   BigInteger, Traits, jsc) {

var ints = {};

var arbBigint = jsc.pair(jsc.array(jsc.nat), jsc.bool).smap(
  function(arr) {
    return new BigInteger(arr[0], arr[1] ? 1 : -1);
  },

  function(n) {
    var isNeg = n.isNegative();
    if (isNeg) n = n.negate();

    var result = [];
    while (n.isPositive()) {
      var divRem = n.divRem(10);
      result[result.length] = divRem[1].toJSValue();
      n = divRem[0];
    }

    return [result, !isNeg];
  },

  function(n) {
    return n.toString();
  }
);


/* reguired implementations */
ints.eq         = function (a,b) { return BigInteger.compare(a,b) == 0; };
ints.isInstance = function (a)   { return a instanceof BigInteger; };
ints.arbitrary  = arbBigint;
ints.zero       = BigInteger.ZERO;
ints.plus       = BigInteger.add;
ints.neg        = BigInteger.negate;
ints.one        = BigInteger.ONE;
ints.times      = BigInteger.multiply;
ints.leq        = function leq      (a,b) { return BigInteger.compare(a,b) <= 0; };
ints.toNumber   = function toNumber (a)   { return a.toJSValue(); };
ints.stringOf   = function stringOf (a)   { return a.toString(); };
ints.ofString   = function ofString (s)   { return BigInteger(s); };
ints.isUnit     = function isUnit   (a)   { return ints.eq(a,ints.one) || ints.eq(a, ints.neg(ints.one)); };
ints.inv        = function inv      (a)   { if (!this.isUnit(a)) throw new Error("can't invert a non-unit");  return a; };

/* optimizations */
ints.minus    = BigInteger.subtract;
ints.fromInt  = BigInteger;

return Traits.create({}, Traits.override(Traits(ints), Algebra.OrderedRing));

});
