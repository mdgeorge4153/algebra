define(["pQueue", "numbers/integers", "lib/jsverify", "propertyWrapper"],
function(PQueue,   C,                  jsc,            property) {

/** A jsc environment for constructing test cases */
var env = {
  "ops"   : jsc.array(jsc.either(jsc.unit, C.arbitrary)),
  "e"     : C.arbitrary,
  "empty" : jsc.unit.smap
};

/** apply a sequence of operations to the given queue and return it. */
function applyOps(pq, opList) {
  for (var i = 0; i < opList.length; i++)
    opList[i].either(pq.remove.bind(pq), pq.add.bind(pq));
  return pq;
}

/** apply a sequence of operations ot an empty queue. */
function buildQueue(opList) {
  return applyOps(new PQueue(C), opList);
}

/** Sort the array */
function sort(a) {
  return a.sort(C.cmp);
}

/** Check a1 and a2 for equality as lists */
function arrayEqOrdered(a1, a2) {
  if (a1.length != a2.length)
    return false;
  for (var i = 0; i < a1.length; i++)
    if (C.neq(a1[i], a2[i])) return false;
  return true;
}

/** Check a1 and a2 for equality as multisets */
function arrayEqUnordered(a1, a2) {
  return arrayEqOrdered(sort(a1), sort(a2));
}

/** Test that the given operation doesn't change a queue */
function nonchanging(f) {
  property(f.name + " doesn't change queue", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    var before = pq.elements();
    f.call(pq);
    return arrayEqUnordered(pq.elements(), before);
  });
}

describe("Priority Queue: ", function() {
  // constr
  // add
  // remove
  // poll
  // isEmpty
  // size
  // elements
  // invariant

  property("modifying elements preserves queue", "ops & array e", env, function(args) {
    var pq        = buildQueue(args[0]);
    var elems     = pq.elements();
    var elemsCopy = pq.elements().slice();

    for (var i = 0; i < elems.length || i < args[1].length; i++)
      elems[i] = args[1][i];

    return arrayEqUnordered(pq.elements(), elemsCopy);
  });

  property("modifying queue preserves elements", "ops & ops", env, function(args) {
    var pq    = buildQueue(args[0]);
    var elems = pq.elements();
    var copy  = elems.slice();

    applyOps(pq, args[1]);

    return arrayEqOrdered(elems, copy);
  });

  property("empty -> add* -> remove*", "array e", env, function(es) {
    var pq = new PQueue(C);
    for (var i = 0; i < es.length; i++)
      pq.add(es[i]);
    var result = [];
    while (!pq.isEmpty())
      result.push(pq.remove());

    return arrayEqOrdered(sort(es), result);
  });

  property("arb   -> add", "ops & e", env, function(args) {
    var pq = buildQueue(args[0]);
    var es = pq.elements().slice();

    pq.add(args[1]);
    es.push(args[1]);

    return arrayEqUnordered(es, pq.elements());
  });

  property("empty -> elements", function() {
    return arrayEqOrdered(new PQueue(C).elements(), []);
  });

  property("arb   -> remove*", "ops", env, function(ops) {
    var pq   = buildQueue(ops);
    var orig = pq.elements().slice();

    var result = [];
    while (!pq.isEmpty())
      result.push(pq.remove());

    return arrayEqOrdered(sort(orig), result);
  });

  property("empty -> remove", function() {
    var pq = new PQueue(C);
    var result = pq.remove();
    return result == undefined && pq.isEmpty() && pq.invariant();
  });

  property("arb   -> isEmpty", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    return pq.isEmpty() == arrayEqOrdered(pq.elements(), []);
  });

  property("empty -> isEmpty", function() {
    return new PQueue(C).isEmpty();
  });

  property("arb   -> size", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    return pq.size() == pq.elements().length;
  });

  property("arb   -> invariant", "ops", env, function(ops) {
    return buildQueue(ops).invariant();
  });

  property("empty -> invariant", function() {
    return new PQueue(C).invariant();
  });

  property("arb -> poll", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    return pq.isEmpty() || C.eq(pq.poll(), pq.remove());
  });

  nonchanging(PQueue.prototype.poll);
  nonchanging(PQueue.prototype.isEmpty);
  nonchanging(PQueue.prototype.size);
  nonchanging(PQueue.prototype.elements);
  nonchanging(PQueue.prototype.invariant);
});

});

