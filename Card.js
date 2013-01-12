/**
 * Card class
 * @class
 * @extends Sprite
 * @param {String} image File name of a card image.
 * @property {Boolean} selected Whether card is selected or not.
 * @property {String} suit Suit of card.
 * @property {Number} number Number of card.
 */
var Card = Class.create(Sprite, {
	initialize: function(image) {
		Sprite.call(this, 100, 140);
		var result = image.split('.')[0];
		result = result.split('_');
		this.suit = result[0];
		this.number = parseInt(result[1], 10);
		this.image = game.assets['img/' + image];
		this.visible = false;
		this.selected = false;
	},
	/**
	 * Toggle selected when player has selected this card.
	 * @function
	 * @memberOf Card
	 */
	toggleSelected: function() {
		this.selected = !this.selected;
		if(this.selected) {
			this.y -= 30;
		} else {
			this.y += 30;
		}
	}
});

/**
 * Order of card numbers.
 * @static
 * @memberOf Card
 */
Card.order = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2];

/**
 * This function compares numbers of 2 cards(card1, card2).
 * Usage:
 *     Card.compare(card1, card2)
 * Returns:
 *     0: card1 = card2
 *     1: card1 > card2
 *    -1: card1 < card2
 * @static
 * @memberOf Card
 */
Card.compare = function(card1, card2) {
	var result = null;
	if(card1.number == card2.number) {
		result = 0;
	} else if(Card.order.indexOf(card1.number) > Card.order.indexOf(card2.number)) {
		result = 1;
	} else {
		result = -1;
	}
	return result;
};
