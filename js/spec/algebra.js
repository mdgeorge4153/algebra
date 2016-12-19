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
    throw new Error("not implemented");
  });
};

return exports;

});

