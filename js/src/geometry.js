
function VectorSpace(field) {
  this.Vector = function (x,y) {
    this.x = x;
    this.y = y;
    Object.freeze(this);
  };

  this.dot = function (v1, v2) (
    with (field) { return plus(times(v1.x, v2.x), times(v1.y, v2.y)); };
  };

  this.smult = function (s, v) {
    with (field) { return new this.Vector(times(s, v.x), times(s, v.y)); };
  };

  this.plus = function (v1,v2) {
    with (field) { return new this.Vector(plus(v1.x, v2.x), plus(v1.y, v2.y)); };
  };

  this.neg = function (v) {
    with (field) { return new this.Vector(neg(v.x), neg(v.y)); };
  };

  this.minus = function (v1, v2) {
    with (field) { return new this.Vector(minus(v1.x, v2.x), minus(v1.y, v2.y)); };
  };

  this.cross = function (v1, v2) {
    with (field) { return minus(times(v1.x, v2.y), times(v1.y, v2.x)); };
  };

  this.toString = function (v) {
    return "(" + field.toString(v.x) + ", " + field.toString(v.y) + ")";
  };

  this.cmpPoints = function (v1, v2) {
    with (field) {
      var xcmp = cmp(v1.x, v2.x);
      return xcmp === EQ ? cmp(v1.y, v2.y) : xcmp;
    };
  };

  /* determines whether the edge from p to p1 lies above or below the edge from
   * p to p2.
   *
   * assumes that p1 and p2 are less than p in the cmpPoints ordering
   */
  this.cmpSlopeFrom = function (v) {
    return function (v1, v2) {
      return field.sign(this.cross(this.minus(v2, v), this.minus(v1, v)));
    };
  };

  /* given edges starting at p1 and q1 and ending in p2 and q2, returns the
   * point of intersection of the edges or null if no (unique) intersection
   * exists.
   */
  this.segmentIntersect = function (p1, p2, q1, q2) {
    /* we solve the equation p1 + s(p2 - p1) = q1 + t(q2 - q1) */
    var dq  = this.minus(q2, q1);
    var dp  = this.minus(p2, p1);

    var det = this.cross(dq, dp);

    if (field.equals(det, zero))
      /* lines are parallel, no ix */
      return null;

    var d1 = this.minus(p1, q1);
    var s  = div(this.cross(d1, dp), det);
    var t  = div(this.cross(d1, dq), det);
    var x  = this.plus(p1, this.smult(t, dp));

    /* there is an intersection if 0 ≤ s ≤ 1 and 0 ≤ t ≤ 1 */
    with (field) {
      if (leq(zero, s) && leq(s, one) && leq(zero, t) && leq(t, one))
        return x;
      else
        return null;
    };
  };

  function Point
}



