define(["algebra", "lib/jsverify"],
function(algebra,   jsc) {

return function Vec2(F) {

var V = {};

V.Vector = function Vector(x,y) {
  this.x = x;
  this.y = y;
  Object.freeze(this);
};

V.Vector.prototype.toString = function toString() {
  return "(" + F.stringOf(this.x) + "," + F.stringOf(this.y) + ")";
};

V.eq = function eq(v1, v2) {
  return F.eq(v1.x, v2.x) && F.eq(v1.y, v2.y);
};

V.arbitrary = jsc.nonshrink(jsc.pair(F.arbitrary, F.arbitrary).smap(
  function (e) { return new V.Vector(e[0], e[1]); },
  function (v) { return [v.x, v.y]; },
  function (v) { return v.toString(); }
));

V.isInstance = function isInstance(v) {
  return v instanceof V.Vector && F.isInstance(v.x) && F.isInstance(v.y);
};

V.ofString = function ofString(s) {
  var substrings = s.replace(/\(|\)/g,"").split(",");
  if (substrings.length != 2)
    throw new Error("multiple commas");
  var x = F.ofString(substrings[0]), y = F.ofString(substrings[1]);
  return new V.Vector(x,y);
};

V.stringOf = function stringOf(v) {
  return v.toString();
};

V.plus = function vectorPlus(v1, v2) {
  return new V.Vector(F.plus(v1.x, v2.x), F.plus(v1.y, v2.y));
};

V.zero = new V.Vector(F.zero, F.zero);

V.neg = function neg (v) {
  return new V.Vector(F.neg(v.x), F.neg(v.y));
};

V.scalars = F;

V.smult = function smult(s, v) {
  return new V.Vector(F.times(s, v.x), F.times(s, v.y));
};

V.dot = function dot (v1, v2) {
  return F.plus(F.times(v1.x, v2.x), F.times(v1.y, v2.y));
};

/** Special to vec2 ***********************************************************/

V.perp = function perp (v) {
  return new V.Vector(F.neg(v.y), v.x);
};

V.cross = function cross (v1, v2) {
  return V.dot(v1, V.perp(v2));
};

V.fromIntPair = function fromIntPair (a) {
  return new V.Vector(F.fromInt(a[0]), F.fromInt(a[1]));
};

V.fromPair = function fromPair (x,y) {
  return new V.Vector(x,y);
};

if (F.toNumber != undefined) {
  V.toPair = function toPair (v) {
    return [F.toNumber(v.x), F.toNumber(v.y)];
  };
}

return V;

};

});
