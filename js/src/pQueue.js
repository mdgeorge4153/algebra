/**
 * Priority queue implementation (smallest priority removed first).
 * @module pQueue
 */
define([],
function() {

function left(i) {
  return 2*i+1;
}

function right(i) {
  return 2*i + 2;
}

function par(i) {
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
PQueue.prototype.add = function add(e) {
  var i = this.impl.length;
  this.impl.length = i + 1;
  this.impl[i] = e;

  // invariant: impl[i] == e
  while (i != 0 && this.C.gt(this.impl[par(i)], this.impl[i])) {
    this.impl[i] = this.impl[par(i)];
    i = par(i);
    this.impl[i] = e;
  }
};

/** Remove and return the element with the minimum priority.  Returns undefined
 *  if the queue is empty.
 */
PQueue.prototype.remove = function remove() {
  if (this.impl.length == 0) return undefined;

  var result = this.impl[0];

  var bubble = this.impl[this.impl.length-1];
  this.impl.length = this.impl.length - 1;

  if (this.impl.length == 0) return result;

  // invariant: impl[i] = bubble
  var i   = 0;
  this.impl[i] = bubble;
  while (true) {
    switch(this.C.minInd([this.impl[i],this.impl[left(i)],this.impl[right(i)]])) {
      case 0: return result;
      case 1: this.impl[i] = this.impl[left(i)];  i = left(i);  this.impl[i] = bubble; break;
      case 2: this.impl[i] = this.impl[right(i)]; i = right(i); this.impl[i] = bubble; break;
      default: throw new Error("this shouldn't happen");
    }
  }
};

/** Return smallest priority element, or undefined if the queue is empty */
PQueue.prototype.poll = function poll() {
  return this.impl[0];
};

/** Return true if the queue is empty */
PQueue.prototype.isEmpty = function isEmpty() {
  return this.impl.length == 0;
};

/** Return the number of elements in the queue */
PQueue.prototype.size = function size() {
  return this.impl.length;
};

/** Return the elements in an unspecified order. */
PQueue.prototype.elements = function elements() {
  return this.impl.slice();
};

/** Return true if this satisfies its invariants. */
PQueue.prototype.invariant = function invariant() {
  for (var i = 0; i < this.impl.length; i++)
    if (this.C.minInd([this.impl[i], this.impl[left(i)], this.impl[right(i)]]) != 0)
      return false;
  return true;
};

return PQueue;

});


