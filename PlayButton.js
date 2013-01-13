/**
 * Play button class. When user push this, selected cards from his hand going to the field.
 * @class
 * @extends Sprite
 */
var PlayButton = Class.create(Sprite, {
	initialize: function() {
		Sprite.call(this, 137, 124);
		this.x = 800;
		this.y = 330;
		this.image = game.assets['img/play_button.png'];
		this.addEventListener(Event.TOUCH_START, function() {
			this.image = game.assets['img/play_button_down.png'];
			if(game.current == 0) {
				game.players[0].playButtonHasPushed();
			}
		});
		this.addEventListener(Event.TOUCH_END, function() {
			this.image = game.assets['img/play_button.png']
		});
	}
});
