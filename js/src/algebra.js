define(["interface", "properties"],
function(Interface,    props) {
with(props) {

var exports = {};

/******************************************************************************/
var Set    = new Interface();

var E      = Set.hasTypeParam("E");
var equals = Set.hasOperation("equals", [E, E, Interface.bool]);

Set.requires(equals, isReflexive);
Set.requires(equals, isTransitive);
Set.requires(equals, isSymmetric);
Set.requires(equals, isEquality);

Set.addDefaultOperation("neq", [E, E, Interface.bool],
  function neq (a, b) { return ! this.equals(a, b); }
);

Object.freeze(Set);
exports.Set = Set;

/******************************************************************************/
var Monoid = new Interface();

Monoid.isA(Set);

var plus = Monoid.hasOperation("plus", [E, E, E]);

var zero = Monoid.hasProperty("zero", E);

Monoid.requires(plus, hasIdentity, zero);
Monoid.requires(plus, isAssociative);

Object.freeze(Monoid);
exports.Monoid = Monoid;

/******************************************************************************/
var Group = new Interface();

Group.isA(Monoid);

var neg = Group.hasOperation("neg", [E, E]);

Group.requires(plus, hasInverse, neg, zero);

Group.addDefaultOperation("minus", [E, E, E],
  function minus (a, b) { return this.plus(a, this.neg(b)); }
);

Group.addDefaultOperation("isZero", [E, Interface.bool],
  function isZero (a) { return this.equals(a, this.zero()); }
);

Object.freeze(Group);
exports.Group = Group;

/******************************************************************************/
var AbelianGroup = new Interface();

AbelianGroup.isA(Group);

AbelianGroup.requires(plus, isCommutative);

Object.freeze(AbelianGroup);
exports.AbelianGroup = AbelianGroup;

/******************************************************************************/
var Ring = new Interface();

Ring.isA(AbelianGroup);

var times  = Ring.hasOperation("times",  [E, E, E]);
var isUnit = Ring.hasOperation("isUnit", [E, Interface.bool]);
var one    = Ring.hasProperty ("one",    E);

var inv    = Ring.hasOperation("inv", [E, E]);

Ring.requires(times, isAssociative);
Ring.requires(times, distributesOver, plus);

Ring.requires(times, isCommutative);
Ring.requires(times, hasIdentity, one);

Ring.requires(inv, isInverseIf, isUnit, one);

Ring.addDefaultOperation("div", [E, E, E],
  function div (a, b) { return this.times(a, this.inv(b)); }
);

Ring.addDefaultOperation("fromInt", [Interface.integer, E],
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

Object.freeze(Ring);
exports.Ring = Ring;

/******************************************************************************/
var Field = new Interface();

Field.isA(Ring);

Field.requires(isUnit, isTrueUnless, "isZero");

Object.freeze(Field);
exports.Field = Field;

/******************************************************************************/
var OrderedRing = new Interface();

OrderedRing.isA(Ring);

var isNonNeg = OrderedRing.hasOperation("isNonNeg", [E, Interface.bool]);

OrderedRing.requires(isNonNeg, trueOfMinusOne);
OrderedRing.requires(isNonNeg, trueOfSquares);
OrderedRing.requires(isNonNeg, preservedBy, plus);
OrderedRing.requires(isNonNeg, preservedBy, times);

OrderedRing.addDefaultOperation("le", [E, E, Interface.bool],
  function le (a, b) { return this.isNonNeg(this.minus(b, a)); }
);

OrderedRing.addDefaultOperation("lt", [E, E, Interface.bool],
  function lt (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("ge", [E, E, Interface.bool],
  function ge (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("gt", [E, E, Interface.bool],
  function gt (a, b) { throw "TODO"; }
);

OrderedRing.addDefaultOperation("cmp", [E, E, Interface.integer],
  function cmp (a, b) { throw "TODO"; }
);

/* TODO: sign more useful if it returns E or integer? */
OrderedRing.addDefaultOperation("sign", [E, Interface.integer],
  function sign (a, b) { throw "TODO"; }
);

Object.freeze(OrderedRing);
exports.OrderedRing = OrderedRing;

/******************************************************************************/
var OrderedField = new Interface();

OrderedField.isA(OrderedRing);
OrderedField.isA(Field);

Object.freeze(OrderedField);
exports.OrderedField = OrderedField;

/******************************************************************************/
function ModuleOver(r) {
  var Module = new Interface();
  var S      = r.E;

  Module.isA(AbelianGroup);

  Module.hasOperation("smult", [S, E, E]);

  Module.requires(r,     isA, Ring);
  Module.requires(times, distributesOver, r.plus);
  Module.requires(times, associatesOver, r.times);

  Object.freeze(Module);

  return Module;
};


exports.ModuleOver = ModuleOver;

/******************************************************************************/
function VectorSpaceOver(f) {
  var VectorSpace = new Interface();

  VectorSpace.isA(ModuleOver(f));

  VectorSpace.requires(f, isA, Field);

  Object.freeze(VectorSpace);

  return VectorSpace;
};

return exports;

}});
