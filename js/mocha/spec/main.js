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
	// require(['spec/test.module', 'spec/test.script'], function(module){
	require(['spec/test.module'], function(module){
		console.log("module: ", module);
		mocha.run();
	});
});
