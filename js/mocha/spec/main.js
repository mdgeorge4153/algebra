require.config(
	{
		baseUrl:'src/',
		paths:{
			'lib':'../lib',
			'spec':'../spec'
		}
	}
);

require(['require', 'lib/chai', 'lib/mocha'], function(require){
	mocha.setup('bdd');
	require(['spec/test.module'], function(module){
		// note: jsverify is trying to access "process", which seems to be defined
		// incorrectly by someone or other.
		process.argv=[];
		mocha.run();
	});
});
