function updateGame(){
	updateCharacter();
	updateBall();
	updateTurrets();
	updateLighting();

	if (game.time.fps !== 0) {
		world.fpsText.setText(game.time.fps + ' FPS');
	}

}

function updateTurrets(){
	game.physics.arcade.collide(world.turrets, world.ball);

    if (!world.character.exists){
    	return;
    }

	game.physics.arcade.collide(world.turrets, world.character);
	world.turrets.forEach(updateTurret);    	
}

function updateTurret(turret){
    if (game.physics.arcade.distanceBetween(turret, world.character) < world.map.tileSize * world.constants.turrets.viewDistance){
        turret.gun.targetRotation = game.physics.arcade.angleToXY(turret.gun,
        	world.character.position.x, world.character.position.y);
        shootBullet(turret.gun);
    }

	if (turret.gun.rotation < turret.gun.targetRotation){
		turret.gun.rotation += world.constants.turrets.rotationAmount;
	}
	else if (turret.gun.rotation > turret.gun.targetRotation){
		turret.gun.rotation -= world.constants.turrets.rotationAmount;
	}

    game.physics.arcade.collide(turret.gun.bulletPool, world.walls, function(bullet, wall) {
		bullet.kill();
	}, null, this);

    game.physics.arcade.collide(turret.gun.bulletPool, world.character, function(bullet, character) {
		bullet.kill();
		killCharacter();
    }, null, this);
}

function updateBall(){
	if (!world.ball.exists){
		return;
	}

	game.physics.arcade.collide(world.ball, world.walls);	
	game.physics.arcade.collide(world.traps, world.ball, function(){
		killBall();
	});
}

function updateCharacter(){
	if (!world.character.exists){
		return;
	}

	game.physics.arcade.collide(world.character, world.walls);
	game.physics.arcade.collide(world.character, world.ball);
	game.physics.arcade.collide(world.character, world.traps, function(){
		killCharacter();
	});	

    if (game.input.mousePointer.isDown)
    {
        game.physics.arcade.moveToPointer(world.character, world.player.speed);
        /*if (world.character.speed < world.player.speed){
        	world.character.speed += world.player.speedTick;
        }*/

        if (Phaser.Rectangle.contains(world.character.body, game.input.x, game.input.y))
        {
            world.character.body.velocity.setTo(0, 0);
        }

        game.physics.arcade.overlap(world.ball, world.extraction, function(){
        	if (!world.state.won){
        		world.state.won = true;
		        world.character.body.velocity.setTo(0, 0);
		        world.extraction.kill();
	        	win();
        	}
        });
    }
    else
    {
    	/*if (world.character.speed > 0){
        	world.character.speed -= world.player.speedTick;
    	}*/

        world.character.body.velocity.setTo(0, 0);
    }
}

function postRenderGame(){

}

function shootBullet(gun){
	if (gun.lastBulletShotAt === undefined) gun.lastBulletShotAt = 0;
	if (game.time.now - gun.lastBulletShotAt < world.constants.turrets.shotDelayMs) return;

	gun.lastBulletShotAt = game.time.now;
	var bullet = gun.bulletPool.getFirstDead();

	if (bullet === null || bullet === undefined) return;  

	bullet.revive();

    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    bullet.reset(gun.x, gun.y);
    bullet.rotation = gun.rotation;

    bullet.body.velocity.x = Math.cos(bullet.rotation) * world.constants.turrets.bulletSpeed;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * world.constants.turrets.bulletSpeed;	
}


function killCharacter(){
	world.effects.buildExplosion(world.character.position.x, world.character.position.y);
	world.character.kill();
	world.tipText.setText("YOU HAVE DIED");
}

function killBall(){
	world.effects.buildExplosion(world.ball.position.x, world.ball.position.y);
	world.ball.kill();
	world.tipText.setText("YOU HAVE LOST THE BALL");
}

function win(){

	world.tipText.setText("YOU WIN!");
}

function updateLighting(){
    // Draw shadow
    var LIGHT_RADIUS = 100;
    world.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    world.shadowTexture.context.fillRect(0, 0, game.width, game.height);

    // Draw circle of light with a soft edge
    var gradient = world.shadowTexture.context.createRadialGradient(
        world.character.position.x, world.character.position.y, LIGHT_RADIUS * 0.75,
        world.character.position.x, world.character.position.y, LIGHT_RADIUS);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    world.shadowTexture.context.beginPath();
    world.shadowTexture.context.fillStyle = gradient;
    world.shadowTexture.context.arc(world.character.position.x, world.character.position.y,
        LIGHT_RADIUS, 0, Math.PI*2);
    world.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    world.shadowTexture.dirty = true;	
}