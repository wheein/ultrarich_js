/**
 * Turn marker class.
 * @class
 * @extends Sprite
 */
var Marker = Class.create(Sprite, {
	// constructor
	initialize: function() {
		Sprite.call(this);
		this.image = game.assets['img/marker.png'];
		this.width = 50;
		this.height = 51;
		this.x = 180;
		this.y = 15;
		
		// Set animation
		this.tl
			.moveBy(20, 0, 20, enchant.Easing.SIN_EASEOUT)
			.moveBy(-20, 0, 20, enchant.Easing.SIN_EASEIN)
			.loop();
	},
	
	/**
	 * Move marker to any player's info.
	 * @memberOf Marker
	 * @function
	 * @param {Number} goal Goal of moving. 0 - 4.
	 */
	moveTo: function(goal) {
		this.y = 15 + goal * 81;
	}
});