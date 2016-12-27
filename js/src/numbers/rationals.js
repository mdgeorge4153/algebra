define(["numbers/integers", "algebra", "numbers/fractions", "lib/traits"],
function(Ints,               Algebra,   FieldOfFractions,    Traits) {

var rats = new FieldOfFractions(Ints);

return Traits.create({}, Traits.override(Traits(rats), Algebra.OrderedField));

});
