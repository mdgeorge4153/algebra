define(['lib/traits'],
function(Traits) {

console.log(Traits);

var exports = {};

// implemented below.
var fromIntImpl;
var maxIndImpl;
var minIndImpl;

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

exports.CommutativeRing = exports.Ring

exports.Field = exports.CommutativeRing

exports.OrderedRing = Traits.compose(exports.CommutativeRing, exports.TotalOrder, Trait({
  sign:       /** E      -> E      */ function sign(a) { return this.eq(a, this.zero) ? this.zero : this.leq(a, this.zero) ? this.neg(this.one) : this.one; },
  isNonNeg:   /** E      -> bool   */ function isNonNeg(a) { return this.leq(this.zero, a); },
  isNeg:      /** E      -> bool   */ function isNeg(a) { return this.lt(a, this.zero); },
  isPos:      /** E      -> bool   */ function isPos(a) { return this.gt(a, this.zero); }
}));

exports.OrderedField = Traits.compose(exports.OrderedRing, Traits({
  toNumber:   /** E      -> number */ Traits.required
}));

/** Vectors *******************************************************************/

exports.Module = Traits.compose(exports.Group, Traits({
  scalars:    /** OrderedRing      */ Traits.required,
  smult:      /** S, E   -> E      */ Traits.required,
  sdiv:       /** E, S   -> E      */ function sdiv(v,s)  { return this.smult(this.scalars.inv(s), v); }
}));

exports.VectorSpace = exports.Module

exports.InnerProductSpace = Traits.compose(exports.VectorSpace, Traits({
  dot:        /** E, E   -> S      */ Traits.required,
  norm2:      /** E      -> S      */ function norm2(v) { return this.dot(v,v); }
}));

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
  for (var i in es) {
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

/******************************************************************************/

return exports;

});
