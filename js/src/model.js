define(["numbers/vec2", "geometry"],
function(Vec2,           Geom) {

return function Model (F) {

  var V = Vec2(F);
  var G = Geom(V);

  this.F = F;
  this.V = V;

  
  /****************************************************************************/

  this.selection = -1;

  /****************************************************************************/
  function Tan(coords) {
    /* these points are sorted counter-clockwise */
    this.coords = coords;
  }

  Tan.prototype.contains = function contains(pt) {
    return true;
    /* TODO
    var cmp = G.compareSlopeFrom(pt);

    for (var i in this.coords)
      if (cmp(this.coords[i], this.coords[(i + 1) % this.coords.length])
    */
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
  
  for (var i in shapes) {
    var coords = [];
    var offset = V.sdiv(V.fromPair(offsets[i]), F.fromInt(4));
  
    for (var p in shapes[i]) {
      var coord = V.fromPair(shapes[i][p]);
      coords.push(V.plus(coord, offset));
    }

    this.tans.push(new Tan(coords));
  }

};

});

