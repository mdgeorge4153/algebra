define(["numbers/vec2"],
function(Vec2) {

return function Model (F) {

  var V = Vec2(F);

  this.F = F;
  this.V = V;
  
  function Tan(coords) {
    /* these points are sorted counter-clockwise */
    this.coords = coords;
  }
  
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
    [2,  2], /* big triangle    */
    [2,  4], /* big triangle    */
    [11, 3], /* medium triangle */
    [12, 8], /* small triangle  */
    [13, 3], /* parallelogram   */
    [18, 2], /* small triangle  */
    [17, 8]  /* square          */
  ];
  
  this.tans = [];
  
  var itof = F.fromInt;
  var atov = function atov(a) { return new V.Vector(itof(a[0]), itof(a[1])); };
  
  for (var i in shapes) {
    var coords = [];
    var offset = V.sdiv(atov(offsets[i]), itof(4));
  
    for (var p in shapes[i]) {
      var coord = atov(shapes[i][p]);
      coords.push(V.plus(coord, offset));
    }
  
    this.tans.push(new Tan(coords));
  }

  this.dragging = false;
  this.hover    = -1;
};

});

