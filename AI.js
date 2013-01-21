/**
 * AI class
 * @class AI
 * @extends PlayerBase
 */
var AI = Class.create(PlayerBase, {
	/**
	 * Start AI's turn.
	 * @memberOf AI
	 * @function
	 */
	startTurn: function() {
		var field = game.field.childNodes;
		var hand = this.hand.childNodes;
		var strategy = this.plan(field, hand);
		var that = this;
		setTimeout(function() {
			strategy.call(that);
		}, 500);
	},
	
	/**
	 * End AI's turn.
	 * @memberOf AI
	 * @function
	 */
	endTurn: function() {
		// End turn or Finish game
		if(this.hand.childNodes.length > 0) {
			game.playerHasEndedTurn();
			console.log('AI has ended turn.');
		} else {
			game.playerHasFinished();
			console.log('AI has FINISHED!');
		}
	},
	
	/**
	 * Plan an only strategy from cards of field and hand.
	 * @memberOf AI
	 * @param {Array(Card)} field Cards on the field.
	 * @param {Array(Card)} hand Cards of hands.
	 * @function
	 */
	plan: function(field, hand) {
		var result = null;
		var playableCards = this.getPlayableCards(field, hand);
		if(playableCards.length > 0) {
			if(field.length > 1) {
				result = this.playMultiCards;
			} else if(field.length == 1) {
				result = this.playSingleCard;
			} else {
				result = this.playAnyCard;
			}
		} else {
			result = this.pass;
		}
		
		return result;
	},
	
	/**
	 * Get playable cards.
	 * @memberOf AI
	 * @param {Array(Card)} field Cards on the field.
	 * @param {Array(Card)} hand Cards of hands.
	 * @returns {Array(Card)} Playable cards.
	 * @function
	 */
	getPlayableCards: function(field, hand) {
		var result = [];
		
		if(field.length == 0) {
			result.push(hand[0]);
		} else if(field.length <= 1) {
			// single card
			for(var i = 0; i < hand.length; i++) {
				if(Card.compare(hand[i], field[0]) > 0) {
					result.push(hand[i]);
					break;
				}
			}
		} else {
			// some cards
			// split cards
			var sets = [];
			var setCount = 0;
			var before = hand[0];
			sets[0] = [];
			for(var i = 0; i < hand.length; i++) {
				if(Card.compare(before, hand[i]) == 0) {
					sets[setCount].push(hand[i]);
				} else {
					setCount++;
					before = hand[i];
					sets[setCount] = [hand[i]];
				}
			}
			
			// compare cards num
			var sameNumSets = [];
			for(var i = 0; i < sets.length; i++) {
				if(field.length == sets[i].length) {
					sameNumSets.push(sets[i]);
				}
			}
			
			// compare card number
			var playableSets = [];
			for(var i = 0; i < sameNumSets.length; i++) {
				if(Card.compare(sameNumSets[i][0], field[0]) > 0) {
					playableSets.push(sameNumSets[i]);
				}
			}
			
			// result
			if(playableSets.length > 0) {
				result = playableSets;
			}
		}
		
		return result;
	},
	
	/**
	 * Pass this turn.
	 * @memberOf AI
	 * @function
	 */
	pass: function() {
		this.endTurn();
	},
	
	/**
	 * Play any card to field.
	 * @memberOf AI
	 * @function
	 */
	 playAnyCard: function() {
	 	var card = this.hand.firstChild;
		var that = this;
		this.playAnimation([card], function() {
			that.hand.removeChild(card);
		 	game.playerHasPlayed([card]);
			that.endTurn();
		});
	},
	
	/**
	 * Play a card to field.
	 * @memberOf AI
	 * @function
	 */
	playSingleCard: function() {
		var playable = this.getPlayableCards(game.field.childNodes, this.hand.childNodes);
		var that = this;
		this.playAnimation([playable[0]], function() {
			var card = playable[0];
			that.hand.removeChild(card);
			game.playerHasPlayed([card]);
			that.endTurn();
		});
	},
	
	/**
	 * Play some cards to field.
	 * @memberOf AI
	 * @function
	 */
	playMultiCards: function() {
		var playable = this.getPlayableCards(game.field.childNodes, this.hand.childNodes);
		game.playerHasPlayed(playable[0]);
		for(var i = 0; i < playable[0].length; i++) {
			this.hand.removeChild(playable[0][i]);
		}
		this.endTurn();
	},
	
	/**
	 * Play an animation of playing cards.
	 * @memberOf AI
	 * @function
	 * @param {Array(Card)} cards Cards to play.
	 * @param {Function} callback Callback function when animation has finished.
	 */
	playAnimation: function(cards, callback) {
		var endAnimeCount = 0;
		for(var i = 0; i < cards.length; i++) {
			game.rootScene.addChild(cards[i]);
			cards[i].x = 80;
			cards[i].y = 60 * this.id;
			cards[i].visible = true;
			cards[i].tl.moveTo(game.field.x, game.field.y, 4).delay(10).then(function() {
				game.rootScene.removeChild(this);
				
				endAnimeCount++;
				if(endAnimeCount >= cards.length) {
					callback();
				}
			});
		}
	},
	
	/**
	 * Start to exchanging hands with others.
	 * @memberOf AI
	 * @function
	 */
	exchange: function() {
		var exchangeCards = [];
		switch(this.rank) {
			case Game.ULTRARICH:
				exchangeCards.push(this.hand.childNodes[0]);
				exchangeCards.push(this.hand.childNodes[1]);
				break;
			case Game.RICH:
				exchangeCards.push(this.hand.firstChild);
				break;
			case Game.POOR:
				exchangeCards.push(this.hand.lastChild);
				break;
			case Game.ULTRAPOOR:
				exchangeCards.push(this.hand.childNodes[this.hand.childNodes.length - 1]);
				exchangeCards.push(this.hand.childNodes[this.hand.childNodes.length - 2]);
				break;
		}
		
		// remove to exchange cards from hand
		for(var i = 0; i < exchangeCards.length; i++) {
			this.hand.removeChild(exchangeCards[i]);
		}
		
		game.playerHasSelected(exchangeCards, this);
	},
	
	/**
	 * This function executes when cards dealt.
	 * @memberOf AI
	 * @function
	 * @param {Array(Card)} cards Dealt cards.
	 */
	cardsHaveDealt: function(cards) {
		cards = this.sort(cards);
		for(var i = 0; i < cards.length; i++) {
			this.hand.addChild(cards[i]);
		}
	},
	
	/**
	 * This function executes when exchanged cards from other player.
	 * @memberOf AI
	 * @function
	 * @param {Array(Card)} cards Exchanged cards
	 */
	cardsWereExchanged: function(cards) {
		for(var i = 0; i < cards.length; i++) {
			for(var j = 0; j < this.hand.childNodes.length; j++) {
				if(Card.compare(this.hand.childNodes[j], cards[i]) >= 0) {
					this.hand.insertBefore(cards[i], this.hand.childNodes[j]);
					break;
				}
			}
		}
	}
});

