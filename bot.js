const Discord = require('discord.js');
const auth = require('./auth.json');
const fs = require('fs');

//bot startup
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.login(auth.token);
bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.tag);
});

//bot reads messages
bot.on('message', msg => {
    if (msg.author.id === bot.user.id) return;
    //msg is a command
    if (msg.content.substring(0, 1) === '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        
        console.log(cmd);

        args = args.splice(1);

        if (!bot.commands.has(cmd)) {
            return msg.reply('invalid command.');
        }

        try {
            bot.commands.get(cmd).execute(msg, args);
        } catch (err) {
            console.error(err);
            return msg.reply('Something went wrong.');
        }
    }
});
