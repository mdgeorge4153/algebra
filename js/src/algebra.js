define(["jsc"],
function(jsc) {

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
 * @method   @name          Set#equals      @param {E} e1 @param {E} e2 @returns {boolean}
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
 * @method   @name          Set#equals      @param {E} e1 @param {E} e2 @returns {boolean}
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
 * @method   @name          Set#equals      @param {E} e1 @param {E} e2 @returns {boolean}
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

function reflexive(op, env) {
  jsc.property(op.name + " is reflexive", "e", env, function(e) {
    return op(e,e);
  });
}

function symmetric(op, env) {
  jsc.property(op.name + " is symmetric", "e & e", env, function(e) {
    return op(e[0],e[1]) == op(e[1],e[0]);
  });
}

function transitive(op, env) {
  jsc.property(op.name + " is transitive", "e & e & e", env, function(e) {
    return op(e[0],e[1]) && op(e[1], e[2]) ? op(e[0], e[2]) : true;
  });
}

function associative(eq, op, env) {
  jsc.property(op.name + " is associative", "e & e & e", env, function(e) {
    return eq(op(e[0], op(e[1], e[2])), op(op(e[0], e[1]), e[2]));
  };
}

function hasIdentity(eq, op, id, env) {
  jsc.property(op.name + " has identity", "e", env, function(e) {
    return eq(e, op(e, id)) && eq(e, op(id, e));
  };
}

function hasInverse(eq, op, inv, id, env) {
  jsc.property(op.name + " has inverse " + inv.name, "e", env, function(e) {
    return eq(id,op(e, inv(e)));
  });
}

function commutative(eq, op, env) {
  jsc.property(op.name + " is commutative", "e", env, function(e) {
    return eq(op(e[0],e[1]), op(e[1],e[0]));
  };
}


/******************************************************************************/

exports.Set = function() {
  this.neq = function(e) {
    return !eq(e);
  };
};

exports.setProperties = function(set, env) {
  describe("set properties", function() {

    reflexive(set.eq,env);
    symmetric(set.eq,env);
    transitive(set.eq,env);

    jsc.property("generator makes instances", "e", env, function(e) {
      return set.isInstance(e);
    });

    jsc.property("ofString and stringOf inverses", "e", env, function(e) {
      return set.eq(e, set.ofString(set.stringOf(e)));
    });

    jsc.property("neq works", "e & e", env, function(e) {
      return set.neq(e[0], e[1]) == !set.eq(e[0],e[1]);
    });
  });
};

/******************************************************************************/

exports.Monoid = function() {
  exports.Set.call(this);

  this.isZero = function(e) {
    return eq(e,zero);
  };

  this.isNonZero = function(e) {
    return !eq(e,zero);
  };
};

exports.monoidProperties = function(monoid, env) {
  exports.setProperties(monoid, env);

  describe("monoid properties", function() {
    associative(monoid.eq,monoid.plus, env);
    hasIdentity(monoid.eq,monoid.plus,monoid.zero, env);

    jsc.property("isZero works", "e", env, function(e) {
      return monoid.isZero(e) == monoid.eq(monoid.zero, e);
    });

    jsc.property("isNonZero works", "e", env, function(e) {
      return monoid.isNonZero(e) == !monoid.isZero(e);
    });
  });
};

/******************************************************************************/

exports.Group = function() {
  exports.Monoid.call(this);

  this.minus = function(e1, e2) {
    return plus(e1, neg(e2));
  };
};

exports.groupProperties = function(group, env) {
  exports.monoidProperties(group, env);

  describe("group properties", function() {
    hasInverse(group.eq, group.plus, group.neg, group.zero, env);

    jsc.property("minus works", "e & e", env, function(e) {
      return group.eq(group.minus(e[0], e[1]),
                      group.plus(e[0], group.neg(e[1])));
    });
  });
};

exports.abelianGroupProperties = function(group, env) {
  exports.groupProperties(group, env);

  describe("abelian group properties", function() {
    commutative(group.eq, group.plus, env);
  });
};

/******************************************************************************/

exports.Ring = function() {
  exports.Group.call(this);

  this.div = function (e1, e2) {
    return times(e1, inv(e2));
  };

  this.fromInt = function (i) {
    if (i < 0)  return neg(fromInt(-i));
    if (i == 0) return zero;

    var rest = fromInt(Math.floor(i/2));
    rest = plus(rest,rest);
    return i % 2 == 0 ? rest : plus(one, rest);
  };
};

exports.ringProperties = function(ring, env) {
  exports.abelianGroupProperties(ring, env);

  describe("ring properties", function() {
    throw new Error("not implemented");
  });
}

/******************************************************************************/

exports.PartialOrder = function() {
  this.geq = function (e1, e2) {
    return leq(e2,e1);
  };

  this.lt = function (e1, e2) {
    return !geq(e1,e2);
  };

  this.gt = function (e1, e2) {
    return !leq(e1,e2);
  };

  this.cmp = function (e1, e2) {
    return  eq(e1,e2) ? 0  :
           leq(e1,e2) ? -1 : 1;
  };

  this.minInd = function (es) {
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

  this.maxInd = function (es) {
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

  this.min = function() {
    return arguments[minInd(arguments)];
  };

  this.max = function() {
    return arguments[maxInd(arguments)];
  };
};


exports.OrderedRing = function() {
  exports.Ring.call(this);
  exports.PartialOrder.call(this);

  this.sign = function(e) {
    return eq(e,zero)  ? zero :
           leq(e,zero) ? neg(one) : one;
  };

  this.isNonNeg = function(e) {
    return leq(zero,e);
  };

  this.isPos = function(e) {
    return lt(zero,e);
  };

  this.isNeg = function(e) {
    return lt(e,zero);
  };
};

exports.Module = function() {
  exports.Group.call(this);

  this.sdiv = function(v,s) {
    return smult(s,v);
  };
};

exports.VectorSpace = exports.Module;

exports.InnerProductSpace = function () {
  exports.VectorSpace.call(this);

  this.norm2 = function(e) {
    return dot(e,e);
  };
};

return exports;

});
