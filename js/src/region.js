define(["util"],
function(Util) {
function Region(V) {

var F = V.scalars;
var R = {F: F, V: V};

/*** Documentation ************************************************************/

/** @typedef Location {integer} one of INSIDE, BOUNDARY, or OUTSIDE */

var INSIDE = 1, BOUNDARY = 0, OUTSIDE = -1;

/** @typedef Vector */

/**
 * @typedef Region {Vertex[]}
 *
 * A Region defines a bounded region of the plane.
 * It is stored as a collection of vertices, on the boundary of the region,
 * ordered lexicographically.
 */

/**
 * @typedef Vertex
 * @type {object}
 * @property {Vector}   pos      - the location of the point
 * @property {Edge[]}   outgoing - the edges leading to (lexicographically)
 *                                 SMALLER VERTICES, sorted in slope order,
 *                                 top to bottom
 * @property {Edge[]}   incoming - the edges leading to this vertes from
 *                                 (lexicographically) LARGER VERTICES, sorted
 *                                 in slope order (from bottom to top)
 * @property {Location} isolated - determines whether the area just outside of
 *                                 the vertex is entirely inside the region,
 *                                 entirely outside the region, or on the
 *                                 boundary.
 */

var arbVert = V.arbitrary.smap(
  function(vect) { return {pos: vect, edges: [], isolated: BOUNDARY}; },
  function(vert) { return vert.pos; }
);

/**
 * @typedef Edge
 * @type {object}
 * @property {Vertex}  src     - the larger  end of the edge
 * @property {Vertex}  dst     - the smaller end of the edge
 * @property {boolean} leftIn  - whether the left side of the edge (oriented
 *                               towards dst) is inside the region
 * @property {boolean} rightIn - similar to leftIn
 */

var arbEdge = jsc.compile("{pos: vert, leftIn: bool, rightIn: bool}", {vert: arbVert});

/** functions */

/** @typedef {string} Filename */

/* fromPoly        : Vector[]         -> Region */
/* union           : Region, Region   -> Region */

/* vertices        : Region           -> Vertex[]    */
/* edges           : Region           -> Vertex[2][] */

/* load            : Filename         -> Region */
/* save            : Filename, Region -> void   */

/* checkInvariants : Region           -> void   */
/* example1        :                     Region */

/** searching */

/* @typedef Query */

/* compile : Region -> Query */
/* contains : Query, Vector -> Location */

/** update v.incoming and e.src for all vertices and edges of r */
function addBackEdges(r) {
  for (var i in r) {
    var src = r[i];
    src.incoming = [];
    for (var j in src.outgoing) {
      var edge = src.outgoing[j];
      edge.src = src;
      edge.dst.incoming.push(edge);
    }
  }

  for (var i in r) {
    r[i].incoming.sort(edgePO);
};

/** example ********************************************************************
**
**         _e
**       _╱ ╱
**     _╱  ╱   _g                          ────>  x
**   _╱   ╱   ╱                           │
**  a    d───f                            │
**   ╲ b   _╱   h                         ▽
**    ╲ __╱
**     c                                  y
**
*/

R.example1 = function example1() {

  var a, b, c, d, e, f, g, h;
  a = {pos: V.fromIntPair([0,  0]), isolated: BOUNDARY, incoming: [], outgoing: []};
  b = {pos: V.fromIntPair([1,  1]), isolated: INSIDE,   incoming: [], outgoing: []};
  c = {pos: V.fromIntPair([1,  2]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: c, dst: a, leftIn: false, rightIn: false}]};
  d = {pos: V.fromIntPair([2,  0]), isolated: BOUNDARY, incoming: [], outgoing: []};
  e = {pos: V.fromIntPair([3, -2]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: e, dst: a, leftIn: true,  rightIn: false},
                  {src: e, dst: d, leftIn: false, rightIn: true}]};
  f = {pos: V.fromIntPair([4,  0]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: f, dst: d, leftIn: true,  rightIn: false},
                  {src: f, dst: c, leftIn: false, rightIn: true}]};
  g = {pos: V.fromIntPair([5, -1]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: g, dst: f, leftIn: false, rightIn: false}]};
  h = {pos: V.fromIntPair([5, 1]),  isolated: OUTSIDE,  incoming: [], outgoing: []};

  var result = [a,b,c,d,e,f,g,h];
  addBackEdges(result);

  return result;
};

