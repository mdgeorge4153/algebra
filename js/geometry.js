
function VectorSpace(field) {
  this.Vector = function (x,y) {
    this.x = x;
    this.y = y;
    Object.freeze(this);
  }

  this.dot = function (v1, v2) (
    return field.plus(field.times(v1.x, v2.x), field.times(v1.y, v2.y));
  }

  this.smult = function (s, v) {
    return new this.Vector(field.times(s, v.x), field.times(s, v.y));
  }

  this.plus = function (v1,v2) {
    return new this.Vector(field.plus(v1.x, v2.x), field.plus(v1.y, v2.y));
  }

  this.neg = function (v) {
    return new this.Vector(field.neg(v.x), field.neg(v.y));
  }

  this.minus = function (v1, v2) {
    return new this.Vector(field.minus(v1.x, v2.x), field.minus(v1.y, v2.y));
  }

  this.cross = function (v1, v2) {
    return field.minus(field.times(v1.x, v2.y), field.times(v1.y, v2.x));
  }

  this.cmpPoints = function (v1, v2) {
    return 
}

function Node(pt) {
  this.pt    = pt;
  this.edges = [];
}

function Arrangement {

}

