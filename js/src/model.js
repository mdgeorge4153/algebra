define(["numbers/vec2", "geometry"],
function(Vec2,           Geom) {

return function Model (F) {

  var V = Vec2(F);
  var G = Geom(V);

  this.F = F;
  this.V = V;

  var itof = F.fromInt;
  var atov = function atov(a) { return new V.Vector(itof(a[0]), itof(a[1])); };
  
  /****************************************************************************/

  // TODO: maybe this stuff should go in view?

  this.mousePos = null;
  this.scale    = F.one;
  this.offset   = V.zero;

  this.toVec = function toVec (x,y) {
    return V.smult(this.scale, V.minus(atov([x,y]), this.offset));
  };

  this.fromVec = function fromVec (v) {
    var trans = V.plus(this.offset, V.sdiv(v, this.scale));
    return {x: F.toNumber(trans.x), y: F.toNumber(trans.y)};
  };

  this.setSize = function setSize (w, h) {
    this.scale  = F.div(itof(6), Math.min(w, h));
    this.offset = V.sdiv(new V.Vector(w, h), itof(2));
  };

  /****************************************************************************/

  this.selection = -1;

  /****************************************************************************/
  function Tan(coords) {
    /* these points are sorted counter-clockwise */
    this.coords = coords;
  }

  Tan.prototype.contains = function contains(pt) {
    /*
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
    var offset = V.sdiv(atov(offsets[i]), itof(4));
  
    for (var p in shapes[i]) {
      var coord = atov(shapes[i][p]);
      coords.push(V.plus(coord, offset));
    }

    this.tans.push(new Tan(coords));
  }

};

});

