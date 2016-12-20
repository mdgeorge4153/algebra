define(["spec/algebra", "lib/jsverify",
        "numbers/integers",
        "numbers/floats"],
function(properties, jsc, integers, floats) {

describe("Integers are an abelian group", function() {
  properties.abelianGroupProperties(integers, {"e": jsc.integer});
});

});
