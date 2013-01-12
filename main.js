/*
 * DAIHUGO with enchant.js
 * @author author yuta.okano@gmail.com
 */
enchant();

var game; // game is a global object.

window.onload = function() {
	game = new Game(960, 640);
	game.start();
};