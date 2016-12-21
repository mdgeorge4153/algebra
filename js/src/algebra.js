define([],
function() {

var exports = {};

/******************************************************************************/

/**
 * OrderedField operations
 *
 * @interface @name OrderedField
 *
 * @property {E}         Monoid#zero
 * @property {E}           Ring#one
 *
 * @method   @name          Set#eq          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name          Set#isInstance  @param {E} e                @returns {boolean}
 * @method   @name          Set#ofString    @param {String} s           @returns {E}
 * @method   @name          Set#stringOf    @param {E} e                @returns {String}
 * @method   @name       Monoid#plus        @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name        Group#neg         @param {E} e                @returns {E}
 * @method   @name         Ring#times       @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name        Field#isUnit      @param {E} e                @returns {boolean}
 * @method   @name         Ring#inv         @param {E} e                @returns {E}
 * @method   @name PartialOrder#leq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name OrderedField#toNumber    @param {E} e                @returns {number}
 *
 * @method   @name          Set#neq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name       Monoid#isZero      @param {E} e                @returns {boolean}
 * @method   @name       Monoid#isNonZero   @param {E} e                @returns {boolean}
 * @method   @name        Group#minus       @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name         Ring#div         @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name         Ring#fromInt     @param {int} n              @returns {E}
 * @method   @name PartialOrder#lt          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#geq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#gt          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#cmp         @param {E} e1 @param {E} e2 @returns {int}
 * @method   @name PartialOrder#min         @param {E...} es            @returns {E}
 * @method   @name PartialOrder#max         @param {E...} es            @returns {E}
 * @method   @name PartialOrder#minInd      @param {E[]}  es            @returns {int}
 * @method   @name PartialOrder#maxInd      @param {E[]}  es            @returns {int}
 * @method   @name  OrderedRing#sign        @param {E} e                @returns {E}
 * @method   @name  OrderedRing#isNonNeg    @param {E} e                @returns {boolean}
 */

/**
 * PartialOrder operations
 * @interface @name PartialOrder
 *
 * @method   @name          Set#eq          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name          Set#isElem      @param {E} e                @returns {boolean}
 * @method   @name          Set#ofString    @param {String} s           @returns {E}
 * @method   @name          Set#stringOf    @param {E} e                @returns {String}
 * @method   @name          Set#neq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#leq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#lt          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#geq         @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#gt          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name PartialOrder#cmp         @param {E} e1 @param {E} e2 @returns {int}
 * @method   @name PartialOrder#min         @param {E...} es            @returns {E}
 * @method   @name PartialOrder#max         @param {E...} es            @returns {E}
 * @method   @name PartialOrder#minInd      @param {E[]}  es            @returns {int}
 * @method   @name PartialOrder#maxInd      @param {E[]}  es            @returns {int}
 */

/** @function @name invertPO @param {PartialOrder} order @returns {PartialOrder} */

/**
 * InnerProduct operations
 * @interface VectorSpace
 *
 * @property {Ring} r
 * @method   @name          Set#eq          @param {E} e1 @param {E} e2 @returns {boolean}
 * @method   @name          Set#isElem      @param {E} e                @returns {boolean}
 * @method   @name          Set#ofString    @param {String} s           @returns {E}
 * @method   @name          Set#stringOf    @param {E} e                @returns {String}
 * @method   @name       Monoid#plus        @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name       Monoid#isZero      @param {E} e                @returns {boolean}
 * @method   @name       Monoid#isNonZero   @param {E} e                @returns {boolean}
 * @method   @name AbelianGroup#neg         @param {E} e                @returns {E}
 * @method   @name AbelianGroup#minus       @param {E} e1 @param {E} e2 @returns {E}
 * @method   @name  VectorSpace#smult       @param {S} s  @param {E} v  @returns {E}
 * @method   @name  VectorSpace#sdiv        @param {E} v  @param {S} s  @returns {E}
 * @method   @name InnerProduct#dot         @param {E} v1 @param {E} v2 @returns {S}
 * @method   @name InnerProduct#norm2       @param {E} v1 @param {E} v2 @returns {S}
 */

/******************************************************************************/

exports.Set = function() {
  this.neq = function neq(e1, e2) {
    return !this.eq(e1, e2);
  };
};

/******************************************************************************/

exports.Monoid = function() {
  exports.Set.call(this);

  this.isZero = function isZero(e) {
    return this.eq(e,this.zero);
  };

  this.isNonZero = function isNonZero(e) {
    return !this.eq(e,this.zero);
  };
};

/******************************************************************************/

exports.Group = function() {
  exports.Monoid.call(this);

  this.minus = function minus(e1, e2) {
    return plus(e1, neg(e2));
  };
};

/******************************************************************************/

exports.Ring = function() {
  exports.Group.call(this);

  this.div = function div (e1, e2) {
    return times(e1, inv(e2));
  };

  this.fromInt = function fromInt (i) {
    if (i < 0)  return neg(fromInt(-i));
    if (i == 0) return zero;

    var rest = fromInt(Math.floor(i/2));
    rest = plus(rest,rest);
    return i % 2 == 0 ? rest : plus(one, rest);
  };
};

/******************************************************************************/

exports.PartialOrder = function() {
  this.geq = function geq(e1, e2) {
    return leq(e2,e1);
  };

  this.lt = function lt(e1, e2) {
    return !geq(e1,e2);
  };

  this.gt = function gt(e1, e2) {
    return !leq(e1,e2);
  };

  this.cmp = function cmp(e1, e2) {
    return  eq(e1,e2) ? 0  :
           leq(e1,e2) ? -1 : 1;
  };

  this.minInd = function minInd(es) {
    var min    = undefined;
    var minInd = undefined;
    for (var i in es) {
      if (es[i] == undefined) continue;
      if (min   == undefined || lt(es[i],min)) {
        minInd = i;
        min = es[i];
      }
    }
    return minInd;
  };

  this.maxInd = function maxInd(es) {
    var max    = undefined;
    var maxInd = undefined;
    for (var i in es) {
      if (es[i] == undefined) continue;
      if (max   == undefined || gt(es[i],max)) {
	maxInd = i;
	max = es[i];
      }
    }
    return maxInd;
  };

  this.min = function min() {
    return arguments[minInd(arguments)];
  };

  this.max = function max() {
    return arguments[maxInd(arguments)];
  };
};


exports.OrderedRing = function() {
  exports.Ring.call(this);
  exports.PartialOrder.call(this);

  this.sign = function sign(e) {
    return eq(e,zero)  ? zero :
           leq(e,zero) ? neg(one) : one;
  };

  this.isNonNeg = function isNonNeg(e) {
    return leq(zero,e);
  };

  this.isPos = function isPos(e) {
    return lt(zero,e);
  };

  this.isNeg = function isNeg(e) {
    return lt(e,zero);
  };
};

exports.OrderedField = function() {
  exports.OrderedRing.call(this);
};

exports.Module = function() {
  exports.Group.call(this);

  this.sdiv = function sdiv(v,s) {
    return smult(s,v);
  };
};

exports.VectorSpace = exports.Module;

exports.InnerProductSpace = function () {
  exports.VectorSpace.call(this);

  this.norm2 = function norm2(e) {
    return dot(e,e);
  };
};

return exports;

});
