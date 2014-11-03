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
  }

  /* helper functions */

  var neDefault = function (a,b) {
    return !this.equals(a,b);
  };

  this.ne = neDefault;
  this.checkNe = function (a,b) {
    return this.ne(a,b) == neDefault.apply(this, [a,b]);
  };
}

function Group() {
  Set.apply(this, []);

  this.zero  = function ()    { throw("unimplemented function zero"); };
  this.plus  = function (a,b) { throw("unimplemented function plus"); };
  this.neg   = function (a)   { throw("unimplemented function neg"); };

  /* axiom unit tests */
  this.checkZeroClosed = function () {
    return this.isElement(this.zero());
  }

  this.checkPlusClosed = function (a,b) {
    return this.isElement(this.plus(a,b));
  }

  this.checkNegClosed = function (a) {
    return this.isElement(this.neg(a));
  }

  this.checkPlusIdent = function (a) {
    return this.equals(this.plus(this.zero(), a),
                       a);
  };

  this.checkPlusAssoc = function (a,b,c) {
    return this.equals(this.plus(this.plus(a, b), c),
                       this.plus(a, this.plus(b, c)));
  };

  this.checkPlusInverse = function (a) {
    return this.equals(this.plus(a, this.neg(a)),
                       this.zero());
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
                       minusDefault.apply(this, [a,b]));
  }

  var isZeroDefault = function (a) { return this.equals(a, this.zero()); };

  this.isZero = isZeroDefault;
  this.checkIsZero = function (a) {
    return this.isZero(a) == isZeroDefault.apply(this, [a]);
  }
}

function Ring() {
  Group.apply(this, []);

  this.one   = function ()    { throw("unimplemented function one"); };
  this.times = function (a,b) { throw("unimplemented function times"); };

  /* axiom unit tests */
  this.checkOneClosed = function () {
    return this.isElement(this.one());
  };

  this.checkTimesClosed = function (a,b) {
    return this.isElement(this.times(a,b));
  }

  this.checkMultAssoc = function(a,b,c) {
    return this.equals(this.times(this.times(a,b), c),
                       this.times(a, this.times(b,c)));
  };

  this.checkMultIdent = function (a) {
    return this.equals(this.times(a, this.one()), a);
  };

  this.checkMultCommutative = function (a,b) {
    return this.equals(this.times(a, b), this.times(b, a));
  };

  this.checkDistributive = function (a,b,c) {
    return this.equals(this.times(a, this.plus(b, c)),
                       this.plus(this.times(a, b), this.times(a, c)));
  };

  /* helper functions */
  var twoDefault = function () {
    return this.plus(this.one(), this.one());
  };

  this.two = twoDefault;
  this.checkTwo = function () {
    return this.equals(this.two(), twoDefault.apply(this, []));
  };

  var fromIntDefault = function (n) {
    if (n < 0)
      return this.neg(this.fromInt(-n));
    else if (n == 0)
      return this.zero();
    else {
      bit  = n % 2 == 0 ? this.zero() : this.one();
      rest = n / 2;
      return this.plus(this.plus(rest, rest), bit);
    }
  };

  this.fromInt = fromIntDefault;
  this.checkFromInt = function () {
    /* this is a bit grody.  It would be more in keeping with the rest of the
     * library to make this function take a single argument.  However, this
     * argument is different because it should be an integer, not an element of
     * the ring.  Instead, we just iterate over a handful of integers.
     */
    tests = [-10000, -37, -1, 0, 1, 42, 99, 1000];
    for (var i in tests)
      if (!this.equals(this.fromInt(tests[i]), fromIntDefault.apply(this,[tests[i]])))
        return false;
    return true;
  }
}

function Field () {
  Ring.apply(this, []);

  this.inv = function (a) { throw("unimplemented function inv"); };

  /* axiom unit tests */
  this.checkInverseClosed = function (a) {
    return this.isZero(a) ? true : this.isElement(this.inv(a));
  }

  this.checkInverse = function (a) {
    return this.isZero(a) ? true : this.equals(this.times(a, this.inv(a)), this.one());
  };

  /* helper functions */
  var divDefault = function (a, b) {
    return this.times(a, this.inv(b));
  };

  this.div = divDefault;
  this.checkDiv = function (a,b) {
    return this.isZero(b)
      ? true
      : this.equals(this.div(a,b), divDefault.apply(this, [a,b]));
  }
}

