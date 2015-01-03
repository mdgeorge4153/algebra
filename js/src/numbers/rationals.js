
define(["integers", "algebra", "biginteger", "fractions"],
function(integers,   algebra,   BigInteger,   FieldOfFractions) {

function gcd(a, b) {
  /* implementation pseudocode taken from Wikipedia
   * http://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
   *
   * while b ≠ 0
   *   t = b
   *   b = a mod b
   *   a = t
   * return a
   */
  while (!ints.equals(b, ints.zero)) {
    var t = b;
    b = BigInteger.remainder(a, b);
    a = t;
  }
  return a;
}

function reduce(n, d) {
  /* check for zero */
  if (ints.equals(n, ints.zero))
    return [ints.zero, ints.one];
  if (ints.equals(d, ints.zero))
    throw "division by zero";

  /* ensure the denominator is positive */
  if (!ints.isNonNeg(d)) {
    n = ints.neg(n);
    d = ints.neg(d);
  }

  /* compute gcd and reduce */
  var cd = gcd(n, d);

  n = BigInteger.divide(n, cd);
  d = BigInteger.divide(d, cd);

  return [n, d];
}

var rats    = new OrderedFieldOfFractions(ints, reduce);

Object.freeze(rats);

return rats;

});
