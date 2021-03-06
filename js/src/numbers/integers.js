define(["algebra", "lib/biginteger", "lib/traits", "lib/jsverify"],
function(Algebra,   BigInteger, Traits, jsc) {

var ints = {};

// TODO: changing int16 to integer causes stack overflow
var arbBigint = jsc.nonshrink(jsc.int16.smap(
  function(n) {
    return BigInteger(n);
  },

  function(i) {
    return i.toJSValue() - 1;
  },

  function(i) {
    return i.toString();
  }
));


/* reguired implementations */
ints.eq         = function eq(a,b)         { return BigInteger.compare(a,b) == 0; };
ints.isInstance = function isInstance(a)   { return a instanceof BigInteger; };
ints.arbitrary  = arbBigint;
ints.zero       = BigInteger.ZERO;
ints.one        = BigInteger.ONE;
ints.plus       = function plus(a,b)       { return BigInteger.add(a,b); };
ints.neg        = function neg(a)          { return BigInteger.negate(a); };
ints.times      = function times(a,b)      { return BigInteger.multiply(a,b); };
ints.divMod     = function divMod(a,b)     { return BigInteger.divRem(a,b); };

ints.leq        = function leq      (a,b) { return BigInteger.compare(a,b) <= 0; };
ints.toNumber   = function toNumber (a)   { return a.toJSValue(); };
ints.stringOf   = function stringOf (a)   { return a.toString(); };
ints.ofString   = function ofString (s)   { return BigInteger(s); };
ints.isUnit     = function isUnit   (a)   { return ints.eq(a,ints.one) || ints.eq(a, ints.neg(ints.one)); };
ints.inv        = function inv      (a)   { if (!this.isUnit(a)) throw new Error("can't invert a non-unit");  return a; };
ints.degree     = function degree   (a)   { return BigInteger.abs(a); };

/* optimizations */
ints.minus    = function minus(a,b)  { return BigInteger.subtract(a,b); };
ints.fromInt  = function fromInt(n)  { return BigInteger(n); };
ints.quot     = function quot(a,b)   { return BigInteger.divide(a,b); };
ints.rem      = function rem(a,b)    { return BigInteger.remainder(a,b); };

return Traits.create({}, Traits.override(Traits(ints), Algebra.OrderedEuclideanRing));

});
