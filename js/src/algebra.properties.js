define(["lib/jsverify", "algebra"],
function(jsc, Algebra) {

var exports = {};

/** Helpers *******************************************************************/

function name(op) {
  return op.name.replace("bound", "");
}

function env(set) {
  return {
    'e': set.arbitrary,
    's': set.scalars != undefined ? set.scalars.arbitrary : undefined
  };
}

function hasType(set, result, type) {
  // TODO: this could be less special-purpose
  var result;
  if (type == "e")
    result = set.isInstance(result);
  else if (type == "s")
    result = set.scalars.isInstance(result);
  else
    result = typeof result == type;

  if (!result)
    console.log("hasType(" + set + ", " + result + ", " + type + ") returns false");

  return result;
}
  

/** Generalized properties ****************************************************/

function reflexive(set, op) {
  jsc.property(name(op) + " is reflexive", "e", env(set), function(e) {
    return op(e,e);
  });
}

function symmetric(set, op) {
  jsc.property(name(op) + " is symmetric", "e & e", env(set), function(e) {
    return op(e[0],e[1]) == op(e[1],e[0]);
  });
}

function antisymmetric(set, op) {
  jsc.property(name(op) + " is antisymmetric", "e & e", env(set), function(e) {
    return op(e[0],e[1]) && op(e[1],e[0]) ? set.eq(e[0],e[1]) : true;
  });
}

function transitive(set, op) {
  jsc.property(name(op) + " is transitive", "e & e & e", env(set), function(e) {
    return op(e[0],e[1]) && op(e[1], e[2]) ? op(e[0], e[2]) : true;
  });
}

function hasFunctionType(set, op, argsType, returnType) {
  if (argsType.indexOf("&" == -1))
    argsType = argsType + " & unit";

  jsc.property(name(op) + " returns type " + returnType, argsType, env(set), function(args) {
    return hasType(set, op.apply(null, args), returnType);
  });
}

function hasTypeOrThrows(set, op, argsType, returnType) {
  if (argsType.indexOf("&" == -1))
    argsType = argsType + " & unit";

  jsc.property(name(op) + " returns type " + returnType, argsType, env(set), function(args) {
    try {
      return hasType(set, op.apply(null, args), returnType);
    } catch(err) {
      return true;
    }
  });
}

function hasPropertyType(set, name, type) {
  jsc.property(name + " has type " + type, function() {
    return hasType(set, set[name], type);
  });
}

function isEquivalentTo(set, op, argsType, retType, specFun) {
  if (argsType.indexOf("&" == -1))
    argsType = argsType + " & unit";

  jsc.property(name(op) + " works", argsType, env(set), function(args) {
    var result = op.apply(null, args);
    var expected = specFun.apply(null, args);

    if (retType == 'e')
      return set.eq(result, expected);
    else if (retType == 's')
      return set.scalars.eq(result, expected);
    else
      return result == expected;
  });
}

function associative(set, op) {
  jsc.property(name(op) + " is associative", "e & e & e", env(set), function(e) {
    return set.eq(op(e[0], op(e[1], e[2])), op(op(e[0], e[1]), e[2]));
  });
}

function hasIdentity(set, op, id) {
  jsc.property(name(op) + " has identity", "e", env(set), function(e) {
    return set.eq(e, op(e, id)) && set.eq(e, op(id, e));
  });
}

function hasInverse(set, op, inv, id) {
  jsc.property(name(op) + " has inverse " + name(inv), "e", env(set), function(e) {
    return set.eq(id,op(e, inv(e)));
  });
}

function commutative(set, op) {
  jsc.property(name(op) + " is commutative", "e & e", env(set), function(e) {
    return set.eq(op(e[0],e[1]), op(e[1],e[0]));
  });
}

function hasInverseIf(set, op, inv, id, condition) {
  jsc.property(name(op) + " has an inverse " + name(inv) + " if " + name(condition),
               "e", env(set), function(e) {
    return condition(e) ? set.eq(id, op(e, inv(e))) : true;
  });
}

function distributesOver(set, op1, op2) {
  jsc.property(name(op1) + " distributes over " + name(op2), "e & e & e", env(set), function(e) {
    return set.eq(op1(e[0], op2(e[1], e[2])), op2(op1(e[0], e[1]), op1(e[0], e[2])));
  });
}


/******************************************************************************/

exports.setProperties = function(set) {
  describe("set properties:", function() {

    // checks that set.arbitrary returns elements by passing them to the identity function
    hasFunctionType(set, function arbitrary(e) { return e; }, "e", "e");

    hasFunctionType(set, set.eq,         "e & e",  "boolean");
    hasFunctionType(set, set.isInstance, "e",      "boolean");
    hasFunctionType(set, set.stringOf,   "e",      "string");

    reflexive(set,  set.eq);
    symmetric(set,  set.eq);
    transitive(set, set.eq);

    jsc.property("ofString and stringOf inverses", "e", env(set), function(e) {
      return set.eq(e, set.ofString(set.stringOf(e)));
    });

    isEquivalentTo(set, set.neq, "e & e", "boolean", Algebra.Set.neq.value.bind(set));
  });
};

/******************************************************************************/

exports.partialOrderProperties = function(po) {
  exports.setProperties(po);

  describe("partial order properties:", function() {
    hasFunctionType(po, po.leq,    "e & e",   "boolean");

    // TODO
    // hasFunctionType(po, po.min,    "e & e",   "e");
    // hasFunctionType(po, po.max,    "e & e",   "e");

    reflexive(po,     po.leq);
    transitive(po,    po.leq);
    antisymmetric(po, po.leq);

    isEquivalentTo(po, po.geq,    "e & e",   "boolean", Algebra.PartialOrder.geq.value.bind(po));
    isEquivalentTo(po, po.lt,     "e & e",   "boolean", Algebra.PartialOrder.lt.value.bind(po));
    isEquivalentTo(po, po.gt,     "e & e",   "boolean", Algebra.PartialOrder.gt.value.bind(po));
    isEquivalentTo(po, po.cmp,    "e & e",   "number",  Algebra.PartialOrder.cmp.value.bind(po));
    isEquivalentTo(po, po.minInd, "array e", "number",  Algebra.PartialOrder.minInd.value.bind(po));
    isEquivalentTo(po, po.maxInd, "array e", "number",  Algebra.PartialOrder.maxInd.value.bind(po));

    // TODO
    // jsc.property("max is in array", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });

    // jsc.property("max is biggest", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });

    // jsc.property("minInd is in array", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });

    // jsc.property("minInd is smallest", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });

    // jsc.property("maxInd is in array", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });

    // jsc.property("maxInd is biggest", "array e", env, function(es) {
    //   throw new Error("not implemented");
    // });
  });
};

/******************************************************************************/

exports.totalOrderProperties = function(order) {
  exports.partialOrderProperties(order);

  describe("total order properties:", function() {
    jsc.property("leq is total", "e & e", env(order), function(e) {
      return order.leq(e[0], e[1]) || order.leq(e[1], e[0]);
    });
  });
}

/******************************************************************************/

exports.monoidProperties = function(monoid) {
  exports.setProperties(monoid);

  describe("monoid properties:", function() {
    hasFunctionType(monoid, monoid.plus, "e & e", "e");
    hasPropertyType(monoid, "zero", "e");

    associative(monoid,monoid.plus);
    hasIdentity(monoid,monoid.plus,monoid.zero);

    isEquivalentTo(monoid, monoid.isZero,    "e", "boolean", Algebra.Monoid.isZero.value.bind(monoid));
    isEquivalentTo(monoid, monoid.isNonZero, "e", "boolean", Algebra.Monoid.isNonZero.value.bind(monoid));
  });
};

/******************************************************************************/

exports.groupProperties = function(group) {
  exports.monoidProperties(group);

  describe("group properties:", function() {
    hasFunctionType(group, group.neg, "e", "e");

    hasInverse(group, group.plus, group.neg, group.zero);

    isEquivalentTo(group, group.minus, "e & e", "e", Algebra.Group.minus.value.bind(group));
  });
};

/******************************************************************************/

exports.abelianGroupProperties = function(group) {
  exports.groupProperties(group);

  describe("abelian group properties:", function() {
    commutative(group, group.plus);
  });
};

/******************************************************************************/

exports.ringProperties = function(ring) {
  exports.abelianGroupProperties(ring);

  describe("ring properties:", function() {
    hasPropertyType(ring, "one", "e");
    hasFunctionType(ring, ring.times,  "e & e", "e");
    hasTypeOrThrows(ring, ring.inv,    "e", "e");
    hasFunctionType(ring, ring.isUnit, "e", "boolean");

    associative(ring,     ring.times);
    hasIdentity(ring,     ring.times, ring.one);
    distributesOver(ring, ring.times, ring.plus);
    hasInverseIf(ring,    ring.times, ring.inv, ring.one, ring.isUnit);

    jsc.property("div works", "e & e", env(ring), function(e) {
      return ring.isUnit(e[1])
        ? ring.eq(ring.div(e[0], e[1]), ring.times(e[0], ring.inv(e[1])))
        : true;
    });

    jsc.property("fromInt works (positive)", "nat", function(n) {
      var expected = ring.zero;
      for (var i = 0; i < n; i++)
        expected = ring.plus(expected, ring.one);

      return ring.eq(ring.fromInt(n), expected);
    });

    jsc.property("fromInt works (negative)", "nat", function(n) {
      var expected = ring.zero;
      for (var i = 0; i < n; i++)
        expected = ring.minus(expected, ring.one);

      return ring.eq(ring.fromInt(-n), expected);
    });
  });
};

/******************************************************************************/

exports.commutativeRingProperties = function(ring) {
  exports.ringProperties(ring);

  describe("commutative ring properties:", function() {
    commutative(ring, ring.times);
  });
};

/******************************************************************************/

exports.euclideanRingProperties = function(ring) {
  exports.commutativeRingProperties(ring);

  describe("euclidean ring properties:", function() {
    jsc.property("a = quot(a,b)b + rem(a,b)", "e & e", env(ring), function (e) {
      return ring.isNonZero(e[1])
           ? ring.eq(e[0], ring.plus(ring.times(ring.quot(e[0],e[1]), e[1]), ring.rem(e[0],e[1])))
           : true;
    });

    jsc.property("remainder reduces degree", "e & e", env(ring), function (e) {
      if (ring.isZero(e[1])) return true;

      var r = ring.rem(e[0], e[1]);
      return ring.isNonZero(r) ? ring.degree(r) < ring.degree(e[1]) : true;
    });

    jsc.property("degree is monotonic", "e & e", env(ring), function (e) {
      return ring.isNonZero(e[0]) && ring.isNonZero(e[1])
           ? ring.degree(e[0]) <= ring.degree(ring.times(e[0],e[1]))
           : true;
    });

    jsc.property("gcd is a common divisor", "e & e", env(ring), function (e) {
      var g = ring.gcd(e[0], e[1]);
      throw new Error("TODO: not sure how to tell if g | e0 in arb. euclidean domain");
    });

    jsc.property("gcd is the greatest divisor", "e & e & e", env(ring), function (e) {
      throw new Error("TODO");
    });

    jsc.property("bezout coefficients correct", "e & e", env(ring), function(e) {
      var c = ring.bezout(e[0], e[1]);
      return ring.eq(ring.gcd(e[0],e[1]),
                     ring.plus(ring.times(c[0], e[0]), ring.times(c[1], e[1])));
    });

    jsc.property("reduce preserves quotient", "e & e", env(ring), function(e) {
      if (ring.isZero(e[1])) return true;
      var f = ring.reduce(e[0], e[1]);
      return ring.eq(ring.times(e[0], f[1]), ring.times(f[0], e[1]));
    });
  });
};

/******************************************************************************/

exports.fieldProperties = function(field) {
  exports.commutativeRingProperties(field);

  describe("field properties:", function() {
    hasInverseIf(field, field.times, field.inv, field.one, field.isNonZero);
  });
};

/******************************************************************************/

exports.orderedRingProperties = function(or) {
  exports.commutativeRingProperties(or);
  exports.totalOrderProperties(or);

  describe('ordered ring properties:', function() {
    jsc.property("addition is monotonic", "e & e & e", env(or), function(e) {
      return or.leq(e[0], e[1])
           ? or.leq(or.plus(e[0], e[2]), or.plus(e[1], e[2]))
           : true;
    });
  
    jsc.property("multiplying positives gives positives", "e & e", env(or), function(e) {
      return or.isNonNeg(e[0]) && or.isNonNeg(e[1])
           ? or.isNonNeg(or.times(e[0], e[1]))
           : true;
    });
  });
}

/******************************************************************************/

exports.orderedFieldProperties = function(of) {
  exports.orderedRingProperties(of);
  exports.fieldProperties(of);

  describe("ordered field properties", function () {
    hasFunctionType(of, of.toNumber, "e", "number");

    jsc.property("one is 1", function() {
      return of.toNumber(of.one) == 1;
    });

    jsc.property("zero is 0", function() {
      return of.toNumber(of.zero) == 0;
    });

    // TODO: what other properties need toNumber satisfy?
    // TODO: perhaps there is a concise way to say "everything you can do with
    //       numbers, you can do with this as well, and get the same answers.
  });
}

/******************************************************************************/

return exports;

});