function OrderedRing () {
  Ring.apply(this, []);

  this.isNonNeg = function (a) { throw("unimplemented function isNonNeg"); };

  /* axiom unit tests */
  this.checkMinusOneNeg = function () {
    return !this.isNonNeg(this.neg(this.one()));
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
    return this.le(a,b) == defaultLe.apply(this, [a,b]);
  };

  var defaultGe = function (a,b) {
    return this.isNonNeg(this.minus(a,b));
  };

  this.ge = defaultGe;
  this.checkGe = function (a,b) {
    return this.ge(a,b) == defaultGe.apply(this, [a,b]);
  }

  var defaultLt = function (a,b) {
    return !this.ge(a,b);
  };

  this.lt = defaultLt;
  this.checkLt = function (a,b) {
    return this.lt(a,b) == defaultLt.apply(this, [a,b]);
  }

  var defaultGt = function (a,b) {
    return !this.le(a,b);
  };

  this.gt = defaultGt;
  this.checkGt = function (a,b) {
    return this.gt(a,b) == defaultGt.apply(this, [a,b]);
  }

  /* if a < b, returns a number < 0
   * if a = b, returns 0
   * if a > b, returns a number > 0
   */
  var defaultCmp = function (a,b) {
    if (this.equals(a,b))
      return 0;
    else if (this.isNonNeg(this.minus(a, b))) /* a - b >= 0 */
      return 1;
    else
      return -1;
  };

  this.cmp = defaultCmp;
  this.checkCmp = function (a,b) {
    return defaultCmp.call(this,a,b) > 0 ? this.cmp(a,b) > 0 :
           defaultCmp.call(this,a,b) < 0 ? this.cmp(a,b) < 0 :
                                           this.cmp(a,b) == 0;
  };
}

function OrderedField() {
  OrderedRing.apply(this, []);
  Field.apply(this, []);
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

      var func = set[i];

      if (tests[func.length] === undefined)
        tests[func.length] = genTests(objects, func.length);

      var result = {
        num:  tests[func.length].length,
        pass: [],
        fail: [],
        exc:  {}
      }

      for (var j in tests[func.length]) try {
        var test = tests[func.length][j];
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
floats.zero      = function ()    { return 0.;     };
floats.plus      = function (a,b) { return a + b;  };
floats.neg       = function (a)   { return -a;     };
floats.one       = function ()    { return 1.;     };
floats.times     = function (a,b) { return a * b;  };
floats.inv       = function (a)   { return 1 / a;  };
floats.isNonNeg  = function (a)   { return a >= 0; };

/* optimizations */
floats.ne        = function (a,b) { return a != b; };
floats.minus     = function (a,b) { return a - b;  };
floats.two       = function ()    { return 2;      };
floats.fromInt   = function (n)   { return n;      };
floats.div       = function (a,b) { return a / b;  };
floats.lt        = function (a,b) { return a < b;  };
floats.gt        = function (a,b) { return a > b;  };
floats.le        = function (a,b) { return a <= b; };
floats.ge        = function (a,b) { return a >= b; };
floats.cmp       = floats.minus;

Object.freeze(floats);

/* fractions implementation ***************************************************/

function Fraction(num, den) {
  this.num = num;
  this.den = den;

  this.toString = function () {
    return this.num.toString() + "/" + this.den.toString();
  }

  Object.freeze(this);
}

function FieldOfFractions(ring, reduce) {
  Field.apply(this, []);

  this.reduce = reduce;

  var create = function (a,b) {
    if (this.reduce == undefined)
      return new Fraction(a,b);
    else
      return Object.create(Fraction, this.reduce(a,b));
  };

  /* required implementations */
  this.equals = function (a,b) {
    return ring.equals(ring.times(a.num, b.den), ring.times(a.den, b.num));
  };

  this.isElement = function (a) {
    return ring.isElement(a.num) && ring.isElement(a.den) &&
          !ring.equals(a.den, ring.zero());
  }

  this.zero = function () {
    return create(ring.zero(), ring.one());
  };

  this.plus = function (a,b) {
    return create(ring.plus(ring.times(a.num, b.den), ring.times(a.den, b.num)),
                  ring.times(a.den, b.den));
  };

  this.neg = function (a) {
    return create(ring.neg(a.num), a.den);
  };

  this.one = function (a,b) {
    return create(ring.one(), ring.one());
  };

  this.times = function (a,b) {
    return create(ring.times(a.num, b.num), ring.times(a.den,b.den));
  };

  this.inv = function (a) {
    if (ring.equals(a.num, ring.zero()))
      throw("Division by 0");
    return create(a.den, a.num);
  };

  this.fromRing = function (a,b) {
    if (b == undefined)
      b = ring.one();
    return create(a,b);
  };

  this.fromInts = function (n1,n2) {
    return create(ring.fromInt(n1), ring.fromInt(n2));
  };
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
ints.zero      = function ()    { return BigInteger.ZERO; };
ints.plus      = BigInteger.add;
ints.neg       = BigInteger.negate;
ints.one       = function ()    { return BigInteger.ONE; };
ints.times     = BigInteger.multiply;
ints.isNonNeg  = function (a)   { return BigInteger.compare(a,0) >= 0; };

/* optimizations */
floats.minus    = BigInteger.subtract;
floats.two      = function ()    { return BigInteger(2); };
floats.fromInt  = BigInteger;

Object.freeze(ints);

var rats = new OrderedFieldOfFractions(ints);

Object.freeze(rats);

/******************************************************************************/

