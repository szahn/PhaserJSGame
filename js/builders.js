function buildGame(){
	new GameBuilder(window.game, window.world).build();
}

var GameBuilder = function(game, world){

	function init(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = 0x22222222;
	}

	function build(){
		init();
		new FloorBuilder(game, world).build();
		new WallBuilder(game, world).build();
		new TurretBuilder(game, world).build();
		new TriggerBuilder(game, world).build();
		new BallBuilder(game, world).build();
		new CharacterBuilder(game, world).build();
		new LightingBuilder(game, world).build();
		world.effects = new EffectsBuilder(game, world);
		createUI();
		createFPSCounter();
	}

	return {
		build: build
	};

}

var LightingBuilder = function(game, world){

	function buildLight(){
	    var shadowTexture = game.add.bitmapData(game.width, game.height);
	    var lightSprite = game.add.image(0, 0, shadowTexture);
	    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
	    return shadowTexture;
	}

	function build(){
		world.shadowTexture = buildLight();
	}

	return{
		build: build
	};

}

var EffectsBuilder = function(game, world){

	function buildExplosion(x, y){
		var explosion = game.add.sprite(x, y, 'explosion');
		var animation = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5], 12,  false);
		animation.killOnComplete = true;
		explosion.animations.play('explode');
		explosion.anchor.setTo(0.5, 0.5);
		return explosion;
	}

	return{
		buildExplosion: buildExplosion
	}
}

var FloorBuilder = function(game, world){

	function buildLava(group, x, y){
		var lava = group.create(world.map.tileSize * x, world.map.tileSize * y, 'lava');
		lava.animations.add('boil', [0, 1, 2, 3], 8, true);
		lava.animations.play('boil');
		lava.body.immovable = true;
		return lava;
	}

	function buildTraps(){
		var traps = game.add.group();		
		traps.enableBody = true;
		buildLava(traps, 5, 4);		
		buildLava(traps, 4, 4);		
		buildLava(traps, 4, 5);		
		buildLava(traps, 5, 5);		
		return traps;
	}

	function build(){
		world.traps = buildTraps();
	};

	return {
		build: build
	};
};

var WallBuilder = function(game, world){

	function buildWall(group, x, y){
		var wall = group.create(x * world.map.tileSize, y * world.map.tileSize, 'wall');
		wall.body.immovable = true;
		return wall;
	}

	function buildWalls(){
		var walls = game.add.group();
		walls.enableBody = true;

		for (var x = 0; x < world.map.logicalWidth; x++){
			buildWall(walls, x, 0);
			buildWall(walls, x, world.map.logicalHeight - 1);
		}

		for (var y = 1; y < world.map.logicalHeight - 1; y++){
			buildWall(walls, 0, y);
			buildWall(walls, world.map.logicalWidth - 1, y);
		}

		buildWall(walls, world.map.logicalWidth / 2, world.map.logicalHeight / 2);
		return walls;
	}

	function build(){
		world.walls = buildWalls();
	}

	return {
		build: build
	};
}

var BallBuilder = function(game, world){

	function buildBall(x, y){
		var ball = game.add.sprite(x * world.map.tileSize, y * world.map.tileSize, 'ball');
		ball.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(ball);
		ball.body.bounce.x = 0.5;
		ball.body.bounce.y = 0.5;
		ball.body.collideWorldBounds = true;
		return ball;
	}

	function build(){
		world.ball = buildBall(18, 3);
	}

	return {
		build: build
	};

}

var TriggerBuilder = function(game, world){

	function buildExtractionPoint(x, y){
		var extraction = game.add.sprite(world.map.tileSize * x, 
			y * world.map.tileSize, 'extraction');
		extraction.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(extraction);
		extraction.body.immovable = true;
		return extraction;
	}

	function build(){
		world.extraction = buildExtractionPoint(4, 15);
	}

	return{
		build: build
	};

}

var CharacterBuilder = function(game, world){

	function buildCharacter(x, y){
		var character = game.add.sprite(world.map.tileSize * x, 
			world.map.tileSize * y, 'pc');
		character.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(character);
		character.body.bounce.x = 0.0;
		character.body.bounce.y = 0.0;
		character.body.gravity.x = 0.0;
		character.body.gravity.y = 0.0;
		character.body.collideWorldBounds = true;
		return character;
	}

	function build(){
		world.character = buildCharacter(10, 18)
	}

	return {
		build: build
	};
}

var TurretBuilder = function(game, world){

	function buildTurret(group, x, y, numberOfBullets){
		var turret = group.create(world.map.tileSize * x, 
			world.map.tileSize * y, 'turret');
		turret.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(turret);
		turret.body.immovable = true;

		var gun = game.add.sprite(turret.position.x, 
			turret.position.y, 'gun');
		gun.anchor.setTo(0.5, 0.5);

		turret.gun = gun;

		var bulletPool = game.add.group();
		for (var i = 0; i < numberOfBullets; i++){
			var bullet = game.add.sprite(0, 0, 'bullet');
			bulletPool.add(bullet);
			bullet.anchor.setTo(0.5, 0.5);
			game.physics.arcade.enable(bullet);
			bullet.kill();
		}
		gun.bulletPool = bulletPool;

		return turret;
	}

	function buildTurrets(){
		var turretPool = game.add.group();
		buildTurret(turretPool, 12, 6, 3);
		buildTurret(turretPool, 20, 14, 3);
		return turretPool;
	}


	function build(){
		world.turrets = buildTurrets();
	}

	return{
		build: build
	};
}

function createUI(){
	var tipTextStyle = {font: "12px Arial", fill: "#FFF", align: "center"};
	world.tipText = game.add.text(10, 10, "Push the ball into the extraction point to win.", tipTextStyle);
}

function createFPSCounter(){
	game.time.advancedTiming = true;
    var fpsText = game.add.text(
        SCREEN_WIDTH - 50, 10, '', { font: '12px Arial', fill: '#ffffff' }
    );
    world.fpsText = fpsText;
}