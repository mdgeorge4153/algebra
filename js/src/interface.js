define(function() {

function Interface () {
  this.types        = []; /* list of strings */
  this.requirements = []; /* TODO */
  this.operations   = {}; /* name -> type [args, return] */
  this.properties   = {}; /* name -> type */
  this.defaults     = {}; /* name -> impl (types are in this.operations) */
}

Interface.isImplementation = function isImplementation (inter, impl) {
  return "interfaces" in impl && impl.interfaces.indexOf(inter) != -1;
};

function typeEq(t1, t2) {
  if (t1.length !== t2.length)
    return false;

  for (var i in t1)
    if (t1[i] !== t2[i])
      return false;

  return true;
}

Interface.prototype.isA = function(supertype) {
  for (var name in supertype.types)
    this.hasTypeParam(name);

  /* TODO: requirements */

  for (var name in supertype.operations)
    this.hasOperation(name, supertype.operations[name]);

  for (var name in supertype.properties)
    this.hasProperty(name, supertype.properties[name]);

  for (var name in supertype.defaults)
    this.addDefaultOperation(name, supertype.operations[name], supertype.defaults[name]);
};

Interface.prototype.hasTypeParam = function(name) {
  if (this.types.indexOf(name) == -1)
    this.types.push(name);
};

Interface.prototype.hasOperation = function(name, type) {
  if (!(name in this.operations))
    this.operations[name] = type;

  else if (typeEq(type, this.operations[name]))
    {} /* do nothing */

  else
    throw "duplicate operation " + name;

  return name;
};

Interface.prototype.hasProperty = function(name, type) {
  if (!(name in this.properties))
    this.properties[name] = type;
  else if (this.properties[name] === type)
    {} /* do nothing */
  else
    throw "duplicate property " + name;

  return name;
};

Interface.prototype.requires = function(operation, property, args) {
  /* TODO */
};

Interface.prototype.addDefaultOperation = function(name, type, impl) {
  this.hasOperation(name, type);

  if (!(name in this.defaults))
    this.defaults[name] = impl;

  else if (this.defaults[name] === impl)
    {} /* do nothing */

  else
    throw "duplicate default method implementation: " + name;

  return name;
};

function checkInterfaces(types) {
  /* TODO */
}

Interface.prototype.instantiate = function (impl) {
  /* add inherited (default) methods */

  for (var method in this.defaults)
    if (!(method in impl))
      impl[method] = this.defaults[method];

  if (!("interfaces" in impl))
    impl.interfaces = [];

  impl.interfaces.push(this);
  impl.checkInterfaces = checkInterfaces;
};

function eq (a,b) { return a === b; }

Interface.bool     = "bool";
Interface.boolSpec = {
  examples: [true, false],
  check:    function (b) { return typeof b === "boolean"; },
  eq:       eq
};

Interface.integer     = "integer";
Interface.integerSpec = {
  examples: [-1000, -10, -1, 0, 1, 2, 3, 10, 1000],
  check:    function (i) { return typeof i === "number" && i % 1 === 0; },
  eq:       eq
};

Interface.number     = "number";
Interface.numberSpec = {
  examples: [-Infinity, -10000000, -1.5, -1, -0.00001, 0, 0.00001, 1, 10, 1000000, Infinity],
  check:    function (f) { return typeof f === "number"; }
}

return Interface;

});


