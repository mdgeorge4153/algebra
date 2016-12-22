/* float implementation *******************************************************/

define(["algebra", "lib/traits", "lib/jsverify"],
function(Algebra, Traits, jsc) {

var arbFloat = jsc.number.smap(
  function(exponent) {
    return Math.pow(1000, exponent);
  },

  function(number) {
    return Math.log10(number)/3;
  }
);

var floats = {};

/* reguired implementations */
floats.eq         = function eq         (a,b) { return Math.abs(a - b) < 0.000001; };
floats.isInstance = function isInstance (a)   { return typeof a === "number"; };
floats.arbitrary  = arbFloat;
floats.zero       = 0.;
floats.plus       = function plus       (a,b) { return a + b;  };
floats.neg        = function neg        (a)   { return -a;     };
floats.one        = 1.;
floats.times      = function times      (a,b) { return a * b;  };
floats.inv        = function inv        (a)   { return 1 / a;  };
floats.isUnit     = function isUnit     (a)   { return a != 0; };
floats.toNumber   = function toNumber   (a)   { return a;      };
floats.leq        = function leq        (a,b) { return a <= b; };
floats.stringOf   = function stringOf   (a)   { return a.toString(); };
floats.ofString   = parseFloat;

/* optimizations */
floats.isNonNeg   = function isNonNeg   (a)   { console.log("overridden"); return a >= 0; };
floats.ne         = function ne         (a,b) { return a != b; };
floats.minus      = function minus      (a,b) { return a - b;  };
floats.fromInt    = function fromInt    (n)   { return n;      };
floats.div        = function div        (a,b) { return a / b;  };
floats.lt         = function lt         (a,b) { return a < b;  };
floats.gt         = function gt         (a,b) { return a > b;  };
floats.le         = function le         (a,b) { return a <= b; };
floats.ge         = function ge         (a,b) { return a >= b; };
floats.cmp        = floats.minus;

return Traits.create({}, Traits.override(Traits(floats), Algebra.OrderedField));

});
