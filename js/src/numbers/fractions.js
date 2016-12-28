/* fractions implementation ***************************************************/

define(["algebra", "lib/jsverify"],
function(algebra,   jsc) {

return function FieldOfFractions(R) {

/** Fraction type *************************************************************/

function Fraction(num, den) {
  if (den === undefined)
    den = R.one;

  if (R.isZero(den))
    throw new Error("division by 0");

  var cd = R.gcd(num, den);
  num    = R.quot(num, cd);
  den    = R.quot(den, cd);

  if (R.isNeg(den)) {
    num = R.neg(num);
    den = R.neg(den);
  }

  this.num = num;
  this.den = den;

  Object.freeze(this);
}

Fraction.prototype.toString = function() {
  if (R.isZero(this.num))
    return R.stringOf(this.num);

  else if (R.eq(this.den, R.one))
    return R.stringOf(this.num);

  return "(" + R.stringOf(this.num) + "/" + R.stringOf(this.den) + ")";
}

function create(n,d) {
  return new Fraction(n,d);
}

/** Field required implementations ********************************************/

this.eq = function eq(a,b) {
  // can just check for equality since we canonicalize
  return R.eq(a.num, b.num) && R.eq(a.den, b.den);
}

this.arbitrary = jsc.pair(R.arbitrary, R.arbitrary).smap(
  function(es)   { return create(es[0], R.isZero(es[1]) ? R.one : es[1]); },
  function(frac) { return [frac.num, frac.den]; },
  function(frac) { return frac.toString(); }
);

this.isInstance = function isInstance(a) {
  return a instanceof Fraction &&
         R.isInstance(a.num) && R.isInstance(a.den) &&
         R.isUnit(R.gcd(a.num, a.den)) &&
         R.isPos(a.den);
};

this.ofString = function ofString(s) {
  var substrings = s.replace("(","").replace(")","").split("/");
  if (substrings.length == 0)
    return R.zero;
  if (substrings.length == 1)
    return create(R.ofString(substrings[0]));
  if (substrings.length == 2)
    return create(R.ofString(substrings[0]), R.ofString(substrings[1]));
  throw new Error("multiple /s in fraction");
};

this.stringOf = function stringOf(n) {
  return n.toString();
};

if (R.leq != undefined) {
  this.leq = function leq(a,b) {
    return R.leq(R.times(a.num, b.den), R.times(a.den, b.num));
  };
}

this.plus = function plus(a,b) {
  return create(R.plus(R.times(a.num, b.den), R.times(a.den, b.num)),
                R.times(a.den, b.den));
};

this.zero = create(R.zero, R.one);

this.neg = function neg(a) {
  return create(R.neg(a.num), a.den);
};

this.times = function times(a,b) {
  return create(R.times(a.num, b.num), R.times(a.den,b.den));
};

this.one = create(R.one, R.one);

this.inv = function inv(a) {
  return create(a.den, a.num);
};

if (R.toNumber != undefined) {
  this.toNumber = function toNumber(a) {
    return R.toNumber(a.num) / R.toNumber(a.den);
  };
}

/** Optimizations *************************************************************/

this.fromInt = function fromInt(n) {
  return create(R.fromInt(n), R.one);
};

/** only for fractions ********************************************************/

this.fromRingElems = function fromRingElems(a,b) {
  return new Fraction(a,b);
};

this.fromInts = function fromInts(n1,n2) {
  return create(R.fromInt(n1), R.fromInt(n2));
};

};

});