/** example ********************************************************************
**
** a──────────c
** │          │
** │          d──g
** │          │  │
** │          e──h
** │          │
** b──────────f
**
*/
R.example2 = function() {
  var a, b, c, d, e, f, g, h;

  a = {pos: V.fromIntPair([0, 0]), isolated: BOUNDARY, incoming: [], outgoing: []};
  b = {pos: V.fromintPair([0, 3]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: b, dst: a, leftIn: false, rightIn: true}]};
  c = {pos: V.fromIntPair([3, 0]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: c, dst: a, leftIn: true,  rightIn: false}]};
  d = {pos: V.fromIntPair([3, 1]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: d, dst: c, leftIn: true,  rightIn: false}]};
  e = {pos: V.fromIntPair([3, 2]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: e, dst: d, leftIn: true,  rightIn: true}]};
  f = {pos: V.fromIntPair([3, 3]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: f, dst: e, leftIn: true,  rightIn: false},
                  {src: f, dst: b, leftIn: false, rightIn: true}]};
  g = {pos: V.fromIntPair([4, 1]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: g, dst: d, leftIn: true,  rightIn: false}]};
  h = {pos: V.fromIntPair([4, 2]), isolated: BOUNDARY, incoming: [],
       outgoing: [{src: h, dst: g, leftIn: true,  rightIn: false},
                  {src: h, dst: e, leftIn: false, rightIn: true}]};

  var result = [a,b,c,d,e,f,g,h];
  addBackEdges(result);

  return result;
};

/** Comparators ***************************************************************/

/** compare vertices lexicographically by position */
var vertPO = {
  eq:         function eq(v1, v2)    { return V.eq(v1.pos, v2.pos); },
  arbitrary:  arbVert,
  isInstance: function isInstance(v) { return V.isInstance(v.pos); },
  ofString:   function ofString(s)   { return V.ofString(s); },
  stringOf:   function stringOf(v)   { return V.stringOf(v); },
  leq:        function leq(v1, v2)   { return V.lt(v1.x, v2.x)
                                           || V.eq(v1.x, v2.x) && V.leq(v1.y, v2.y); }
};

/** compare edges by slope of line from src to dst */
var edgePO = {
  eq:         function eq(e1, e2)    { return F.isZero(V.cross(V.minus(e1.dst.pos, e1.src.pos),
                                                               V.minus(e2.dst.pos, e2.src.pos))); },
  arbitrary:  arbEdge,
  isInstance: function isInstance(e) { return vertPO.isInstance(e.dst) && vertPO.isInstance(e.src); },
  ofString:   function ofString(s)   { return {dst: V.ofString(s.substring(2)), leftIn: s[0] == 'I', rightIn: s[1] == 'I'}; },
  stringOf:   function stringOf(e)   { return (e.leftIn  ? 'I' : 'O')
                                            + (e.rightIn ? 'I' : 'O')
                                            + V.stringOf(e.dst); },
  leq:        function leq(e1, e2)   { return F.leq(V.cross(V.minus(e1.dst.pos,e1.src.pos),
                                                            V.minus(e2.dst.pos,e2.src.pos), F.zero); }
};

/** create a region representing a simple polygon, given as a list of points in
 *  clockwise order around the boundary.
 */
R.ofPoly = function ofPoly(points) {
  var result = points.map(function (p) { return pos: p, isolated: BOUNDARY, outgoing: [] };

  for (var i in result) {
    here = result[i];
    next = result[(i+1)%result.length];
    if (vertPO.leq(here, next))
      next.outgoing.push({dst: here, leftIn:  true, rightIn: false});
    else
      here.outgoing.push({dst: next, leftIn: false, rightIn:  true});
  }

  for (var i in result)
    result[i].outgoing.sort(edgePO(result[i].pos).cmp);

  result.sort(vertPO.cmp);
  addBackEdges(result);

  return result;
};

R.ofString = function ofString(s) {
  // TODO: handle cycles
  return JSON.parse(s, function (k,v) {
    return k == "pos" ? V.ofString(v) : v;
  });
};

R.stringOf = function stringOf(r) {
  // TODO: handle cycles
  return JSON.stringify(r, function(k, v) {
    return k == "pos" ? V.stringOf(v) : v;
  });
};

R.copy = function copy(r) {
  var updated = new buckets.MultiDictionary(vertexPO.stringOf, vertexPO.eq);
  var result  = [];
  for (var i in r) {
    var newv = {pos:      r[i].pos,
                isolated: r[i].isolated,
                outgoing: r[i].outgoing.map(function (e) { return
                          {dst: updated.get(e.dst), leftIn: e.leftIn, rightIn: e.rightIn}; }),
                incoming: []
               };
    updated.set(r[i],newv);
    result.push(newv);
  }
  addBackEdges(result);

  return result;
};

/** a copy of r with all low-dimensional features removed */
R.regularize = function regularize(r) {
  var r = R.copy(r);

  // remove low-d edges
  for (var i in r) {
    r[i].outgoing = r[i].outgoing.filter(function (e) { return e.leftIn != e.rightIn; });
    r[i].incoming = r[i].incoming.filter(function (e) { return e.leftIn != e.rightIn; });
  }

  // remove isolated vertices
  return r.filter(function (v) { return v.incoming.length > 0 || v.outgoing.length > 0; });
};

/** a copy of r with adjacent colinear edges merged */
R.merge = function merge(r) {
  throw new Error("not implemented");
};

/** a copy of r with all vertices translated by offset */
R.translate = function translate(r, offset) {
  var result = R.copy(r);

  for (var i in r)
    r[i].pos = V.plus(r[i].pos, offset);

  return result;
};

return R;

}

return Util.memoize(Region);

});

