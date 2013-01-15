/**
 * Infomation board class
 * @class
 * @extends Group
 */
var Infoboard = Class.create(Group, {
	/**
	 * Player
	 * @memberOf Infoboard
	 * @property {String} player Player
	 */
	player: null,
	
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
	 * Background sprite
	 * @memberOf background
	 * @property {Sprite} background Background sprite
	 */
	background: null,
	
	/**
	 * Update information
	 * @memberOf Infoboard
	 * @function
	 */
	update: function() {
		this.handNum.text = '手札：' + this.player.hand.childNodes.length;
		var rank = this.player.rank;
		switch(this.player.rank) {
			case Game.ULTRARICH:
				this.background.image = game.assets['img/ultrarich.png'];
				break;
			case Game.RICH:
				this.background.image = game.assets['img/rich.png'];
				break;
			case Game.COMMONER:
				this.background.image = game.assets['img/commoner.png'];
				break;
			case Game.POOR:
				this.background.image = game.assets['img/poor.png'];
				break;
			case Game.ULTRAPOOR:
				this.background.image = game.assets['img/ultrapoor.png'];
				break;
		}
	},
	
	/**
	 * Player name label
	 * @memberOf Infoboard
	 * @property {Label} name Player name label
	 */
	name: null,
	
	/**
	 * Hand num label
	 * @memberOf Infoboard
	 * @property {Label} handNum Hand num label
	 */
	handNum: null,
	
	// constructor
	initialize: function(player) {
		Group.call(this);
		this.player = player;
		this.rank = player.rank;
		this.x = 0;
		this.y = player.id * 81;
		
		// background
		this.background = new Sprite(186, 81);
		this.background.image = game.assets['img/commoner.png'];
		this.addChild(this.background);
		
		// player name
		this.name = new Label();
		this.name.x = 20;
		this.name.y = 20;
		this.name.font = '20px sans-serif';
		this.name.color = 'black';
		this.name.text = this.player.name;
		this.addChild(this.name);
		
		// hand num
		this.handNum = new Label();
		this.handNum.x = 110;
		this.handNum.y = 50;
		this.handNum.text = '手札：' + this.player.hand.childNodes.length;
		this.addChild(this.handNum);
	}
});