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
	 * Buffer of cards to exchange.
	 * @memberOf Game
	 * @property {Array(Array(Card))} exchangeBuffer
	 */
	exchangeBuffer: [],
	
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
	 * Infomation board group.
	 * @memberOf Game
	 * @property {Group} Infoboards
	 */
	 infoboards: null,
	
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
			var player = new Player(0, 'あなた');
			this.players.push(player);
			this.players.push(new AI(1, 'AI_1'));
			this.players.push(new AI(2, 'AI_2'));
			this.players.push(new AI(3, 'AI_3'));
			this.rootScene.addChild(player.hand);
			
			// Create infoboards
			var infoboards = new Group();
			infoboards.x = 0;
			infoboards.y = 0;
			for(var i = 0; i < this.players.length; i++) {
				infoboards.addChild(new Infoboard(this.players[i]));
			}
			this.rootScene.addChild(infoboards);
			this.infoboards = infoboards;
			
			// Create marker
			this.marker = new Marker();
			this.rootScene.addChild(this.marker);
			
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
		this.preload('img/play_button_down.png');
		this.preload('img/pass_button.png');
		this.preload('img/pass_button_down.png');
		this.preload('img/background.jpg');
		this.preload('img/ultrarich.png');
		this.preload('img/rich.png');
		this.preload('img/commoner.png');
		this.preload('img/poor.png');
		this.preload('img/ultrapoor.png');
		this.preload('img/marker.png');
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
		
		for(var i = 0; i < this.infoboards.childNodes.length; i++) {
			this.infoboards.childNodes[i].update();
		}
		
		// Exchange players hand after 2nd game.
		// debug start //
		this.gameCount = 2;
		this.players[0].rank = Game.ULTRARICH;
		this.players[1].rank = Game.RICH;
		this.players[2].rank = Game.POOR;
		this.players[3].rank = Game.ULTRAPOOR;
		// debug end //
		
		if(this.gameCount > 1) {
			this.exchangeBuffer = [];
			for(var i = 0; i < this.players.length; i++) {
				this.players[i].exchange();
			}
		} else {
			ranking = [];
			this.current = 0;
			this.marker.moveTo(0);
			this.players[0].startTurn();
		}
	},
	
	/**
	 * This function executes when player has ended turn. Start the next player's turn.
	 * @memberOf Game
	 * @function
	 */
	playerHasEndedTurn: function() {		
		// Next player
		this.current = this.next();
		this.marker.moveTo(this.current);
		
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
		this.infoboards.childNodes[this.current].update();
		
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
		
		// set player rank
		this.ranking.push(this.players[this.current]);
		switch(this.ranking.length) {
			case 1:
				this.players[this.current].rank = Game.ULTRARICH;
				break;
			case 2:
				this.players[this.current].rank = Game.RICH;
				break;
			case 3:
				this.players[this.current].rank = Game.POOR;
				break;
		}
		this.infoboards.childNodes[this.current].update();
		
		if(this.ranking.length >= this.players.length - 1) {
			console.log('All players has finished.');
			var worst = this.next();
			this.ranking.push(this.players[worst])
			this.players[worst].rank = Game.ULTRAPOOR;
			this.infoboards.childNodes[worst].update();
			this.stopGame();
		} else {
			this.current = this.next(); 
			console.log('Next player is ' + this.current);
			this.marker.moveTo(this.current);
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
	},
	
	/**
	 * This function execute when player has selected to exchange cards.
	 * @memberOf Game
	 * @function
	 * @param {Array(Card)} To exchange card.
	 * @param {Player} Owner of cards.
	 */
	playerHasSelected: function(cards, owner) {
		this.exchangeBuffer.push({
			rank :owner.rank,
			cards: cards
		});
		console.log(this.exchangeBuffer);
		
	}
});

/**
 * Const of ranking
 * @static
 * @memberOf Game
 */
Game.ULTRARICH = 5;
Game.RICH = 4;
Game.COMMONER = 3;
Game.POOR = 2;
Game.ULTRAPOOR = 1;