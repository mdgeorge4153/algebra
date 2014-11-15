
/* interfaces *****************************************************************/

function Set() {
  this.isElement = function (a)   { throw("unimplemented function isElement"); };
  this.equals    = function (a,b) { throw("unimplemented function equals"); };

  /* axiom unit tests */
  this.checkEqReflexive = function (a) {
    return this.equals(a,a);
  };

  this.checkEqSymmetric = function (a,b) {
    return this.equals(a,b) == this.equals(b,a);
  };

  this.checkEqTransitive = function (a,b,c) {
    return this.equals(a,b) && this.equals(b,c) ? this.equals(a,c) : true;
  };

  this.checkTrue = function () {
    return true;
  };

  this.checkN = function (n) {
    return n == 1;
  };
  this.checkN.tests = [[1]];

  /* helper functions */

  var neDefault = function (a,b) {
    return !this.equals(a,b);
  };

  this.ne = neDefault;
  this.checkNe = function (a,b) {
    return this.ne(a,b) == neDefault.call(this, a, b);
  };
}

function Group() {
  Set.call(this);

  this.zero  = undefined;
  this.plus  = function (a,b) { throw("unimplemented function plus"); };
  this.neg   = function (a)   { throw("unimplemented function neg"); };

  /* axiom unit tests */
  this.checkZeroClosed = function () {
    return this.isElement(this.zero);
  }

  this.checkPlusClosed = function (a,b) {
    return this.isElement(this.plus(a,b));
  }

  this.checkNegClosed = function (a) {
    return this.isElement(this.neg(a));
  }

  this.checkPlusIdent = function (a) {
    return this.equals(this.plus(this.zero, a),
                       a);
  };

  this.checkPlusAssoc = function (a,b,c) {
    return this.equals(this.plus(this.plus(a, b), c),
                       this.plus(a, this.plus(b, c)));
  };

  this.checkPlusInverse = function (a) {
    return this.equals(this.plus(a, this.neg(a)),
                       this.zero);
  };

  this.checkPlusCommutative = function (a,b) {
    return this.equals(this.plus(a, b),
                       this.plus(b, a));
  };

  /* helper functions */
  var minusDefault = function (a,b) { return this.plus(a, this.neg(b)); };

  this.minus      = minusDefault;
  this.checkMinus = function (a,b) {
    return this.equals(this.minus(a,b),
                       minusDefault.call(this,a,b));
  }

  var isZeroDefault = function (a) { return this.equals(a, this.zero); };

  this.isZero = isZeroDefault;
  this.checkIsZero = function (a) {
    return this.isZero(a) == isZeroDefault.call(this, a);
  }
}

function Ring() {
  Group.call(this);

  this.one   = undefined;
  this.times = function (a,b) { throw("unimplemented function times"); };

  /* axiom unit tests */
  this.checkOneClosed = function () {
    return this.isElement(this.one);
  };

  this.checkTimesClosed = function (a,b) {
    return this.isElement(this.times(a,b));
  }

  this.checkMultAssoc = function(a,b,c) {
    return this.equals(this.times(this.times(a,b), c),
                       this.times(a, this.times(b,c)));
  };

  this.checkMultIdent = function (a) {
    return this.equals(this.times(a, this.one), a);
  };

  this.checkMultCommutative = function (a,b) {
    return this.equals(this.times(a, b), this.times(b, a));
  };

  this.checkDistributive = function (a,b,c) {
    return this.equals(this.times(a, this.plus(b, c)),
                       this.plus(this.times(a, b), this.times(a, c)));
  };

  /* helper functions */
  var fromIntDefault = function (n) {
    if (n < 0)
      return this.neg(this.fromInt(-n));
    else if (n == 0)
      return this.zero;
    else {
      var bit  = n % 2 == 0 ? this.zero : this.one;
      var rest = fromIntDefault.call(this, Math.floor(n / 2));
      return this.plus(this.plus(rest, rest), bit);
    }
  };

  this.fromInt = fromIntDefault;
  this.checkFromInt = function (n) {
    return this.equals(this.fromInt(n), fromIntDefault.call(this,n));
  }
  this.checkFromInt.tests = [[-10000], [-37], [-1], [0], [1], [42], [99], [1000]];
}

