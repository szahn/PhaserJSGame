window.onload = function(){
	var RENDER_CONTEXT = Phaser.AUTO; //Can be Phaser.CANVAS or Phaser.WEBGL
	var CANVAS_ID = ''; //Automatically create a canvas if blank
	window.game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, RENDER_CONTEXT, CANVAS_ID, {
		preload: preloadAssets, 
		loadUpdate: loadingAssets,
		create: buildGame,
		update: updateGame,
		render: postRenderGame
	});
};