/**
 * Infomation board class
 * @class
 * @extends Sprite
 */
var Infoboard = Class.create(Sprite, {
	/**
	 * Player name
	 * @memberOf Infoboard
	 * @property {String} name Player name
	 */
	name: '',
	
	/**
	 * Player rank
	 * @memberOf Infoboard
	 * @property {Game.RANK} rank Player rank
	 * @see Game
	 */
	rank: null,
	
	/**
	 * Num of player hands
	 * @memberOf Infoboard
	 * @property {Number} handNum Num of player hands
	 */
	handNum: 0,
	
	/**
	 * Infoboard id of player
	 * @memberOf Infoboard
	 * @property {Number} id Infoboard id of player.
	 */
	id: null,
	
	// constructor
	initialize: function(id) {
		Sprite.call(this);
		this.id = id;
		this.rank = game.players[id].rank;
	}
});