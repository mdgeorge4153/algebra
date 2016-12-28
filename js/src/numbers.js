define(["numbers/rationals", "numbers/vec2", "numbers/mat2", "lib/traits", "algebra"],
function(Rationals,           Vec2,           Mat2,           Traits,       Algebra) {

var result = {};

result.F = Rationals;
result.V = Traits.create({}, Traits.override(Traits(Vec2(result.F)), Algebra.InnerProductSpace));
result.M = Traits.create({}, Traits.override(Traits(Mat2(result.V)), Algebra.AssociativeAlgebra));

return result;

});
