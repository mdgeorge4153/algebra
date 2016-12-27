/**
 * Priority queue implementation (smallest priority removed first).
 * @module pQueue
 */
define([],
function() {

var left = function(i) {
  return 2*i+1;
}

var right = function(i) {
  return 2*i + 2;
}

var par = function(i) {
  return Math.floor((i-1)/2);
}

/**
 * @constructor
 * @param {PartialOrder} comparator
 * @alias module:pQueue
 */
function PQueue(priorityOrder) {
  this.impl = [];
  this.C    = priorityOrder;
};

/** Add an element */
PQueue.prototype.add = function(e) {
  var i = impl.length;
  impl.length = i + 1;
  impl[i] = e;

  // invariant: impl[i] == e
  while (i != 0 && C.gt(impl[parent(i)], impl[i])) {
    impl[i] = impl[parent(i)];
    i = parent(i);
    impl[i] = e;
  }
};

/** Remove and return the element with the minimum priority.  Returns undefined
 *  if the queue is empty.
 */
PQueue.prototype.remove = function() {
  var result = impl[0];

  var bubble = impl[impl.length-1];
  impl.length = impl.length - 1;

  // invariant: impl[i] = bubble
  var i   = 0;
  impl[i] = bubble;
  while (true) {
    switch(C.minInd([impl[i],impl[left(i)],impl[right(i)]])) {
      case 0: return;
      case 1: impl[i] = impl[left(i)];  i = left(i);  impl[i] = bubble; break;
      case 1: impl[i] = impl[right(i)]; i = right(i); impl[i] = bubble; break;
    }
  }
};

/** Return smallest priority element, or undefined if the queue is empty */
PQueue.prototype.poll = function() {
  return this.impl[0];
};

/** Return true if the queue is empty */
PQueue.prototype.isEmpty = function() {
  return impl.length == 0;
};

/** Return the number of elements in the queue */
PQueue.prototype.size = function() {
  return impl.length;
};

/** Return the elements in an unspecified order. */
PQueue.prototype.elements = function() {
  return impl.slice();
};

/** Return true if this satisfies its invariants. */
PQueue.prototype.invariant = function() {
  for (var i in this.impl)
    if (C.minInd(impl[i], impl[left(i)], impl[right(i)]) != 0)
      return false;
  return true;
};

});


