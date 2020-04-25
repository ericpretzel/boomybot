const wm = require('./wordmanager.js');

var usedWords = [];
var players = [];
var playerIndex = -1;
var currentPrompt = '';

var running = false;

module.exports = {
	isRunning: function() {
		return running;
	},

	startGame: function(msg) {
		running = true;
		usedWords = [];
		playerIndex = -1;
		nextPlayer(msg);
	},

	stopGame: function(msg) {
		running = false;
		players = [];
		currentPrompt = '';
	},

	addPlayer: function(user) {
		if (!running) {
			console.log(`adding ${user.tag} to the game`);
			players.push(user);
		}
	},

	removePlayer: function(user) {
		if (running) {
			console.log(`removing ${user.tag} from the game`);
			players.splice(players.indexOf(user), 1);
		}
	}
};

function check(msg) {
	if (msg.author.id != players[playerIndex].id) return; //shouldn't need this...

	var word = msg.content.toLowerCase();
	if (wm.wordIsValid(word) && word.includes(currentPrompt)) {
		if (usedWords.indexOf(word) >= 0) {
			msg.channel.send(`\"${word}\" has already been used.`);
			return false;
		}
		usedWords.push(word);
		msg.channel.send(`\"${word}\" is valid!`);
		nextPlayer(msg);
		return true;
	}
	msg.channel.send(`\"${word}\" is invalid!`);
	return false;
}

function nextPlayer(msg) {
	playerIndex = (playerIndex + 1) % players.length;
	currentPrompt = wm.getPrompt();

	const filter = msg => msg.author.id === players[playerIndex].id;
	const collector = msg.channel.createMessageCollector(filter, {time: 10 * 1000});
	collector.answered = false;
	collector.on('collect', msg => {
		if (check(msg)) {
			collector.answered = true;
			collector.stop();
		}
	});
	collector.on('end', () => {
		if (!collector.answered) {
			msg.channel.send(`<@${players[playerIndex].id}> did not respond in time.`);
			module.exports.removePlayer(players[playerIndex]);
			if (playerIndex === players.length) {
				playerIndex = 0;
			}
			if (players.length === 1) {
				msg.channel.send(`<@${players[playerIndex].id}> wins!`);
				module.exports.stopGame();
			}
		}
	});
	return msg.channel.send(`prompt for <@${players[playerIndex].id}>: ${currentPrompt.toUpperCase()}`);
}