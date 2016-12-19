define(["spec/algebra", "numbers/integers"],
function(properties, integers) {

describe("Integers are an abelian group", function() {
  properties.abelianGroupProperties(integers, {"e": jsc.integer});
});

});
