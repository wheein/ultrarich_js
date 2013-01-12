/**
 * Base class of Player class and AI class.
 * @class PlayerBase
 */
var PlayerBase = Class.create({
	/**
	 * @property {Group} hand player's hand.
	 * @memberOf PlayerBase
	 */
	hand: null,
	
	/**
	 * Player information board
	 * @property {Label} info player's infomation.
	 * @memberOf PlayerBase
	 */
	info: Group,
	
	/**
	 * Update information board.
	 * @memberOf PlayerBase
	 * @function
	 */
	updateInfo: function() {
		this.info.text = this.hand.childNodes.length + '枚';
	},
	
	/**
	 * Initialize state
	 * @memberOf PlayerBase
	 * @function
	 */
	initialize: function(id) {
		this.hand = new Group();
		
		var info = new Label();
		info.x = 10;
		info.y = 60 * id + 50;
		info.color = '#ffffff';
		info.font = '50px serif';
		this.info = info;
		game.rootScene.addChild(this.info);
	},
	
	/**
	 * Reset state
	 * @memberOf PlayerBase
	 * @function
	 */
	reset: function() {
		while(this.hand.childNodes.length > 0) {
			this.hand.removeChild(this.hand.firstChild);
		}
		this.info.text = '';
	},
	
	/**
	 * Start player's turn
	 * @memberOf PlayerBase
	 * @function
	 */
	startTurn: function() {
	},
	
	/**
	 * Exchange hands with other players.
	 * @memberOf PlayerBase
	 * @function
	 */
	exchange: function() {
	},
	
	/**
	 * Sort array of cards.
	 * @memberOf PlayerBase
	 * @function
	 */
	 sort: function(cards) {
		for(var i = 0; i < cards.length - 1; i++) {
			for(var j = i + 1; j < cards.length; j++) {
				if(Card.order.indexOf(cards[i].number) > Card.order.indexOf(cards[j].number)) {
					var buf = cards[i];
					cards[i] = cards[j];
					cards[j] = buf;
				}
			}
		}
		return cards;
	 }
});
