const game = require('../game.js');
module.exports = {
	name: 'start',
	description: 'Starts a new BombParty game.',
	execute(msg, args) {
		//default 20 second timeout
		var seconds = !args[0] ? 20 : args[0];

		msg.channel.send(`${} React to join!`)
			.then(msg => msg.react('👌'))
			.then(msgReaction => {
				var msg = msgReaction.message;
				const filter = (reaction, user) => reaction.emoji.name === '👌' && !user.bot;
				const collector = msg.createReactionCollector(filter, {time: seconds * 1000});
				collector.on('collect', (reaction, user) => {

					game.addPlayer(user);
				});
				collector.on('remove', (reaction, user) => {
					game.removePlayer(user);
				});
				collector.on('end', (collected) => {
					if (collected.size >= 2) {
						msg.channel.send('Game started.');
						game.startGame(msg);
					} else {
						msg.channel.send('Game cannot start without at least 2 people.');
					}
				});
			})
			.catch(console.error());
	}
}