define(["algebra", "numbers/vec2", "util"],
function(algebra,   Vec2,           Util) {

function Mat2(field) {

  var M = {};
  var V = Vec2(field);

  M.Matrix = function Matrix(xx, xy, yx, yy) {
    this.xx = xx;  this.yx = yx;
    this.xy = xy;  this.yy = yy;
    Object.seal(this);
  };

  M.field  = field;

  M.isElem = function isElem(m) {
    if (!(m instanceof Matrix))
      return false;
    
    for (var v in m)
      if (! field.isElem(m[v]))
        return false;
    return true;
  };

  M.equals = function equals(m1, m2) {
    for (var v in m)
      if (! field.equals(m1[v], m2[v]))
        return false;
    return true;
  };

  M.zero = new M.Matrix(field.zero, field.zero, field.zero, field.zero);

  M.plus = function plus(m1, m2) {
    return new M.Matrix(
      field.plus(m1.xx, m2.xx), field.plus(m1.yx, m2.yx),
      field.plus(m1.xy, m2.xy), field.plus(m1.yy, m2.yy)
    );
  };

  M.neg = function neg (m) {
    return new M.Matrix(
      field.neg(m.xx), field.neg(m.yx),
      field.neg(m.xy), field.neg(m.yy)
    );
  };

  M.times = function times(m1, m2) {
    return new M.Matrix(
      field.plus(field.times(m1.xx, m2.xx), field.times(m1.yx, m2.xy)),
      field.plus(field.times(m1.xx, m2.yx), field.times(m1.yx, m2.yy)),
      field.plus(field.times(m1.xy, m2.xx), field.times(m1.yy, m2.xy)),
      field.plus(field.times(m1.yy, m2.yx), field.times(m1.yy, m2.yy))
    );
  };

  M.one = new M.Matrix(field.one, field.zero,
                     field.zero, field.one);
  Object.freeze(M.one);

  M.isUnit = function isUnit(m) {
    return field.isUnit(det(m));
  };

  M.inv = function inv(m) {
    var invDet = field.inv(det(m));

    return new M.Matrix(
      field.times(invDet, m.yy),
      field.times(invDet, field.neg(m.yx)),
      field.times(invDet, field.neg(m.xy)),
      field.times(invDet, m.xx)
    );
  };

  M.smult = function smult(s, m) {
    return new M.Matrix(
      field.times(s, m.xx), field.times(s, m.yx),
      field.times(s, m.xy), field.times(s, m.yy)
    );
  };

  /****************************************************************************/

  M.det = function det(m) {
    return field.minus(field.times(m.xx, m.yy), field.times(m.xy, m.yx));
  };

  M.trace = function trace(m) {
    return field.plus(m.xx, m.yy);
  };

  M.transpose = function (m) {
    return new M.Matrix(m.xx, m.xy, m.yx, m.yy);
  };

  M.transform = function (m, v) {
    return new V.Vector(
      field.plus(field.times(m.xx, v.x), field.times(m.yx, v.y)),
      field.plus(field.times(m.xy, v.x), field.times(m.yy, v.y))
    );
  };

  M.rotation = function (cos, sin) {
    return new M.Matrix(cos, field.neg(sin),
                      sin, cos);
  };

  algebra.VectorSpaceOver(field).instantiate(M);
  algebra.Ring.instantiate(M);

  return M;
}

return Util.memoize(Mat2);

});
