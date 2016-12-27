define(["test/algebra.properties", "lib/jsverify",
        "numbers/integers",
        "numbers/floats"],
function(properties, jsc,
         integers,
         floats)
{

describe("Integers satisfy", function() {
  properties.orderedEuclideanRingProperties(integers);
});

//describe("Floats satisfy", function() {
//  properties.orderedFieldProperties(floats);
//});

});
