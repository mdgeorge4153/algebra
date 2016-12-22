define(["algebra.properties", "lib/jsverify",
        "numbers/integers",
        "numbers/floats"],
function(properties, jsc,
         integers,
         floats)
{

describe("Integers satisfy", function() {
  properties.ringProperties(integers, {"e": integers.arbitrary});
});

describe("Floats satisfy", function() {
  properties.fieldProperties(floats, {"e": jsc.number});
});

});