function Field () {
  Ring.call(this);

  this.inv = function (a) { throw("unimplemented function inv"); };

  /* axiom unit tests */
  this.checkInverseClosed = function (a) {
    return this.isZero(a) ? true : this.isElement(this.inv(a));
  }

  this.checkInverse = function (a) {
    return this.isZero(a) ? true
                          : this.equals(this.times(a, this.inv(a)), this.one);
  };

  /* helper functions */
  var divDefault = function (a, b) {
    return this.times(a, this.inv(b));
  };

  this.div = divDefault;
  this.checkDiv = function (a,b) {
    return this.isZero(b)
      ? true
      : this.equals(this.div(a,b), divDefault.call(this,a,b));
  }
}

var GT = 1;
var EQ = 0;
var LT = -1;

function OrderedRing () {
  Ring.call(this);

  this.isNonNeg = function (a) { throw("unimplemented function isNonNeg"); };
  this.toNumber = function (a) { throw("unimplemented function toNumber"); };

  /* axiom unit tests */
  this.checkMinusOneNeg = function () {
    return !this.isNonNeg(this.neg(this.one));
  };

  this.checkSquaresNonNeg = function (a) {
    return this.isNonNeg(this.times(a,a));
  };

  this.checkTimesNonNeg = function (a, b) {
    return this.isNonNeg(a) && this.isNonNeg(b) ?
           this.isNonNeg(this.times(a,b)) : true;
  };

  this.checkPlusNonNeg = function (a,b) {
    return this.isNonNeg(a) && this.isNonNeg(b) ?
           this.isNonNeg(this.plus(a,b)) : true;
  };

  /* helper functions */

  var defaultLe = function (a,b) {
    return this.isNonNeg(this.minus(b,a));
  };

  this.le = defaultLe;
  this.checkLe = function (a,b) {
    return this.le(a,b) == defaultLe.call(this, a, b);
  };

  var defaultGe = function (a,b) {
    return this.isNonNeg(this.minus(a,b));
  };

  this.ge = defaultGe;
  this.checkGe = function (a,b) {
    return this.ge(a,b) == defaultGe.call(this, a, b);
  }

  var defaultLt = function (a,b) {
    return !this.ge(a,b);
  };

  this.lt = defaultLt;
  this.checkLt = function (a,b) {
    return this.lt(a,b) == defaultLt.call(this, a, b);
  }

  var defaultGt = function (a,b) {
    return !this.le(a,b);
  };

  this.gt = defaultGt;
  this.checkGt = function (a,b) {
    return this.gt(a,b) == defaultGt.call(this, a, b);
  }

  /* if a < b, returns a number < 0
   * if a = b, returns 0
   * if a > b, returns a number > 0
   */
  var defaultCmp = function (a,b) {
    return this.sign(this.minus(a, b));
  };

  this.cmp = defaultCmp;
  this.checkCmp = function (a,b) {
    return defaultCmp.call(this,a,b) > 0 ? this.cmp(a,b) > 0 :
           defaultCmp.call(this,a,b) < 0 ? this.cmp(a,b) < 0 :
                                           this.cmp(a,b) == 0;
  };

  /** returns the number +1, 0, or -1 to indicate the sign of a */
  var defaultSign = function(a) {
    if (this.equals(a, this.zero))
      return EQ;
    else if (this.isNonNeg(a))
      return GT;
    else
      return LT;
  }

  this.sign = defaultSign;
  this.checkSign = function(a) {
    return this.sign(a) == defaultSign.call(this, a);
  }
}

function OrderedField() {
  OrderedRing.call(this);
  Field.call(this);
}



/* testing ********************************************************************/

/* returns a list of all possible lists of elements of [tests] of length [n] */
function genTests(tests, n) {
  if (n <= 0)
    return [[]];

  var result = [];

  var subresults = genTests(tests, n-1);

  for (var i in subresults)
    for (var j in tests)
      result.push(subresults[i].concat(tests[j]));

  return result;
}

