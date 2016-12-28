define(["test/algebra.properties", "lib/jsverify",
        "numbers/integers",
        "numbers/floats",
        "numbers/rationals"],
function(properties, jsc,
         integers,
         floats,
         rationals)
{

describe("Integers satisfy", function() {
  properties.orderedEuclideanRingProperties(integers);
});

//describe("Floats satisfy", function() {
//   properties.orderedFieldProperties(floats);
//});

describe("Rationals satisfy", function() {
  properties.orderedFieldProperties(rationals);
});

});
