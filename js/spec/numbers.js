define(["spec/algebra", "numbers/integers", "lib/jsverify"],
function(properties,     integers,           jsc) {

describe("Integers are an abelian group", function() {
  properties.abelianGroupProperties(integers, {"e": jsc.integer});
});

});
