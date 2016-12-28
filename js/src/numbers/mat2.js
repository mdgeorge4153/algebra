define(["algebra", "numbers/vec2", "lib/jsverify"],
function(algebra,   Vec2,           jsc) {

return function Mat2(V) {

var F = V.scalars;
var M = {};

function Matrix(xx, xy, yx, yy) {
  this.xx = xx;  this.yx = yx;
  this.xy = xy;  this.yy = yy;
  Object.freeze(this);
};

Object.defineProperty(Matrix.prototype, 'toString', {
  value: function toString() {
    return "[" + F.stringOf(this.xx) + " " + F.stringOf(this.xy) + " ; "
               + F.stringOf(this.yx) + " " + F.stringOf(this.yy) + "]";
  },
  enumerable: false
});

M.eq = function eq(m1, m2) {
  for (var v in m1)
    if (F.neq(m1[v], m2[v]))
      return false;
  return true;
};

M.arbitrary = jsc.tuple([F.arbitrary, F.arbitrary, F.arbitrary, F.arbitrary]).smap(
  function (a) { return new Matrix(a[0], a[1], a[2], a[3]); },
  function (m) { return [m.xx, m.xy, m.yx, m.yy]; },
  function (m) { return m.toString(); }
);

M.isInstance = function isInstance(m) {
  if (!(m instanceof Matrix))
    return false;

  for (var v in m)
    if (! F.isInstance(m[v]))
      return false;
  return true;
};

M.ofString = function ofString(s) {
  var subs = s.match(/^\[\((.*)\) \((.*)\) ; \((.*)\) \((.*)\)\]$/);
  return new Matrix(F.ofString(subs[1]), F.ofString(subs[2]), F.ofString(subs[3]), F.ofString(subs[4]));
};

M.stringOf = function stringOf(m) {
  return m.toString();
};

M.plus = function plus(m1, m2) {
  return new Matrix(
    F.plus(m1.xx, m2.xx), F.plus(m1.xy, m2.xy),
    F.plus(m1.yx, m2.yx), F.plus(m1.yy, m2.yy)
  );
};

M.zero = new Matrix(F.zero, F.zero, F.zero, F.zero);

M.neg = function neg (m) {
  return new Matrix(
    F.neg(m.xx), F.neg(m.xy),
    F.neg(m.yx), F.neg(m.yy)
  );
};

M.times = function times(m1, m2) {
  return new Matrix(
    F.plus(F.times(m1.xx, m2.xx), F.times(m1.xy, m2.yx)),
    F.plus(F.times(m1.xx, m2.xy), F.times(m1.xy, m2.yy)),
    F.plus(F.times(m1.yx, m2.xx), F.times(m1.yy, m2.yx)),
    F.plus(F.times(m1.yx, m2.xy), F.times(m1.yy, m2.yy))
  );
};

M.one = new Matrix(F.one, F.zero,
                   F.zero, F.one);

M.inv = function inv(m) {
  var invDet = F.inv(M.det(m));

  return new Matrix(
    F.times(invDet, m.yy),
    F.times(invDet, F.neg(m.xy)),
    F.times(invDet, F.neg(m.yx)),
    F.times(invDet, m.xx)
  );
};

M.isUnit = function isUnit(m) {
  return F.isUnit(M.det(m));
};

M.scalars = F;

M.smult = function smult(s, m) {
  return new Matrix(
    F.times(s, m.xx), F.times(s, m.xy),
    F.times(s, m.yx), F.times(s, m.yy)
  );
};

/****************************************************************************/

M.fromCoeffs = function fromCoeffs(xx, xy, yx, yy) {
  return new Matrix(xx, xy, yx, yy);
};

M.det = function det(m) {
  return F.minus(F.times(m.xx, m.yy), F.times(m.xy, m.yx));
};

M.trace = function trace(m) {
  return F.plus(m.xx, m.yy);
};

M.transpose = function (m) {
  return new Matrix(m.xx, m.xy, m.yx, m.yy);
};

M.transform = function (m, v) {
  return V.fromPair(
    F.plus(F.times(m.xx, v.x), F.times(m.yx, v.y)),
    F.plus(F.times(m.xy, v.x), F.times(m.yy, v.y))
  );
};

M.rotation = function (cos, sin) {
  return new Matrix(cos, F.neg(sin),
                    sin, cos);
};

return M;

};

});
