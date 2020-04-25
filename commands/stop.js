const game = require('../game.js');
module.exports = {
	name: 'stop',
	description: 'Stops the current game, if there is one.',
	execute(msg, args) {
		if (game.isRunning()) {
			msg.channel.send('Game stopped.');
			return game.stopGame(msg);
		}
		return msg.channel.send('There\'s not a game running.');
	}
}