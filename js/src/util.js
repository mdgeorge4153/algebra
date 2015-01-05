define({

memoize: function memoize(f) {
  var memoTable = {};

  return function (x) {
    if (x in memoTable)
      return memoTable[x];
    var result = f(x);
    memoTable[x] = result;
    return result;
  };
};

});
