requirejs.config(
  {
    baseUrl:'src/',
    paths:{
      'lib':'../lib',
      'spec':'../test',
      'jasmine':'../lib/jasmine-2.5.2'
    },
    shim:{
      'jasmine/jasmine-html': {deps: ['jasmine/jasmine']},
      'jasmine/boot':         {deps: ['jasmine/jasmine', 'jasmine/jasmine-html']}
    }
  }
);

requirejs.onError = function(err) {
  console.log(err);
  throw err;
}

require(['jasmine/boot'], function() {
  require(['spec/numbers'], function(module){
    // note: jsverify is trying to access "process", which seems to be defined
    // incorrectly by someone or other.
    //process.argv=[];

    window.onload();
  });
});

