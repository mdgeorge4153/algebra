define(["util"],
function(Util) {
function Region(V) {

var F = V.F;
var R = {F: F, V: V};

var INSIDE = 1, BOUNDARY = 0, OUTSIDE = -1;

/*******************************************************************************
** A Region defines a bounded region of the plane.
**
** It is stored as a list of vertices on the boundary, ordered
** lexicographically.  Each vertex contains a list of the edges CONNECTED TO
** PREVIOUS VERTICES.  These edges are sorted in slope order, from top to
** bottom.
**
*/

/** example ********************************************************************
**
**         _e
**       _/#/
**     _/##/    _g                          ---->   x
**   _/###/    /                           |
**  a####d----f                            |
**   \#b#####/                             V
**    \###/
**     c/                                  y
**
*/

R.example1 = function example1() {
  var a = V.fromPair([0,  0]); var b = V.fromPair([1, 1]);
  var c = V.fromPair([1,  2]); var d = V.fromPair([2, 0]);
  var e = V.fromPair([3, -2]); var f = V.fromPair([4, 0]);
  var g = V.fromPair([5, -1]);

  var result = [
    {pos: a, edges: [], isolated:BOUNDARY},
    {pos: b, edges: [], isolated:INSIDE},
    {pos: c, edges: [{dst: 0, leftIn: false, rightIn: true}],
                        isolated:BOUNDARY},
    {pos: d, edges: [], isolated:BOUNDARY},
    {pos: e, edges: [{dst: 0, leftIn: true,  rightIn: false},
                     {dst: 3, leftIn: false, rightIn: true}],
                        isolated:BOUNDARY},
    {pos: f, edges: [{dst: 3, leftIn: true,  rightIn: false},
                     {dst: 2, leftIn: false, rightIn: true}],
                        isolated:BOUNDARY},
    {pos: g, edges: [{dst: 5, leftIn: false, rightIn: false}],
                        isolated:BOUNDARY}
  ];

  var offset = V.sdiv(V.fromPair([5, 0]), F.fromInt(2));

  for (var i = 0; i < result.length; i++)
    result[i].pos = V.minus(result[i].pos, offset);

  return result;
};


return R;

}

return Util.memoize(Region);

});

