//load words from local text file
var words = require('fs').readFileSync('dict.txt').toString().split('\n');

exports.wordIsValid = function(word) {
	return (words.indexOf(word) >= 0);
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
exports.getPrompt = function() {
	var prompt = '';
	let promptLength = 2 + Math.floor(Math.random() * 2);
	do {
		prompt = '';
		for (let i = 0; i < promptLength; i++) {
			prompt += alphabet.charAt(Math.floor(Math.random() * 26));
		}
	} while (!promptIsValid(prompt));
	return prompt;
}

function promptIsValid(prompt) {
	var counter = 0;
	for (var word of words) {
		if (word.includes(prompt)) {
			if (++counter >= 1000) return true;
		}
	}
	return counter >= 1000;
}