define(["algebra", "util", "interface"],
function(algebra,   Util,   Interface) {

function Vec2(F) {

  var V = {};

  V.Vector = function Vector(x,y) {
    this.x = x;
    this.y = y;
    Object.seal(this);
  };

  V.F = F;

  V.isElem = function isElem(v) {
    return v instanceof V.Vector && F.isElem(v.x) && F.isElem(v.y);
  };

  V.equals = function equals(v1, v2) {
    return F.equals(v1.x, v2.x) && F.equals(v1.y, v2.y);
  };

  V.zero = new V.Vector(F.zero, F.zero);
  Object.freeze(V.zero);

  V.plus = function plus(v1, v2) {
    return new V.Vector(F.plus(v1.x, v2.x), F.plus(v1.y, v2.y));
  };

  V.neg = function neg (v) {
    return new V.Vector(F.neg(v.x), F.neg(v.y));
  };

  V.smult = function smult(s, v) {
    return new V.Vector(F.times(s, v.x), F.times(s, v.y));
  };

  if (Interface.isImplementation(F, algebra.Field))
    algebra.VectorSpaceOver(F).instantiate(V);
  else
    algebra.ModuleOver(F).instantiate(V);

  /****************************************************************************/

  V.dot = function dot (v1, v2) {
    return F.plus(F.times(v1.x, v2.x), F.times(v1.y, v2.y));
  };

  V.perp = function perp (v) {
    return new V.Vector(F.neg(v.y), v.x);
  };

  V.cross = function cross (v1, v2) {
    return V.dot(v1, V.perp(v2));
  };

  V.norm2 = function norm2 (v) {
    return V.dot(v, v);
  };

  V.fromPair = function fromPair (a) {
    return new V.Vector(F.fromInt(a[0]), F.fromInt(a[1]));
  };

  /* TODO: relies on OrdField props */
  V.toPair = function toPair (v) {
    return [F.toNumber(v.x), F.toNumber(v.y)];
  };

  Object.freeze(V);
  return V;
}

return Util.memoize(Vec2);

});
