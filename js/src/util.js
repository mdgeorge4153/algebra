define(["lib/buckets"],
function(buckets) {

/** Priority queue ************************************************************/

/** @constructor */
function PrioritySet(PO) {
  this._heap  = new buckets.PriorityQueue(PO.cmp);
  this._index = new buckets.Dictionary(PO.toString, PO.eq);
}

/**
 * If this[val] does not exist, set it to val.
 * @return this[val].
 */
PQWithLookup.prototype.findOrAdd = function findOrAdd(val) {
  if (this._index.containsKey(val))
    return this._index.get(val);

  this._heap.add(val);
  this._index.add(val, val);
  return val;
};

/** remove and return the smallest value, or undefined if this is empty. */
PQWithLookup.prototype.dequeue = function dequeue() {
  if (this.isEmpty())
    return undefined;

  var result = this._heap.dequeue();
  this._index.remove(result);
  return result;
};

/** return true if this is empty */
PQWithLookup.prototype.isEmpty = function isEmpty(obj) {
  return this._heap.isEmpty();
};

/** throw an exception if this is malformed */
PQWithLookup.prototype.checkInvariant = function invariant() {
  if (this._heap.size() != this._index.size())
    throw new Error("malformed PrioritySet: index and heap have different sizes");

  this._index.forEach(function (key, value) {
    if (key != value) throw new Error("malformed PrioritySet: index[val] != val");
    if (!this._heap.contains(key)) throw new Error("malformed PrioritySet: index has element that is not in heap.");
  });

  var heapContents = this._heap.toArray();
  for (var i in heapContents)
    for (var j in heapContents)
      if (this._PO.eq(heapContents[i], heapContents[j]) && i != j)
        throw new Error("malformed PrioritySet: heap contains duplicates");
};


/** memoize *******************************************************************/

function memoize(f) {
  var memoTable = {};

  return function (x) {
    if (x in memoTable)
      return memoTable[x];
    var result = f(x);
    memoTable[x] = result;
    return result;
  };
}

return {
  PrioritySet: PrioritySet,
  memoize:     memoize
};

});
