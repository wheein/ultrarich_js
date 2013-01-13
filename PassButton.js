/**
 * Pass button class.
 * @class
 * @extends Sprite
 */
var PassButton = Class.create(Sprite, {
	initialize: function() {
		Sprite.call(this, 137, 123);
		this.x = 800;
		this.y = 500;
		this.image = game.assets['img/pass_button.png'];
		this.addEventListener(Event.TOUCH_START, function() {
			this.image = game.assets['img/pass_button_down.png'];
			if(game.current == 0) {
				game.players[0].passButtonHasPushed();
			}
		});
		this.addEventListener(Event.TOUCH_END, function() {
			this.image = game.assets['img/pass_button.png'];
		});
	}
});
