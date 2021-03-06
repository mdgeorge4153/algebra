define(['lib/traits'],
function(Traits) {

var exports = {};

// implemented below.
var fromIntImpl;
var maxIndImpl;
var minIndImpl;
var gcdImpl;
var bezoutImpl;

/******************************************************************************/

exports.Set = Traits({
  eq:         /** E, E   -> bool   */ Traits.required,
  arbitrary:  /** jsc.arbitrary E  */ Traits.required,
  isInstance: /** E      -> bool   */ Traits.required,
  ofString:   /** string -> E      */ Traits.required,
  stringOf:   /** E      -> string */ Traits.required,
  neq:        /** E, E   -> bool   */ function neq(a,b) { return !this.eq(a,b); }
});

/** Orderings *****************************************************************/

exports.PartialOrder = Traits.compose(exports.Set, Traits({
  leq:        /** E, E   -> bool   */ Traits.required,
  geq:        /** E, E   -> bool   */ function geq(a,b) { return this.leq(b,a); },
  gt:         /** E, E   -> bool   */ function gt(a,b) { return this.geq(a,b) && !this.eq(a,b); },
  lt:         /** E, E   -> bool   */ function lt(a,b) { return this.leq(a,b) && !this.eq(a,b); },
  cmp:        /** E, E   -> number */ function cmp(a,b) { return this.eq(a,b) ? 0 : this.leq(a,b) ? -1 : 1; },

  /** return the index of the minimum/max element.  undefined entries are ignored */
  minInd:     /** E[]    -> int    */ function minInd(as) { return minIndImpl.call(this,as); },
  maxInd:     /** E[]    -> int    */ function maxInd(es) { return maxIndImpl.call(this,es); },

  /** return the minimum/maximum argument.  undefined entries are ignored.
   *  Returns undefined if there are no (defined) arguments.
   */
  min:        /** E...   -> E      */ function min() { return arguments[this.minInd(arguments)]; },
  max:        /** E...   -> E      */ function max() { return arguments[this.maxInd(arguments)]; }
}));

exports.TotalOrder = Traits.override(Trait({
  gt:         /** E, E   -> bool   */ function gt(a,b) { return !this.leq(a,b); },
  lt:         /** E, E   -> bool   */ function lt(a,b) { return !this.geq(a,b); }
}), exports.PartialOrder);

/** Scalars *******************************************************************/

exports.Monoid = Traits.compose(exports.Set, Traits({
  plus:       /** E, E   -> E      */ Traits.required,
  zero:       /**           E      */ Traits.required,
  isZero:     /** E      -> bool   */ function isZero(a) { return this.eq(a, this.zero); },
  isNonZero:  /** E      -> bool   */ function isNonZero(a) { return !this.eq(a, this.zero); }
}));

exports.Group = Traits.compose(exports.Monoid, Traits({
  neg:        /** E      -> E      */ Traits.required,
  minus:      /** E, E   -> E      */ function minus(a, b) { return this.plus(a, this.neg(b)); }
}));

exports.AbelianGroup = exports.Group;

exports.Ring = Traits.compose(exports.AbelianGroup, Traits({
  times:      /** E, E   -> E      */ Traits.required,
  one:        /**           E      */ Traits.required,
  inv:        /** E      -> E      */ Traits.required,

  /** returns true if the given element has an inverse. */
  isUnit:     /** E      -> bool   */ Traits.required,

  div:        /** E, E   -> E      */ function div(a,b) { return this.times(a, this.inv(b)); },
  fromInt:    /** int    -> E      */ function fromInt(a,b) { return fromIntImpl.call(this, a,b); }
}));

exports.CommutativeRing = exports.Ring;

exports.EuclideanRing = Traits.compose(exports.CommutativeRing, Traits({
  divMod:     /** E, E   -> E, E   */ Traits.required,
  degree:     /** E      -> nat    */ Traits.required,

  gcd:        /** E, E   -> E      */ function gcd(a,b)     { return gcdImpl.call(this, a, b); },

  quot:       /** E, E   -> E      */ function quot(a,b)    { return this.divMod(a,b)[0]; },
  rem:        /** E, E   -> E      */ function rem(a,b)     { return this.divMod(a,b)[1]; },
  divides:    /** E, E   -> bool   */ function divides(a,b) { return this.isZero(a) ? this.isZero(b) : this.isZero(this.rem(b,a)); },

  /** return [s,t] such that gcd(a,b) = s*a + t*b */
  bezout:     /** E, E   -> E, E   */ function bezout(a,b) { return bezoutImpl.call(this, a, b); },
}));

exports.Field = Traits.override(Traits({
  divMod:     /** E, E   -> E, E   */ function divMod(a,b) { return [this.div(a,b), this.zero]; },
  degree:     /** E      -> nat    */ function degree(a)   { return 0; },
  isUnit:     /** E      -> bool   */ function isUnit(a)   { return this.isNonZero(a); },

  gcd:        /** E, E   -> E      */ function gcd(a,b)  { return this.one; /* TODO? */ },
  bezout:     /** E, E   -> E      */ function bezout(a,b) { return [this.zero, this.inv(b)]; },
}), exports.EuclideanRing);

exports.OrderedRing = Traits.compose(exports.CommutativeRing, exports.TotalOrder, Trait({
  sign:       /** E      -> E      */ function sign(a) { return this.eq(a, this.zero) ? this.zero : this.leq(a, this.zero) ? this.neg(this.one) : this.one; },
  isNonNeg:   /** E      -> bool   */ function isNonNeg(a) { return this.leq(this.zero, a); },
  isNeg:      /** E      -> bool   */ function isNeg(a) { return this.lt(a, this.zero); },
  isPos:      /** E      -> bool   */ function isPos(a) { return this.gt(a, this.zero); },
  abs:        /** E      -> E      */ function abs(a)   { return this.isNeg(a) ? this.neg(a) : a; }
}));

exports.OrderedEuclideanRing = Traits.compose(exports.EuclideanRing, exports.OrderedRing);

exports.OrderedField = Traits.compose(exports.OrderedRing, exports.Field, Traits({
  toNumber:   /** E      -> number */ Traits.required
}));

/** Vectors *******************************************************************/

exports.Module = Traits.compose(exports.Group, Traits({
  scalars:    /** CommutativeRing  */ Traits.required,
  smult:      /** S, E   -> E      */ Traits.required,
  sdiv:       /** E, S   -> E      */ function sdiv(v,s)  { return this.smult(this.scalars.inv(s), v); }
}));

exports.VectorSpace = exports.Module

exports.InnerProductSpace = Traits.compose(exports.VectorSpace, Traits({
  dot:        /** E, E   -> S      */ Traits.required,
  norm2:      /** E      -> S      */ function norm2(v) { return this.dot(v,v); }
}));

/** Matrices ******************************************************************/

exports.AssociativeAlgebra = Traits.compose(exports.Module, exports.Ring)

/** Implementations ***********************************************************/

/** @see Ring.fromInt */
fromIntImpl = function fromIntImpl (i) {
  if (i < 0)  return this.neg(fromIntImpl.call(this,-i));
  if (i == 0) return this.zero;

  var rest = fromIntImpl.call(this,Math.floor(i/2));
  rest = this.plus(rest,rest);
  return i % 2 == 0 ? rest : this.plus(this.one, rest);
};

/** @see PartialOrder.minInd */
minIndImpl = function minIndImpl(es) {
  var min    = undefined;
  var minInd = undefined;
  for (var i = 0; i < es.length; i++) {
    if (es[i] == undefined) continue;
    if (min   == undefined || this.lt(es[i],min)) {
      minInd = i;
      min = es[i];
    }
  }
  return minInd;
};

/** @see PartialOrder.maxInd */
maxIndImpl = function maxIndImpl(es) {
  return minIndImpl.call({lt: this.gt}, es);
};

/** @see EuclideanRing.gcd */
gcdImpl = function gcdImpl(a,b) {
  // gcd(a,0) = |a|
  // gcd(a,b) = gcd(b,r) where a = qb+r
  while (this.isNonZero(b)) {
    var t = b;
    b = this.rem(a, b);
    a = t;
  }
  return this.abs(a);
};

/** @see EuclideanRing.bezout */
bezoutImpl = function bezoutImpl(a,b) {
  // gcd(a,0) = a = 1*a + 0*0
  // gcd(a,b) = gcd(b,r)         where a = qb + r
  //          = s'b + t'r        recursively
  //          = s'b + t'(a - qb) by above
  //          = t'a + (s'-t'q)b  by algebra

  if (this.isZero(b))
    return [this.sign(a), this.zero];

  var divMod = this.divMod(a, b);
  var q = divMod[0], r = divMod[1];

  var brCoeffs = bezoutImpl.call(this, b,r);
  var sPrime = brCoeffs[0], tPrime = brCoeffs[1];

  return [tPrime, this.minus(sPrime, this.times(tPrime,q))];
};

/******************************************************************************/

return exports;

});
