/* adjoin root n **************************************************************/

function AdjoinRoot(field, n) {
  OrderedField.call(this);

  /* a pair representing the number i + j√n */
  function Elem(i,j) {
    this.i = i;
    this.j = j;

    this.toString = function () {
      if (field.equals(this.j, field.zero))
	return field.toString(this.i);
      if (field.equals(this.i, field.zero))
	return field.toString(this.j) + "√" + field.toString(n);
      if (field.equals(this.j, field.one))
	return field.toString(this.i) + " + √" + field.toString(n);
      if (field.equals(this.j, field.neg(field.one)))
	return field.toString(this.i) + " - √" + field.toString(n);
      if (field.isNonNeg(this.j))
	return field.toString(this.i) + " + " + field.toString(this.j) + "√" + field.toString(n);
      else
	return field.toString(this.i) + " - " + field.toString(field.neg(this.j)) + "√" + field.toString(n);
    };

    Object.freeze(this);
  }

  this.equals = function (a,b) {
    return field.equals(a.i, b.i) && field.equals(a.j, b.j);
  };

  this.isElement = function (a) {
    return a instanceof Elem && field.isElement(a.i) && field.isElement(a.j);
  };

  this.zero = new Elem(field.zero, field.zero);

  this.plus = function (a,b) {
    return new Elem(field.plus(a.i, b.i), field.plus(a.j, b.j));
  };

  this.neg = function (a) {
    return new Elem(field.neg(a.i), field.neg(a.j));
  };

  this.one = new Elem(field.one, field.zero);

  this.times = function (a,b) {
    return new Elem(field.plus(field.times(a.i, b.i),
			       field.times(field.times(n, a.j), b.j)),
		    field.plus(field.times(a.i, b.j),
			       field.times(a.j, b.i)));
  };

  this.sqrtN = new Elem(field.zero, field.one);

  var det = function(a) {
    return field.minus(field.times(a.i, a.i),
		       field.times(n, field.times(a.j, a.j)));
  };

  this.inv = function (a) {
    /* (i + j√n)(i - j√n) = i² - nj²
     * so 1 / (i + j√n) = (i - j√n) / (i^2 - nj^2)
     */
    var denom = det(a);
    return new Elem(field.div(a.i, denom), field.div(field.neg(a.j), denom));
  };

  this.isNonNeg = function (a) {
    var iNN = field.isNonNeg(a.i);
    var jNN = field.isNonNeg(a.j);
    if (iNN && jNN)
      return true;
    else if (!iNN && !jNN)
      return false;
    else if (iNN)
      return field.isNonNeg(det(a));
    else
      return !field.isNonNeg(det(a));
    return field.isNonNeg(a.j) ?  field.isNonNeg(det(a))
			       : !field.isNonNeg(det(a));
  };

  this.toNumber  = function (a) {
    return field.toNumber(a.i) + field.toNumber(a.j) * Math.sqrt(field.toNumber(n));
  };

  this.fromFieldElems = function(i,j) {
    if (j === undefined)
      j = field.zero;
    return new Elem(i, j);
  };

  this.toString = function (a) {
    return a.toString();
  }
}

