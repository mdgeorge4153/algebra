/* fractions implementation ***************************************************/

define(["algebra"],
function(algebra) {

function FieldOfFractions(ring, reduce) {

  function Fraction(num, den) {
    this.num = num;
    this.den = den;

    this.toString = function () {
      if (ring.equals(this.num, ring.zero))
	return ring.toString(this.num);
      else if (ring.equals(this.den, ring.one))
	return ring.toString(this.num);
      return "(" + this.num.toString() + "/" + this.den.toString() + ")";
    }

    Object.freeze(this);
  }

  this.reduce = reduce;

  this.create = function (a,b) {
    if (b === undefined)
      b = ring.one;

    if (this.reduce != undefined) {
      var args = this.reduce(a,b);
      a = args[0];
      b = args[1];
    }

    return new Fraction(a,b);
  };

  /* required implementations */
  this.equals = function (a,b) {
    return ring.equals(ring.times(a.num, b.den), ring.times(a.den, b.num));
  };

  this.isElement = function (a) {
    return a instanceof Fraction &&
	   ring.isElement(a.num) && ring.isElement(a.den) &&
	  !ring.equals(a.den, ring.zero);
  }

  this.zero = this.create(ring.zero, ring.one);

  this.plus = function (a,b) {
    return this.create(ring.plus(ring.times(a.num, b.den), ring.times(a.den, b.num)),
		  ring.times(a.den, b.den));
  };

  this.neg = function (a) {
    return this.create(ring.neg(a.num), a.den);
  };

  this.one = this.create(ring.one, ring.one);

  this.times = function (a,b) {
    return this.create(ring.times(a.num, b.num), ring.times(a.den,b.den));
  };

  this.inv = function (a) {
    if (ring.equals(a.num, ring.zero))
      throw("Division by 0");
    return this.create(a.den, a.num);
  };

  /* constructors */
  this.fromRingElems = function (a,b) {
    if (b == undefined)
      b = ring.one;
    return this.create(a,b);
  };

  this.fromInts = function (n1,n2) {
    return this.create(ring.fromInt(n1), ring.fromInt(n2));
  };

  this.fromInt = function(n) {
    return this.create(ring.fromInt(n), ring.one);
  };

  this.toNumber = function (a) {
    return ring.toNumber(a.num) / ring.toNumber(a.den);
  }

  this.toString = function (a) {
    return a.toString();
  }

  algebra.Field.call(this);
}

function OrderedFieldOfFractions(ring, reduce) {
  FieldOfFractions.call(this, ring, reduce);

  this.leq = function (e1,e2) {
    ring.leq(ring.times(e1.num, e2.den), ring.times(e1.den, e2.num));
  };
}

return FieldOfFractions;

});
