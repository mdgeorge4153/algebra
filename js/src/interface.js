define(function() {

var i = 0;
i += 1;


function Interface () {
  this.types        = {};
  this.requirements = [];
  this.operations   = {};
  this.defaults     = {};
}

Interface.prototype.isA = function(supertype) {
  /* TODO: inheritance of other things */

  for (method in supertype.defaults)
    if (!(method in this.defaults))
      this.defaults[method] = supertype.defaults[method];
    else if (this.defaults[method] == supertype.defaults[method])
      continue;
    else
      throw "duplicate default method definition";
};

Interface.prototype.hasTypeParam = function(name) {
  /* TODO */
};

Interface.prototype.hasOperation = function(name, type) {
  /* TODO */
};

Interface.prototype.hasProperty = function(name, type) {
  /* TODO */
};

Interface.prototype.requires = function(operation, property, args) {
  /* TODO */
};

Interface.prototype.addDefaultOperation = function(name, type, impl) {
  if (name in this.defaults)
    throw "Default operation already exists in interface";

  impl = arguments[arguments.length - 1];
  type = Array.prototype.slice.call(arguments, 1, arguments.length - 1);

  /* TODO: store type */
  this.defaults[name] = impl;
};

Interface.prototype.instantiate = function (impl) {
  /* add inherited (default) methods */

  for (var method in this.defaults)
    if (!(method in impl))
      impl[method] = this.defaults[method];

  /* TODO: add check method */
};


Interface.bool    = undefined;
Interface.integer = undefined;

return Interface;

});


