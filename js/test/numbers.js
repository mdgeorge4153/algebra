define(["spec/algebra", "lib/jsverify", "lib/biginteger",
        "numbers/integers",
        "numbers/floats"],
function(properties, jsc, BigInteger,
         integers,
         floats)
{

var arbBigint = jsc.pair(jsc.array(jsc.nat(10)), jsc.bool).smap(
  function(arr) {
    return new BigInteger(arr[0], arr[1] ? 1 : -1);
  },

  function(n) {
    var isNeg = n.isNegative();
    if (isNeg) n = n.negate();

    var result = [];
    while (n.isPositive()) {
      var divRem = n.divRem(10);
      result[result.length] = divRem[1];
      n = divRem[0];
    }

    return [result, !isNeg];
  },

  function(n) {
    return n.toString();
  }
);


/*
describe("Integers satisfy", function() {
  properties.ringProperties(integers, {"e": arbBigint});
});
*/

describe("Floats satisfy", function() {
  properties.fieldProperties(floats, {"e": jsc.number});
});

});
