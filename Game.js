/**
 * Game class
 * @class Game
 * @extends Core
 */
var Game = Class.create(Core, {
	/**
	 * All players list.
	 * @memberOf Game
	 * @property {Array(Player)} players
	 */
	players: [],
	
	/**
	 * Player's ranking. Store player's id in this array. [ULTRARICH, RICH, POOR, ULTRAPOOR].
	 * @memberOf Game
	 * @property {Array(Number)} ranking 
	 */
	ranking: [],
	
	/**
	 * Cardset that will used on the game.
	 * @memberOf Game
	 * @property {Array(Card)} cardset
	 */
	cardset: [],
	
	/**
	 * Count of gameplay.
	 * @memberOf Game
	 * @property {Number} gameCount
	 */
	gameCount: 0,
	
	/**
	 * This number is used to describe current player. 0:Player, 1:AI1, 2:AI2, 3:AI3.
	 * @memberOf Game
	 * @property {Number} current
	 */
	current: 0,
	
	/**
	 * Cards on game field.
	 * @memberOf Game
	 * @property {Field} field
	 */
	field: null,
	
	/**
	 * Player id who played cards recently.
	 * @memberOf Game
	 * @property {Number} fieldOwner
	 */
	fieldOwner: null,
	
	/**
	 * Constructor of Game class.
	 * @memberOf Game
	 * @function
	 */
	initialize: function(width, height) {
		console.log('Game has created.');
		Core.call(this, width, height);
		this.fps = 30;
		this.setPreloads();
		
		this.onload = function() {
			// Create background
			var background = new Sprite(960, 640);
			background.image = game.assets['img/background.jpg'];
			game.rootScene.addChild(background);
			
			// Create buttons
			this.rootScene.addChild(new PlayButton());
			this.rootScene.addChild(new PassButton());
			
			// Create field
			this.field = new Field();
			this.rootScene.addChild(this.field);
		
			// load cards
			var loadCardset = function() {
				var result = [];
				for(var i = 0; i < cards.length; i++) {
					var card = new Card(cards[i]);
					result.push(card);
				}
				return result;
			};
			this.cardset = loadCardset();
			
			// create players
			var player = new Player(0);
			this.players.push(player);
			this.players.push(new AI(1));
			this.players.push(new AI(2));
			this.players.push(new AI(3));
			this.rootScene.addChild(player.hand);
			
			// start game
			this.startGame();
		};
	},
	
	/**
	 * Preload resource files.
	 * @memberOf Game
	 * @function
	 */
	setPreloads: function() {
		for(var i = 0; i < cards.length; i++) {
			this.preload('img/' + cards[i]);
		}
		this.preload('img/play_button.png');
		this.preload('img/pass_button.png');
		this.preload('img/background.jpg');
		this.preload('img/ultrarich.png');
		this.preload('img/rich.png');
		this.preload('img/poor.png');
		this.preload('img/ultrapoor.png');
	},
	
	/**
	 * Start a game.
	 * @memberOf Game
	 * @function
	 */
	startGame: function() {
		console.log('Game has started.');
		for(var i = 0; i < this.players.length; i++) {
			this.players[i].reset();
		}
		this.gameCount += 1;
		this.cardset = this.shuffle(this.cardset);
		this.deal(this.cardset);
		
		// Exchange players hand after 2nd game.
		if(this.gameCount > 1) {
			for(var i = 0; i < this.players.length; i++) {
				this.players[i].exchange();
			}
		}
		
		ranking = [];
		this.current = 0;
		this.players[0].startTurn();
	},
	
	/**
	 * This function executes when player has ended turn. Start the next player's turn.
	 * @memberOf Game
	 * @function
	 */
	playerHasEndedTurn: function() {
		// Next player
		this.current = this.next();
		
		// Clear field
		if(this.current == this.fieldOwner) {
			this.clearField();
		}
		
		this.players[this.current].startTurn();
	},
	
	/**
	 * Clear cards on game field.
	 * @memberOf Game
	 * @function
	 */
	clearField: function() {
		while(this.field.childNodes.length > 0) {
			this.field.removeChild(this.field.firstChild);
		}
	},
	
	/**
	 * This function executes when player has played some cards.
	 * @memberOf Game
	 * @function
	 * @param {Array(Card)} cards Played cards.
	 */
	playerHasPlayed: function(cards) {
		this.clearField();
		
		// Move cards to field from hand.
		for(var i = 0; i < cards.length; i++) {
			cards[i].x = i * 110;
			cards[i].y = 0;
			this.field.addChild(cards[i]);
			cards[i].visible = true;
		}
		
		// Change field card's owner.
		this.fieldOwner = this.current;
	},
	
	/**
	 * This function executes when player has finished his game.
	 * @memberOf Game
	 * @function
	 */
	playerHasFinished: function() {
		console.log('Player has finished game.');
		this.clearField();
		this.ranking.push(this.players[this.current]);
		if(this.ranking.length >= this.players.length - 1) {
			console.log('All players has finished.');
			this.stopGame();
		} else {
			this.current = this.next(); 
			console.log('Next player is ' + this.current);
			this.players[this.current].startTurn();
		}
	},
	
	/**
	 * Shuffle cardset.
	 * @memberOf Game
	 * @function
	 * @param {Array(Card)} cards Cardset to shuffle.
	 * @return {Array(Card)} Shuffled cardset.
	 */
	shuffle: function(cards) {
		var result = [];
		while(cards.length > 0) {
			result.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
		}
		return result;
	},
	
	/**
	 * Deal cards for all players.
	 * @memberOf Game
	 * @function
	 * @param {Array(Card)} cards Cardset to deal
	 */
	deal: function(cards) {
		console.log('Cards has dealed.');
		var cardsetLength = cards.length;
		var handNum = cardsetLength / this.players.length;
		for(var i = 0; i < this.players.length - 1; i++) {
			this.players[i].cardsHaveDealt(cards.slice(i * handNum, i * handNum + handNum));
		}
		this.players[i].cardsHaveDealt(cards.slice(i * handNum));
	},
	
	/**
	 * Load all cards from image files.
	 * @memberOf Game
	 * @function
	 * @return {Array(Card)} Card object array.
	 */
	loadCards: function() {
		console.log('Load cardset.');
		return [];
	},
	
	/**
	 * Get next player's id.
	 * @memberOf Game
	 * @function
	 * @return {Number} Next player's id
	 */
	next: function() {
		for(var i = 1; i < this.players.length; i++) {
			var target = (this.current + i) % this.players.length;
			if(this.players[target].hand.childNodes.length > 0) {
				return target;
			}
		}
		alert('次のプレイヤーがいません');
		return false;
	},
	
	/**
	 * Stop game when all players are finished.
	 * @memberOf Game
	 * @function
	 */
	stopGame: function() {
		console.log('Game has stopped.');
		if(window.confirm(this.gameCount + '回戦が終了しました。次の試合をやりますか？')) {
			this.startGame();
		} else {
			console.log('Game has finished');
			this.stop();
		}
	}
});