/* run all of the "check" functions on the given set type; returns a summary of
 * the results.  The result has the following form:
 *
 * result = {
 *   checkFoo: {
 *     pass: [test1, test2, test3, ...]
 *     fail: [test4, test5, test6, ...]
 *     exc: {
 *       exc1: [test7, ...]
 *       exc2: [test8, ...]
 *     }
 *   }
 *   checkBar: { ... }
 *   checkBaz: { ... }
 * }
 */
function runTests (set, objects) {
  var results = {}
  var tests   = [] /* an array mapping i to the set of all i-tuples of [objects] */

  for (var i in set) {
    if (i.startsWith("check") && typeof set[i] === "function") {

      var func    = set[i];
      var testSet = func.tests;

      if (testSet === undefined) {
        if (tests[func.length] === undefined)
          tests[func.length] = genTests(objects, func.length);
        testSet = tests[func.length];
      }

      var result = {
        num:  testSet.length,
        pass: [],
        fail: [],
        exc:  {}
      }

      for (var j in testSet) try {
        var test = testSet[j];
        if (func.apply(set, test))
          result.pass.push(test);
        else
          result.fail.push(test);
      } catch (exc) {
        if (!(exc in result.exc))
          result.exc[exc] = []
        result.exc[exc].push(test);
      }

      results[i] = result;
    }
  }

  return results;
}

/* float implementation *******************************************************/

var floats = new OrderedField();

/* reguired implementations */
floats.equals    = function (a,b) { return a == b; };
floats.isElement = function (a)   { return typeof a === "number"; };
floats.zero      = 0.;
floats.plus      = function (a,b) { return a + b;  };
floats.neg       = function (a)   { return -a;     };
floats.one       = 1.;
floats.times     = function (a,b) { return a * b;  };
floats.inv       = function (a)   { return 1 / a;  };
floats.isNonNeg  = function (a)   { return a >= 0; };
floats.toNumber  = function (a)   { return a;      };

/* optimizations */
floats.ne        = function (a,b) { return a != b; };
floats.minus     = function (a,b) { return a - b;  };
floats.fromInt   = function (n)   { return n;      };
floats.div       = function (a,b) { return a / b;  };
floats.lt        = function (a,b) { return a < b;  };
floats.gt        = function (a,b) { return a > b;  };
floats.le        = function (a,b) { return a <= b; };
floats.ge        = function (a,b) { return a >= b; };
floats.cmp       = floats.minus;

Object.freeze(floats);

/* fractions implementation ***************************************************/

function FieldOfFractions(ring, reduce) {
  Field.call(this);

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
}

function OrderedFieldOfFractions(orderedRing, reduce) {
  OrderedField.call(this);
  FieldOfFractions.call(this, orderedRing, reduce);

  this.isNonNeg = function (a) {
    return orderedRing.isZero(a.num) || orderedRing.isNonNeg(a.num) == orderedRing.isNonNeg(a.den);
  };
}

/* big integers ***************************************************************/

var ints = new OrderedRing();

/* reguired implementations */
ints.equals    = function (a,b) { return BigInteger.compare(a,b) == 0; };
ints.isElement = function (a)   { return a instanceof BigInteger; };
ints.zero      = BigInteger.ZERO;
ints.plus      = BigInteger.add;
ints.neg       = BigInteger.negate;
ints.one       = BigInteger.ONE;
ints.times     = BigInteger.multiply;
ints.isNonNeg  = function (a) { return BigInteger.compare(a,0) >= 0; };
ints.toNumber  = function (a) { return a.toJSValue(); };
ints.toString  = function (a) { return a.toString(); };

/* optimizations */
ints.minus    = BigInteger.subtract;
ints.fromInt  = BigInteger;

Object.freeze(ints);

function gcd(a, b) {
  /* implementation pseudocode taken from Wikipedia
   * http://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
   *
   * while b ≠ 0
   *   t = b
   *   b = a mod b
   *   a = t
   * return a
   */
  while (!ints.equals(b, ints.zero)) {
    var t = b;
    b = BigInteger.remainder(a, b);
    a = t;
  }
  return a;
}

