define(["pQueue", "numbers/integers", "lib/jsverify"],
function(PQueue,   Integers,           jsc) {

/** A jsc environment for constructing test cases */
var env = {
  "ops"   : jsc.array(jsc.either(jsc.unit, Integers.arbitrary)),
  "e"     : Integers.arbitrary,
  "empty" : jsc.unit.smap
};

/** Sort the array */
function sort(a) {
  return a.sort(Integers.cmp);
}

/** Check a1 and a2 for equality as lists */
function arrayEqOrdered(a1, a2) {
  if (a1.length != a2.length)
    return false;
  for (var i in a1)
    if (Integers.neq(a1[i], a2[i])) return false;
  return true;
}

/** Check a1 and a2 for equality as multisets */
function arrayEqUnordered(a1, a2) {
  return arrayEqOrdered(sort(a1), sort(a2));
}

/** apply a sequence of operations to the given queue and return it. */
function applyOps(pq, opList) {
  for (var i in opList)
    opList[i].either(pq.remove, pq.add);
  return pq;
}

/** apply a sequence of operations ot an empty queue. */
function buildQueue(opList) {
  return applyOps(new PQueue(), opList);
}

/** Test that the given operation doesn't change a queue */
function nonchanging(f) {
  jsc.property(f.name + " doesn't change queue", "ops", function(ops) {
    var pq = buildQueue(ops);
    var before = pq.elements();
    f.call(pq);
    return arrayEqUnordered(pq.elements(), before);
  });
}

describe("Priority Queue", function() {
  // constr
  // add
  // remove
  // poll
  // isEmpty
  // size
  // elements
  // invariant

  jsc.property("modifying elements preserves queue", "ops & array e", env, function(args) {
    var pq        = buildQueue(args[0]);
    var elems     = pq.elements();
    var elemsCopy = pq.elements().slice();

    for (var i = 0; i < elems.length || i < args[1].length; i++)
      elems[i] = args[1][i];

    return arrayEqUnordered(pq.elements(), elemsCopy);
  });

  jsc.property("modifying queue preserves elements", "ops & ops", env, function(args) {
    var pq = buildQueue(args[0]);
    var oldElems = pq.elements().slice();
    applyOps(pq, args[1]);

    return arrayEqUnordered(oldElems, pq.elements());
  });

  jsc.property("empty -> add* -> remove*", "array e", env, function(es) {
    var pq = new PQueue();
    for (var i in es)
      pq.add(es[i]);
    var result = [];
    while (!pq.isEmpty())
      result.push(pq.remove());

    return arrayEqOrdered(sort(es), result);
  });

  jsc.property("arb   -> add", "oplist & e", env, function(args) {
    var pq = buildQueue(args[0]);
    var es = pq.elements().slice();

    pq.add(args[1]);
    es.push(args[1]);

    return arrayEqUnordered(es, pq.elements());
  });

  jsc.property("empty -> elements", function() {
    return arrayEqOrdered(new PQueue().elements(), []);
  });

  jsc.property("arb   -> remove*", "oplist", env, function(ops) {
    var pq   = buildQueue(ops);
    var orig = pq.elements().slice();

    var result = [];
    while (!pq.isEmpty())
      result.push(pq.remove());

    return arrayEqOrdered(sort(orig), result);
  });

  jsc.property("empty -> remove", function() {
    var pq = new PQueue();
    var result = pq.remove();
    return result == undefined && pq.isEmpty() && pq.invariant();
  });

  jsc.property("arb   -> isEmpty", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    return pq.isEmpty() == arrayEqOrdered(pq.elements(), []);
  });

  jsc.property("empty -> isEmpty", function() {
    return new PQueue().isEmpty();
  });

  jsc.property("arb   -> size", "ops", env, function(ops) {
    var pq = buildQueue(ops);
    return pq.size() == pq.elements().length;
  });

  jsc.property("arb   -> invariant", "ops", env, function(ops) {
    return buildQueue(ops).invariant();
  });

  jsc.property("empty -> invariant", function() {
    return new PQueue().invariant();
  });

  jsc.property("arb -> poll", "ops", function() {
    var pq = buildQueue(ops);
    return arrayEqOrdered([pq.poll()], [pq.remove()]);
  });

  nonchanging(poll);
  nonchanging(isEmpty);
  nonchanging(size);
  nonchanging(elements);
  nonchanging(invariant);
});

});

