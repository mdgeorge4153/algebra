define(["numbers/rationals", "numbers/vec2", "lib/traits", "algebra"],
function(Rationals,           Vec2,           Traits,       Algebra) {

var result = {};

result.F = Rationals;
result.V = Traits.create({}, Traits.override(Traits(Vec2(result.F)), Algebra.InnerProductSpace));

return result;

});
