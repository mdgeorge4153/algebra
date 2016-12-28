requirejs.config(
  {
    baseUrl:'src/',
    paths:{
      'lib':'../lib',
      'test':'../test',
      'jasmine':'../lib/jasmine-2.5.2'
    },
    shim:{
      'jasmine/jasmine-html': {deps: ['jasmine/jasmine']},
      'jasmine/boot':         {deps: ['jasmine/jasmine', 'jasmine/jasmine-html']},
      "lib/traits": { exports: "Trait" }
    }
  }
);

requirejs.onError = function(err) {
  console.log(err);
  throw err;
}

Error.stackTraceLimit=100;

require(['jasmine/boot'], function() {
  require(['test/numbers.spec',
           'test/pQueue.spec'
          ], function(module){
    // note: jsverify is trying to access "process", which seems to be defined
    // incorrectly by someone or other.
    //process.argv=[];

    window.onload();
  });
});

