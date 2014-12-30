define(["interfaces"], function (Interface) {

var exports = {};

/******************************************************************************/
var Set    = new Interface();

var E      = Set.hasTypeParam("E");
var equals = Set.hasOperation("equals", E, E, bool);

Set.requires(equals, isReflexive);
Set.requires(equals, isTransitive);
Set.requires(equals, isSymmetric);
Set.requires(equals, isEquality);

Set.addDefaultOperation("neq", E, E, bool,
  function (a, b) { return ! this.equals(a, b); }
);

Set.seal();
exports.Set = Set;

/******************************************************************************/
var Monoid = new Interface();

Monoid.isA(Set);

var plus = Monoid.hasOperation("plus", E, E, E);
var zero = Monoid.hasOperation("zero", E);

Monoid.requires(plus, hasIdentity, zero);
Monoid.requires(plus, isAssociative);

Monoid.seal();
exports.Monoid = Monoid;

/******************************************************************************/
var Group = new Interface();

Group.isA(Monoid);

var neg = Group.hasOperation("neg", E, E);

Group.requires(plus, hasInverse, neg, zero);

Group.addDefaultOperation("minus", E, E, E,
  function (a, b) { return this.plus(a, this.neg(b)); }
);

Group.addDefaultOperation("isZero", E, bool,
  function (a) { return this.equals(a, this.zero()); }
);

Group.seal();
exports.Group = Group;

/******************************************************************************/
var AbelianGroup = new Interface();

AbelianGroup.isA(Group);

AbelianGroup.requires(plus, isCommutative);

AbelianGroup.seal();
exports.AbelianGroup = AbelianGroup;

/******************************************************************************/
var Ring = new Interface();

Ring.isA(AbelianGroup);

var times  = Ring.hasOperation("times", E, E, E);
var one    = Ring.hasOperation("one", E);
var isUnit = Ring.hasOperation("isUnit", E, bool);

var inv    = Ring.hasOperation("inv", E, E);

Ring.requires(times, isAssociative);
Ring.requires(times, distributesOver, plus);

Ring.requires(times, isCommutative);
Ring.requires(times, hasIdentity, one);

Ring.requires(inv, isInverseIf, isUnit, one);

Ring.addDefaultOperation("div", E, E, E,
  function (a, b) { return this.times(a, this.inv(b)); }
);

Ring.addDefaultOperation("fromInt", int, E,
  function fromInt (n) {
    if (n < 0)
      return this.neg(this.fromInt(-n));
    else if (n == 0)
      return this.zero;
    else {
      var bit  = n % 2 == 0 ? this.zero : this.one;
      var rest = fromInt.call(this, Math.floor(n / 2));
      return this.plus(this.plus(rest, rest), bit);
    }
  }
);

Ring.seal();
exports.Ring = Ring;

/******************************************************************************/
var Field = new Interface();

Field.isA(Ring);

Field.requires(isUnit, isTrueUnless, isZero);

Field.seal();
exports.Field = Field;

/******************************************************************************/
var OrderedRing = new Interface();

OrderedRing.isA(Ring);

var isNonNeg = OrderedRing.hasOperation("isNonNeg", E, bool);

OrderedRing.requires(isNonNeg, trueOfMinusOne);
OrderedRing.requires(isNonNeg, trueOfSquares);
OrderedRing.requires(isNonNeg, preservedBy, plus);
OrderedRing.requires(isNonNeg, preservedBy, times);

OrderedRing.addDefaultOperation("le", E, E, bool,
  function (a, b) { return this.isNonNeg(this.minus(b, a)); }
);

OrderedRing.addDefaultOperation("lt", E, E, bool,
  function (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("ge", E, E, bool,
  function (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("gt", E, E, bool,
  function (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("cmp", E, E, int,
  function (a, b) { throw "TODO"; }
);

/* TODO: sign more useful if it returns E or int? */
OrderedRing.addDefaultOperation("sign", E, sign,
  function (a, b) { throw "TODO"; }
);

OrderedRing.seal();
exports.OrderedRing = OrderedRing;

/******************************************************************************/
var OrderedField = new Interface();

OrderedField.isA(OrderedRing);
OrderedField.isA(Field);

/******************************************************************************/
function ModuleOver(r) {
  var Module = new Interface();
  var S      = r.E;

  Module.isA(AbelianGroup);

  Module.hasOperation("smult", S, E, E);

  Module.requires(r,     isA, Ring);
  Module.requires(times, distributesOver, r.plus);
  Module.requires(times, associatesOver, r.times);

  Module.seal();

  return Module;
};


exports.ModuleOver = ModuleOver;

/******************************************************************************/
function VectorSpaceOver(f) {
  var VectorSpace = new Interface();

  VectorSpace.isA(ModuleOver(f));

  VectorSpace.requires(f, isA, Field);

  VectorSpace.seal();

  return VectorSpace;
};

return exports;
});
