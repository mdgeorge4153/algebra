define(["numbers/vec2", "geometry", "region"],
function(Vec2,           Geom,       Region) {

return function Model (F) {

  var V = Vec2(F);
  var G = Geom(V);
  var R = Region(V);

  this.F = F;
  this.V = V;

  /****************************************************************************/

  this.hover = -1;

  /****************************************************************************/
  function Tan(coords) {
    /* these points are sorted counter-clockwise */
    this.coords = coords;
  }

  Tan.prototype.contains = function contains(pt) {
    var cmp = G.cmpSlopeFrom(pt);

    for (var i = 0; i < this.coords.length; i++)
      if (cmp(this.coords[i], this.coords[(i + 1) % this.coords.length]) < 0)
        return false;

    return true;
  };


  /****************************************************************************/

  this.goal = null;

  this.loadGoal = function loadGoal(name) {
    // Note: functional programming is ugly in JS.  This uses "require" to load
    // the given file.  Once loaded, it transforms all of the pairs of strings
    // into vectors using V.fromPair and F.ofString, and updates the goal.
    require([name], function (data) {
      var points = data.map(function (a) {
        return V.fromPair(a.map(F.ofString.bind(F)));
      });

      // normalize the goal so that the center of the bounding box is at (0,0)

      var minX = points[0].x, minY = points[0].y,
          maxX = points[0].x, maxY = points[0].y;
      for (var i = 0; i < points.length; i++) {
        minX = F.min(minX, points[i].x); minY = F.min(minY, points[i].y);
        maxX = F.max(maxX, points[i].x); maxY = F.max(maxY, points[i].y);
      }

      var min = new V.Vector(minX, minY), max = new V.Vector(maxX, maxY);

      var center = V.sdiv(V.plus(min, max), F.fromInt(2));
      var offset = V.neg(center);

      this.goal = points.map(V.plus.bind(V, offset));
    }.bind(this));
  };

  /****************************************************************************/

  /* shapes */
  var shapes = [
    [[0,2], [0,1], [0,0], [1,0], [2,0], [1,1]], /* big triangle    */
    [[0,2], [1,1], [2,0], [2,1], [2,2], [1,2]], /* big triangle    */
    [[0,2], [0,1], [0,0], [1,1]],               /* medium triangle */
    [[1,1], [0,1], [1,0]],                      /* small triangle  */
    [[0,0], [1,0], [2,1], [1,1]],               /* parallelogram   */
    [[1,1], [0,0], [1,0]],                      /* small triangle  */
    [[0,1], [0,0], [1,0], [1,1]]                /* square          */
  ];
  
  /* offsets in quarter units */
  var offsets = [
    [-10, -4], /* big triangle    */
    [-10, -2], /* big triangle    */
    [ -1, -3], /* medium triangle */
    [  0,  2], /* small triangle  */
    [  1, -3], /* parallelogram   */
    [  6, -4], /* small triangle  */
    [  5,  2]  /* square          */
  ];
  
  this.tans = [];
  
  for (var i = 0; i < shapes.length; i++) {
    var coords = [];
    var offset = V.sdiv(V.fromPair(offsets[i]), F.fromInt(4));
  
    for (var p = 0; p < shapes[i].length; p++) {
      var coord = V.fromPair(shapes[i][p]);
      coords.push(V.plus(coord, offset));
    }

    this.tans.push(new Tan(coords));
  }
};

});

