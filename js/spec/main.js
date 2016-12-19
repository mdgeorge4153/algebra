require("amd-loader");

var jsc      = require("jsverify");
var algebra  = require("src/algebra");
var integers = require("numbers/integers");

describe('Integers are an abelian group', function() {
  abelianGroupProperties(Integers, {"e":jsc.integer});
});


