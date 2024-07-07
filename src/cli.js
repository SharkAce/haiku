#!/usr/bin/env node

const { findRhymes, syllableCount } = require('./Algorithms.js');
const fs = require('fs');
const path = require('path');
const consoleGrid = require('console-grid');
const shuffle = require('shuffle-array');
const { Command } = require('commander');

const defaultWordListPath = path.join(__dirname, "../wordlist.txt");
const cli = new Command();

// Set metadata for the automated help options
cli.name("haiku");
cli.description("Set of cli tools to aid in the creation of poems");

// Implement the findRhymes algorithm inside a sub-command of haiku
cli.command("rhyme")
	.description("Search for words that rhyme with the given input words")
	.argument("<WORD...>", "Words to find ryhmes for")
	.option("-n --num <NUM>", "Specify the desired number of matches", 5)
	.option("-w --word-list <FILE>", "Specify the dictionary file path", defaultWordListPath)
	.option("-s --no-shuffle", "Do not randomize the dictionary")
	.action((args, options) => {

		// Initialize the word_list array
		if (!fs.existsSync(options.wordList)) {
			throw new Error("The dictionary file does not exist");
		}
		let word_list = fs.readFileSync(options.wordList, 'utf8').split('\n');
		// Shuffle the dictionary if the shuffle option is not disabled
		if (options.shuffle) {
			shuffle(word_list);
		}

		// Initialize and populate the output grid
		let columns = new Array();
		let rows = Array.from({ "length": options.num }, () => []);
		args.forEach((word) => {
			columns.push(word);
			let results = findRhymes(word, options.num, word_list);
			results.forEach((word, index) => {
				rows[index].push(word);
			});
		});

		// Print the output grid
		consoleGrid({ "columns": columns, "rows": rows });
	});

// Implement the countSyllables algorithm inside a sub-command of haiku
cli.command("count")
	.description("Counts the number of syllables in a text")
	.argument("<TEXT...>", "The texts to count syllables on")
	.action((args) => {

		// Initialize the column headers
		let columns = [''];
		for (let i = 0; i < args.length; i++) {
			columns.push({ "name": `Text ${i+1}`, "align": "center" });
		}

		// Initialize and populate the output row
		let rows = [ ["Syllables:"] ];
		args.forEach((text) => {
			rows[0].push(syllableCount(text));
		});

		// Only show the header if there is more than one argument
		const options = { "headerVisible": args.length > 1 };
		// Print the output grid
		consoleGrid({ "columns": columns, "rows": rows, "options": options });
	});

// Parse command line arguments
cli.parse(process.argv);
