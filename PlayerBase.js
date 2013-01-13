/**
 * Base class of Player class and AI class.
 * @class PlayerBase
 */
var PlayerBase = Class.create({
	/**
	 * Player id
	 * @property {Number} id Player id
	 * @memberOf PlayerBase
	 */
	id: null,
	
	/**
	 * Player name
	 * @property {String} name Player name
	 * @memberOf PlayerBase
	 */
	name: '',
	
	/**
	 * @property {Group} hand player's hand.
	 * @memberOf PlayerBase
	 */
	hand: null,
	
	/**
	 * Player rank
	 * @property {Const} rank Player rank.
	 * @memberOf PlayerBase
	 * @see Game
	 */
	rank: null,
	
	/**
	 * Initialize state
	 * @memberOf PlayerBase
	 * @function
	 * @param {Number} id Player id.
	 * @param {String} name Player name.
	 */
	initialize: function(id, name) {
		this.hand = new Group();
		this.rank = Game.COMMONER;
		this.id = id;
		this.name = name;
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
