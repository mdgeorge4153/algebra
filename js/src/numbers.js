
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

