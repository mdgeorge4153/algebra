define(["algebra"],
function(algebra) {

function Vec2(field) {

  var V = {};

  V.Vector = function Vector(x,y) {
    this.x = x;
    this.y = y;
  };

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

  Object.freeze(V);
  return V;
}

return Vec2;

});