function reduce(n, d) {
  /* check for zero */
  if (ints.equals(n, ints.zero))
    return [ints.zero, ints.one];
  if (ints.equals(d, ints.zero))
    throw "division by zero";

  /* ensure the denominator is positive */
  if (!ints.isNonNeg(d)) {
    n = ints.neg(n);
    d = ints.neg(d);
  }

  /* compute gcd and reduce */
  var cd = gcd(n, d);

  n = BigInteger.divide(n, cd);
  d = BigInteger.divide(d, cd);

  return [n, d];
}

var rats    = new OrderedFieldOfFractions(ints, reduce);

Object.freeze(rats);

var intrats = new OrderedFieldOfFractions(floats);

Object.freeze(intrats);

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

var root2   = new AdjoinRoot(rats, rats.fromInt(2));
root2.sqrt2 = root2.sqrtN;

var root23   = new AdjoinRoot(root2, root2.fromInt(3));

root23.sqrt2 = root23.fromFieldElems(root2.sqrt2);
root23.sqrt3 = root23.sqrtN;
root23.sqrt6 = root23.fromFieldElems(root2.zero, root2.sqrt2);

root23.two   = root23.fromInt(2);
root23.half  = root23.inv(root23.two);

root23.sin45 = root23.div(root23.sqrt2, root23.two);
root23.cos45 = root23.sin45;

/* 30-60-90 triangle has proportions 1 : 2 : √3
 *   2  ____/|         1  ____/|   
 *  ___/     | 1      ___/     | 1/2
 * /---------|       /---------|   
 *     √3                √3/2        
 */

root23.cos30 = root23.div(root23.sqrt3, root23.two);
root23.sin30 = root23.div(root23.one,   root23.two);

root23.sin60 = root23.cos30;
root23.cos60 = root23.sin30;

/* To find sin and cos of 15, rotate (cos 60, sin 60) by -45 degrees:
 * ┎        ┒   ┎                     ┒   ┎        ┒
 * ┃ cos 15 ┃   ┃  (cos 45)  (sin 45) ┃   ┃ cos 60 ┃
 * ┃        ┃ = ┃                     ┃ * ┃        ┃
 * ┃ sin 15 ┃   ┃ -(sin 45)  (cos 45) ┃   ┃ sin 60 ┃
 * ┖        ┚   ┖                     ┚   ┖        ┚
 */

root23.cos15 = root23.plus (root23.times(root23.cos45, root23.cos60),
                            root23.times(root23.sin45, root23.sin60));
root23.sin15 = root23.plus (root23.neg(root23.times(root23.sin45, root23.cos60)),
                            root23.times(root23.cos45, root23.sin60));


/* unit tests */

root23.checkCSIdent = function (n, c,s) {
  return this.equals(this.plus(this.times(c,c),
                               this.times(s,s)),
                     this.one);
};
root23.checkCSIdent.tests = [
  [15, root23.sin15, root23.cos15],
  [30, root23.sin30, root23.cos30],
  [45, root23.sin45, root23.cos45],
  [60, root23.sin60, root23.cos60],
];

function cosDeg (x) { return Math.cos(x * Math.PI / 180); }
function sinDeg (x) { return Math.sin(x * Math.PI / 180); }

root23.checkFloatApprox = function (c, func, n) {
  return Math.abs(root23.toNumber(c) - func.call(null, n)) < 0.000001;
};
root23.checkFloatApprox.tests = [
  [root23.sqrt2, Math.sqrt, 2],
  [root23.sqrt3, Math.sqrt, 3],
  [root23.sqrt6, Math.sqrt, 6],
  [root23.sin15, sinDeg, 15],
  [root23.cos15, cosDeg, 15],
  [root23.sin30, sinDeg, 30],
  [root23.cos30, cosDeg, 30],
  [root23.sin45, sinDeg, 45],
  [root23.cos45, cosDeg, 45],
  [root23.sin60, sinDeg, 60],
  [root23.cos60, cosDeg, 60],
];

/* special case printing */

root23.toString = function (a) {
  return a.i.i.num.toString() + "/"   + a.i.i.den.toString() + " + " +
         a.i.j.num.toString() + "√2/" + a.i.j.den.toString() + " + " +
         a.j.i.num.toString() + "√3/" + a.j.i.den.toString() + " + " +
         a.j.j.num.toString() + "√6/" + a.j.j.den.toString();
};

Object.freeze(root23);

