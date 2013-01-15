/**
 * Player class
 * @class Player
 * @extends PlayerBase
 */
var Player = Class.create(PlayerBase, {
	/**
	 * Start player's turn.
	 * @memberOf Player
	 * @function
	 */
	startTurn: function() {
		console.log('Player start turn.');
		// Add select events for hand
		for(i = 0; i < this.hand.childNodes.length; i++) {
			var target = this.hand.childNodes[i];
			target.addEventListener(Event.TOUCH_START, target.toggleSelected);
		}
	},
	
	/**
	 * This function executes when user press the pass button.
	 * @memberOf Player
	 * @function
	 */
	passButtonHasPushed: function() {
		game.playerHasEndedTurn();
	},
	
	/**
	 * This function executes when user press the play button.
	 * @memberOf Player
	 * @function
	 */
	playButtonHasPushed: function() {
		console.log('Play button has pushed.');
	 	var selectedCards = [];
	 	
	 	// Pickup selected cards
	 	for(var i = 0; i < this.hand.childNodes.length; i++) {
	 		if(this.hand.childNodes[i].selected) {
	 			selectedCards.push(this.hand.childNodes[i]);
	 		}
	 	}
	 	
	 	if(!this.verifySelected(selectedCards)) {
	 		return false;
	 	}
	 	
	 	// Play animation
		var that = this;
		var endAnimationCount = 0;
	 	for(var i = 0; i < selectedCards.length; i++) {
			selectedCards[i].tl.moveTo(400 + i * 110, 100, 3).then(function() {
				this.visible = false;
				this.toggleSelected();
				this.clearEventListener(Event.TOUCH_START);
				that.hand.removeChild(this);

				endAnimationCount++;
				if(endAnimationCount == selectedCards.length) {
					game.playerHasPlayed(selectedCards);
					that.endTurn();
				}
			});
	 	}
	},
	
	/**
	 * Verify cards that user selected.
	 * @memberOf Player
	 * @function
	 * @param {Array(Card)} cards Array of selected cards.
	 */
	verifySelected: function(cards) {
		var field = game.field.childNodes;
		var result = true;
		
		// Not allow when player don't selected any card.
		if(cards.length == 0) {
	 		return false;
	 	}
	 	
		// Check that selected cards are all same.
		for(var i = 1; i < cards.length; i++) {
			if(cards[0].number != cards[i].number) {
				return false;
			}
		}
		
	 	// Allow when nothing on the field.
	 	if(field.length == 0) {
	 		return true;
	 	}
		
		// Check for same num of cards.
		if(cards.length != field.length) {
			return false;
		}
		
		// Check for magnitude relation of numbers.
		if(Card.compare(cards[0], field[0]) > 0) {
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * This function execute when player's turn has ended.
	 * @memberOf Player
	 * @function
	 */
	endTurn: function() {
		for(var i = 0; i < this.hand.childNodes.length; i++) {
			this.hand.childNodes[i].clearEventListener(Event.TOUCHw_START);
		}
		
		if(this.hand.childNodes.length == 0) {
			console.log('Player is played, and finished turn.');
			game.playerHasFinished();
		} else {
			console.log('Player has ended turn.');
			game.playerHasEndedTurn();
		}
	},
	
	/**
	 * Start to exchanging hands with others.
	 * @memberOf Player
	 * @function
	 */
	exchange: function() {
		var exchangeCards = [];
		var exchangeNum;
		var rank = this.rank;
		if(rank == Game.ULTRARICH || rank == Game.ULTRAPOOR) {
			exchangeNum = 2;
		} else if(rank == Game.RICH || rank == Game.POOR) {
			exchangeNum = 1;
		} else {
			console.log('RANKING ERROR!');
		}
		
		var self = this;
		for(var i = 0; i < this.hand.childNodes.length; i++) {
			// Tap event
			this.hand.childNodes[i].addEventListener(Event.TOUCH_START, function() {

				// Animation
				this.tl.moveTo(game.field.x + exchangeCards.length * 110, game.field.y, 5);
				
				// Add to array
				exchangeCards.push(this);
				this.clearEventListener(Event.TOUCH_START);
				
				// Exchange for other player
				if(exchangeCards.length >= exchangeNum) {
					game.playerHasSelected(exchangeCards, self);
					for(var i = 0; i < self.hand.childNodes.length; i++) {
						self.hand.childNodes[i].clearEventListener(Event.TOUCH_START);
					}
				}

			});
		}
	},
	
	/**
	 * This function executes when cards dealt.
	 * @memberOf Player
	 * @function
	 * @param {Array(Card)} cards Dealt cards.
	 */
	cardsHaveDealt: function(cards) {
		cards = this.sort(cards);
		for(var i = 0; i < cards.length; i++) {
			cards[i].x = 10 + (i % 7) * 110;
			cards[i].y = 330 + Math.floor(i / 7) * 150;
			cards[i].visible = true;
			this.hand.addChild(cards[i]);
		}
	}
});

