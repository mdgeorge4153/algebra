/* float implementation *******************************************************/

define(["algebra"],
function(algebra) {

var floats = {};

/* reguired implementations */
floats.equals    = function (a,b) { return a == b; };
floats.isElem    = function (a)   { return typeof a === "number"; };
floats.zero      = 0.;
floats.plus      = function (a,b) { return a + b;  };
floats.neg       = function (a)   { return -a;     };
floats.one       = 1.;
floats.times     = function (a,b) { return a * b;  };
floats.inv       = function (a)   { return 1 / a;  };
floats.isNonNeg  = function (a)   { return a >= 0; };
floats.toNumber  = function (a)   { return a;      };
floats.stringOf  = function (a)   { return a.toString(); };
floats.ofString  = parseFloat;

algebra.OrderedField.call(floats);

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

return floats;

});
