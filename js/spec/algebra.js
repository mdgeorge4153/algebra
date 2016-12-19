define(["lib/jsverify"],
function(jsc) {

var exports = {};

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

function antisymmetric(eq, op, env) {
  jsc.property(op.name + " is antisymmetric", "e & e", env, function(e) {
    return op(e[0],e[1]) && op(e[1],e[0]) ? eq(e[0],e[1]) : true;
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
  });
}

function hasIdentity(eq, op, id, env) {
  jsc.property(op.name + " has identity", "e", env, function(e) {
    return eq(e, op(e, id)) && eq(e, op(id, e));
  });
}

function hasInverse(eq, op, inv, id, env) {
  jsc.property(op.name + " has inverse " + inv.name, "e", env, function(e) {
    return eq(id,op(e, inv(e)));
  });
}

function commutative(eq, op, env) {
  jsc.property(op.name + " is commutative", "e", env, function(e) {
    return eq(op(e[0],e[1]), op(e[1],e[0]));
  });
}

function hasInverseIf(eq, op, inv, id, condition, env) {
  jsc.property(op.name + " has an inverse " + inv.name + " if " + condition.name,
               "e", env, function(e) {
    return condition(e) ? eq(id, op(e, inv(e))) : true;
  });
}

function total(eq, op, env) {
  jsc.property(op.name + " is total", "e & e", function(e) {
    return eq(e[0], e[1]) || op(e[0], e[1]) || op(e[1], e[0]);
  });
}

/******************************************************************************/

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

/******************************************************************************/

exports.abelianGroupProperties = function(group, env) {
  exports.groupProperties(group, env);

  describe("abelian group properties", function() {
    commutative(group.eq, group.plus, env);
  });
};

/******************************************************************************/

exports.ringProperties = function(ring, env) {
  exports.abelianGroupProperties(ring, env);

  describe("ring properties", function() {
    associative(ring.eq, ring.times,                env);
    hasIdentity(ring.eq, ring.times, ring.one,      env);
    distributesOver(ring.eq, ring.times, ring.plus, env);
    hasInverseIf(ring.eq, ring.times, ring.inv. ring.one, ring.isUnit, env);

    jsc.property("div works", "e & e", function() {
      return ring.isUnit(e[1]) ? ring.eq(ring.div(e[0],e[1]),
                                         ring.times(e[0], ring.inv(e[1])))
                               : true;
    });

    jsc.property("fromInt works", "integer", function(n) {
      var neg = n < 0;
      var expected = ring.zero;

      if (neg) {
        for (int i = 0; i < n; i++)
          expected = ring.minus(expected, ring.one);
        expected = ring.neg(expected)
      }
      else {
        for (int i = 0; i < n; i++)
          expected = ring.plus(expected, ring.one);
      }

      return ring.eq(ring.fromInt(n), expected);
    });
  });
};

/******************************************************************************/

exports.commutativeRingProperties = function(ring, env) {
  exports.ringProperties(ring, env);

  describe("commutative ring properties", function() {
    commutative(ring.eq, ring.times);
  });
};

/******************************************************************************/

exports.fieldProperties = function(field, env) {
  exports.commutativeRingProperties(field, env);

  describe("field properties", function() {
    hasInverseIf(field.eq, field.times, field.inv, field.one, field.isNonZero, env);
  });
};

/******************************************************************************/

exports.partialOrderProperties = function(po, env) {
  exports.setProperties(po, env);

  describe("partial order properties", function() {
    reflexive(po.eq,     po.leq, env);
    transitive(po.eq,    po.leq, env);
    antisymmetric(po.eq, po.leq, env);

    jsc.property("lt works", "e & e", env, function(e) {
      return po.leq(e[0], e[1]) == po.lt(e[0], e[1]) || po.eq(e[0], e[1]);
    });

    jsc.property("geq works", "e & e", env, function(e) {
      return po.geq(e[0], e[1]) == po.leq(e[1], e[0]);
    });

    jsc.property("gt works", "e & e", env, function(e) {
      return po.geq(e[0], e[1]) == po.gt(e[0], e[1]) || po.eq(e[0], e[1]);
    });

    jsc.property("cmp works", "e & e", env, function(e) {
      return ((po.cmp(e[0], e[1])  < 0) == (po.lt(e[0], e[1])))
          && ((po.cmp(e[0], e[1]) == 0) == (po.eq(e[0], e[1])))
          && ((po.cmp(e[0], e[1])  > 0) == (po.gt(e[0], e[1])));
    });

    jsc.property("min is in array", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("min is smallest", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("max is in array", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("max is biggest", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("minInd is in array", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("minInd is smallest", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("maxInd is in array", "array e", env, function(es) {
      throw new Error("not implemented");
    });

    jsc.property("maxInd is biggest", "array e", env, function(es) {
      throw new Error("not implemented");
    });
  });
};

/******************************************************************************/

exports.totalOrderProperties = function(order, env) {
  exports.partialOrderProperties(order, env);

  total(order.eq, order.leq, env);
}

return exports;

});

