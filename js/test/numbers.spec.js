define(["test/algebra.properties", "lib/jsverify",
        "numbers/integers",
        "numbers/floats",
        "numbers/rationals",
        "numbers"],
function(properties, jsc,
         integers,
         floats,
         rationals,
         numbers)
{

var V = numbers.V;
var F = numbers.F;

//describe("Integers satisfy", function() {
//  properties.orderedEuclideanRingProperties(integers);
//});

//describe("Floats satisfy", function() {
//   properties.orderedFieldProperties(floats);
//})

//describe("Rationals satisfy", function() {
//  properties.orderedFieldProperties(rationals);
//});

describe("Vectors satisfy", function() {
  properties.innerProductSpaceProperties(V);
});

});
