window.world = {
	state : {
		won: false
	},

	player: {
		speed: 200,
		speedTick: 100
	},

	constants: {
		turrets:{
			shotDelayMs: 500,
			bulletSpeed: 125,
			viewDistance: 8,
			rotationAmount: 0.1
		}
	},

	map:{
		tileSize: 30,		
		width: 800,
		height: 600
	}
};

(function(){
	world.map.logicalWidth = world.map.width / world.map.tileSize;
	world.map.logicalHeight = world.map.height / world.map.tileSize;
})();

