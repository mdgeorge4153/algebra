define(["spec/algebra", "lib/jsverify", "lib/biginteger",
        "numbers/integers",
        "numbers/floats"],
function(properties, jsc, BigInteger,
         integers,
         floats)
{

describe("Integers satisfy", function() {
  properties.ringProperties(integers, {"e": integers.arbitrary});
});

/*
describe("Floats satisfy", function() {
  properties.fieldProperties(floats, {"e": jsc.number});
});
*/

});
