define(["algebra", "util"],
function(algebra,   Util) {

function Vec2(field) {

  var V = {};

  V.Vector = function Vector(x,y) {
    this.x = x;
    this.y = y;
    Object.seal(this);
  };

  V.field  = field;

  V.isElem = function isElem(v) {
    return v instanceof V.Vector && field.isElem(v.x) && field.isElem(v.y);
  };

  V.equals = function equals(v1, v2) {
    return field.equals(v1.x, v2.x) && field.equals(v1.y, v2.y);
  };

  V.zero = new Vector(field.zero, field.zero);
  Object.freeze(V.zero);

  V.plus = function plus(v1, v2) {
    return new Vector(field.plus(v1.x, v2.x), field.plus(v1.y, v2.y));
  };

  V.neg = function neg (v) {
    return new Vector(field.neg(v.x), field.neg(v.y));
  };

  V.smult = function smult(s, v) {
    return new Vector(field.times(s, v.x), field.times(s, v.y));
  };

  if (Interface.isImplementation(field, algebra.Field))
    algebra.VectorSpace.instantiate(V);
  else
    algebra.Module.instantiate(V);

  /****************************************************************************/

  V.dot = function dot (v1, v2) {
    return field.plus(field.times(v1.x, v2.x), field.times(v1.y, v2.y));
  };

  V.perp = function perp (v) {
    return new Vector(field.neg(v.y), v.x);
  };

  V.cross = function cross (v1, v2) {
    return V.dot(v1, V.perp(v2));
  };

  Object.freeze(V);
  return V;
}

return Util.memoize(Vec2);

});
